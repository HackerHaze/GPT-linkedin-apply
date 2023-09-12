import puppeteer, { Browser, Page } from "puppeteer";
import login, { checkCookies } from "../../login";
import config from "../../config";

let browser: Browser;
let page: Page;
beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

test("setCookies sets cookies correctly", async () => {
  await login({
    page,
    email: config.LINKEDIN_EMAIL,
    password: config.LINKEDIN_PASSWORD,
  });
  const cookies = await page.cookies();
  expect(cookies).toBeDefined();
  expect(cookies.length).toBeGreaterThan(0);
}, 30000);

test("checkCookies loads cookies correctly", async () => {
  await checkCookies({ page });
  const cookies = await page.cookies();
  expect(cookies).toBeDefined();
  expect(cookies.length).toBeGreaterThan(0);
});
