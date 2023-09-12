import { Page } from "puppeteer";

export async function waitForNavigation(page: Page) {
  try {
    await page.waitForNavigation({
      timeout: 3000,
      waitUntil: "domcontentloaded",
    });
  } catch (error) {
    console.log("🚀 ~ file: index.ts:417 ~ waitForNavigation ~ error:", error);
  }
}
