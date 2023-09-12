import { Page } from "puppeteer";

import selectors from "../selectors";

async function clickNextButton(page: Page): Promise<void> {
  try {
    await page.waitForSelector(selectors.nextButton, {
      timeout: 3000,
    });
    await page.click(selectors.nextButton);
    console.log('Moving to the next page...')
  } catch (error) {}
}

export default clickNextButton;
