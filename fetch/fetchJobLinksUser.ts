import { ElementHandle, Page, TimeoutError } from "puppeteer";
import LanguageDetect from "languagedetect";

import buildUrl from "../utils/buildUrl";
import wait from "../utils/wait";
import selectors from "../selectors";
import config from "../config";
import { checkJobDescription } from "./checkJobDescription";
import { LogLevel } from "../constants/logger-constants";
import { getLogger } from "../utils/logger";

const MAX_PAGE_SIZE = 7;
const languageDetector = new LanguageDetect();
const logger = getLogger();
async function getJobSearchMetadata({
  page,
  location,
  keywords,
}: {
  page: Page;
  location: string;
  keywords: string;
}) {
  try {
    await page.goto("https://linkedin.com/jobs", {
      waitUntil: "domcontentloaded",
    });
    // Wait for the keyword input to be visible and type the keywords

    await page.waitForSelector(selectors.keywordInput, { visible: true });
    await page.type(selectors.keywordInput, keywords);

    // Wait for the location input to be visible
    await page.waitForSelector(selectors.locationInput, { visible: true });

    // Set the location input value
    await page.$eval(
      selectors.locationInput,
      (el, location) => ((el as HTMLInputElement).value = location),
      location
    );

    // Type a space in the location input to trigger the location dropdown
    await page.type(selectors.locationInput, " ");

    // Click the search button
    await page.$eval("button.jobs-search-box__submit-button", (el) =>
      el.click()
    );

    await page.waitForFunction(() =>
      new URLSearchParams(document.location.search).has("geoId")
    );
  } catch (error) {
    console.error(`Error waiting for selector: ${error}`);
  }

  const geoId = await page.evaluate(() =>
    new URLSearchParams(document.location.search).get("geoId")
  );
  let numAvailableJobs;

  try {
    const numJobsHandle = (await page.waitForSelector(
      selectors.searchResultListText,
      { timeout: 7000 }
    )) as ElementHandle<HTMLElement>;
    numAvailableJobs = await numJobsHandle.evaluate((el) =>
      parseInt((el as HTMLElement).innerText.replace(",", ""))
    );
  } catch (error) {
    console.error(`Error waiting for selector: ${error}`);
  }

  return {
    geoId,
    numAvailableJobs,
  };
}

interface FetchJobLinksUserParams {
  page: Page;
  location: string;
  keywords: string;
  datePosted: string;
  workplace: { remote: boolean; onSite: boolean; hybrid: boolean };
  jobTitle: string;
  jobDescription: {
    whitelist: string[];
    blacklist: string[];
  };
  jobDescriptionLanguages: string[];
}

async function* fetchJobLinksUser({
  page,
  location,
  keywords,
  workplace: { remote, onSite, hybrid },
  datePosted,
  jobDescription,
  jobDescriptionLanguages,
}: FetchJobLinksUserParams): AsyncGenerator<[string, string, string, string]> {
  // const logger = getLogger();
  let numSeenJobs = 0;
  let numMatchingJobs = 0;
  const fWt = [onSite, remote, hybrid]
    .reduce((acc, c, i) => (c ? [...acc, i + 1] : acc), [] as number[])
    .join(",");

  const { geoId, numAvailableJobs } = await getJobSearchMetadata({
    page,
    location,
    keywords,
  });
  if (!numAvailableJobs) {
    return console.log("No Available Jobs!");
  }
  const datePostedValues: { [key: string]: string } = {
    "Past 24 hours": "r86400",
    "Past Week": "r604800",
    "Past Month": "r2592000",
    "Any time": "",
  };

  const baseSearchParams = {
    keywords,
    location,
    start: numSeenJobs.toString(),
    f_WT: fWt,
    f_TPR: datePostedValues[datePosted],
  };

  const searchParams: { [key: string]: string } = {
    ...baseSearchParams,
    ...(config.EASY_APPLY ? { f_AL: "true" } : {}),
  };

  if (geoId) {
    searchParams.geoId = geoId.toString();
  }

  const url = buildUrl("https://www.linkedin.com/jobs/search", searchParams);

  while (numSeenJobs < config.APPLIES_AMOUNT) {
    logger.info("Fetching job links", { url: url.toString() });
    url.searchParams.set("start", numSeenJobs.toString());
    await wait(2000);

    await page.goto(url.toString(), { waitUntil: "domcontentloaded" });
    try {
      logger.info("Waiting for job listings", {
        numAvailableJobs,
        numSeenJobs,
        MAX_PAGE_SIZE,
      });
      await page.waitForSelector(
        `${selectors.searchResultListItem}:nth-child(${Math.min(
          MAX_PAGE_SIZE,
          numAvailableJobs - numSeenJobs
        )})`,
        { timeout: 6000 }
      );
    } catch (error) {
      logger.warn(`Error waiting for selector: ${error}`);
    }

    const jobListings = await page.$$(selectors.searchResultListItem);

    for (let i = 0; i < Math.min(jobListings.length, MAX_PAGE_SIZE); i++) {
      try {
        await wait(1000);

        const [link, title] = await page.evaluate((selector) => {
          const linkEl = document.querySelector(selector) as HTMLLinkElement;
          linkEl.click();
          return [linkEl.href.trim(), linkEl.innerText.trim()];
        }, `${selectors.searchResultListItem}:nth-child(${i + 1}) ${selectors.searchResultListItemLink}`);

        logger.info("Clicking job link", { link });

        // Wait for the job description to be visible instead of waiting for navigation
        try {
          await page.waitForSelector(selectors.jobDescription, {
            visible: true,
            timeout: 60000,
          });
        } catch (error) {
          logger.error("Timeout waiting for job description", { error, link });
          continue; // Skip to the next job listing if this one times out
        }

        const companyName = await page.$eval(
          selectors.searchResultListItemCompanyName,
          (el) => (el as HTMLElement).innerText.trim()
        );
        logger.info("Company name:", { companyName });

        const incomingJobDescription = await page.$eval(
          selectors.jobDescription,
          (el) => (el as HTMLElement).innerText
        );
        logger.info("Job description:", { incomingJobDescription });
        const canApply =
          !!(await page.$(selectors.easyApplyButtonEnabled)) ||
          !!(await page.$(selectors.applyButton));
        logger.info("Can apply:", { canApply });

        const jobDescriptionLanguage = languageDetector.detect(
          incomingJobDescription,
          1
        )[0][0];
        const matchesLanguage =
          jobDescriptionLanguages.includes("any") ||
          jobDescriptionLanguages.includes(jobDescriptionLanguage);

        const { includesBlacklisted, includesWhitelisted } =
          checkJobDescription(incomingJobDescription, jobDescription);

        if (
          canApply
          // &&
          // includesWhitelisted &&
          // !includesBlacklisted &&
          // matchesLanguage
        ) {
          numMatchingJobs++;
          yield [link, title, companyName, incomingJobDescription];
        }
      } catch (e) {
        logger.error("Error processing job listing:", { error: e });
      }
    }

    await wait(1000);
    numSeenJobs += jobListings.length;
    console.log("Seen jobs:", numSeenJobs);
  }
}

export default fetchJobLinksUser;
