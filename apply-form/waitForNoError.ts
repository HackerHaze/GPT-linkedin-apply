import { Page } from "puppeteer";

async function waitForNoError(page: Page): Promise<boolean> {
  const startTime = Date.now();
  let isError = false;

  while (Date.now() - startTime < 3000) {
    const isErrorHandle = await page.evaluate(() => {
      const errorElement = document.querySelector(
        "div[class='artdeco-inline-feedback artdeco-inline-feedback--error ember-view mt1']"
      );
      return !!errorElement;
    });

    if (isErrorHandle) {
      isError = true;
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return isError;
}

export default waitForNoError;
