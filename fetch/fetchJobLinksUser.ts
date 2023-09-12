import { ElementHandle, Page } from "puppeteer";
import LanguageDetect from "languagedetect";

import buildUrl from "../utils/buildUrl";
import wait from "../utils/wait";
import selectors from "../selectors";
import config from "../config";
import { checkJobDescription } from "./checkJobDescription";

const MAX_PAGE_SIZE = 7;
const languageDetector = new LanguageDetect();

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
    url.searchParams.set("start", numSeenJobs.toString());
    await wait(2000);

    await page.goto(url.toString(), { waitUntil: "load" });
    try {
      await page.waitForSelector(
        `${selectors.searchResultListItem}:nth-child(${Math.min(
          MAX_PAGE_SIZE,
          numAvailableJobs - numSeenJobs
        )})`,
        { timeout: 6000 }
      );
    } catch (error) {
      console.error(`Error waiting for selector: ${error}`);
    }

    const jobListings = await page.$$(selectors.searchResultListItem);

    for (let i = 0; i < Math.min(jobListings.length, MAX_PAGE_SIZE); i++) {
      try {
        await wait(1000);

        const [link, title] = await page.$eval(
          `${selectors.searchResultListItem}:nth-child(${i + 1}) ${
            selectors.searchResultListItemLink
          }`,
          (el) => {
            const linkEl = el as HTMLLinkElement;

            linkEl.click();

            return [linkEl.href.trim(), linkEl.innerText.trim()];
          }
        );
        const companyName = await page.$eval(
          `${selectors.searchResultListItem}:nth-child(${
            i + 1
          }) .job-card-container__primary-description`,
          (el) => (el as HTMLElement).innerText.trim()
        );
        try {
          await page.waitForFunction(
            async (selectors) => {
              const hasLoadedDescription = !!document
                .querySelector<HTMLElement>(selectors.jobDescription)
                ?.innerText.trim();
              const hasLoadedStatus = !!(
                document.querySelector(selectors.easyApplyButtonEnabled) ||
                document.querySelector(selectors.appliedToJobFeedback)
              );

              return hasLoadedStatus && hasLoadedDescription;
            },
            { timeout: 3000 },
            selectors
          );
        } catch (error) {
          console.log(
            "🚀 ~ ERROING OUT AT: file: fetchJobLinksUser.ts:183 ~ error:",
            error
          );
        }

        const incomingJobDescription = await page.$eval(
          selectors.jobDescription,
          (el) => (el as HTMLElement).innerText
        );
        const canApply = !!(await page.$(selectors.easyApplyButtonEnabled));
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
          canApply &&
          (includesWhitelisted && !includesBlacklisted) &&
          matchesLanguage
        ) {
          numMatchingJobs++;

          yield [link, title, companyName, incomingJobDescription];
        }
      } catch (e) {
        console.log(e);
      }
    }

    await wait(1000);
    numSeenJobs += jobListings.length;
    console.log("Seen jobs:", numSeenJobs);
  }
}

export default fetchJobLinksUser;
