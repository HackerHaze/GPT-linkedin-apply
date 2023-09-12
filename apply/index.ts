import { Page } from "puppeteer";

import selectors from "../selectors";
import fillFields from "../apply-form/fillFields";
import waitForNoError from "../apply-form/waitForNoError";
import clickNextButton from "../apply-form/clickNextButton";
import wait from "../utils/wait";
import config from "../config";
import startAct from "../agent/act";

const noop = () => {};

async function clickApplyButton(page: Page): Promise<void> {
  try {
    if (config.EASY_APPLY) {
      await page.waitForSelector(selectors.easyApplyButtonEnabled, {
        timeout: 3000,
      });
      await page.click(selectors.easyApplyButtonEnabled);
    } else {
      console.log("clicking apply button");
      const buttonText = await page.evaluate(() => {
        const button = document.querySelector(selectors.applyButton);
        return button ? button.textContent?.trim() : null;
      });

      if (buttonText === "Apply") {
        await page.click(selectors.applyButton);
      }
      await page.click(selectors.easyApplyButtonEnabled);
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: index.ts:18 ~ clickEasyApplyButton ~ error:",
      error
    );
  }
}

export interface ApplicationFormData {
  phone: string;
  cvPath: string;
  homeCity: string;
  coverLetterPath: string;
  yearsOfExperience: { [key: string]: number };
  languageProficiency: { [key: string]: string };
  requiresVisaSponsorship: boolean;
  booleans: { [key: string]: boolean };
  textFields: { [key: string]: string };
  multipleChoiceFields: { [key: string]: string };
}

interface Params {
  page: Page;
  link: string;
  companyName: string;
  formData: ApplicationFormData;
  shouldSubmit: boolean;
}

async function apply({
  page,
  link,
  companyName,
  formData,
  shouldSubmit,
}: Params): Promise<void> {
  await page.goto(link, { waitUntil: "load", timeout: 60000 });
  try {
    if (config.EASY_APPLY) {
      console.log("Applying to", companyName);
      // [TODO] change this var
      await clickApplyButton(page);
      let maxPages = 7;
      let maxTries = 2;
      while (maxPages--) {
        await fillFields(page, formData).catch(noop);

        await clickNextButton(page).catch(noop);

        const isError = await waitForNoError(page).catch(noop);
        if (isError) {
          console.log("Error applying at:", companyName);
          while (maxTries--) {
            await startAct(page);
          }
          break;
        }
      }
      try {
        const submitButton = await page.$(selectors.submit);
        console.log("Submitting application at", companyName);
        if (!submitButton) {
          return;
        } else {
          await submitButton.click();
        }
      } catch (error) {
        console.log("Error applying to:", companyName, error);
      }
    } else {
      await clickApplyButton(page);
    }
  } catch {
    console.log(`Easy apply button not found in posting: ${link}`);
    return;
  }
}

export default apply;
