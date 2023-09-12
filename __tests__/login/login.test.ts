import puppeteer, { Browser, Page } from "puppeteer";
import { clickLogin, executeLoginActions, navigateWithRetry } from "../../login/index";

import selectors from "../../selectors";
import ask from "../../utils/ask";
import config from "../../config";

const functionSelectors = {
  executeLoginActions: [selectors.emailInput, selectors.passwordInput],
};

describe("login integration test", () => {
  let browser: Browser;
  let page: Page;
  const email = config.LINKEDIN_EMAIL;
  const password = config.LINKEDIN_PASSWORD;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should navigate to LinkedIn", async () => {
    await navigateWithRetry({ page });
    const title = await page.title();
    const content = await page.content();
    const url = await page.url();

    expect(title).toBeDefined();
    expect(content).toBeDefined();
    expect(url).toContain("linkedin");
  }, 30000);

  test("should execute login actions", async () => {
    try {
      await executeLoginActions({ page, email, password });
      const emailInput = await page.$eval(
        selectors.emailInput,
        (el) => (el as HTMLInputElement).value
      );
      const passwordInput = await page.$eval(
        selectors.passwordInput,
        (el) => (el as HTMLInputElement).value
      );

      expect(emailInput).toBe(email);
      expect(passwordInput).toBe(password);
    } catch (error) {
      throw error;
    }
  }, 30000);
  test("should test if selectors for login are valid", async () => {
    const url = await page.url();
    if (url && url.includes("/authwall")) {
      const elementExists = await page.$eval(
        selectors.loginAuthWall,
        (el) => !!el
      );
      expect(elementExists).toBe(true);
    } else {
      for (const selector of functionSelectors.executeLoginActions) {
        const elementExists = await page.$eval(selector, (el) => !!el);
        expect(elementExists).toBe(true);
      }
    }
  });
  test("should attempt to click login button", async () => {
    try {
      await page.waitForSelector(selectors.loginSubmit);
      await clickLogin({ page });

      const urlAfterClick = await page.url();

      expect(urlAfterClick).toBe(
        "https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit"
      );
    } catch (error) {
      throw error;
    }
  }, 30000);
});
