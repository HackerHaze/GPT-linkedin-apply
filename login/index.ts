import { Page, Protocol } from "puppeteer";
import ask from "../utils/ask";
import selectors from "../selectors";
import fs from "fs/promises";
interface Params {
  page: Page;
  email?: string;
  password?: string;
}

export async function navigateWithRetry(
  { page }: Params,
  maxAttempts: number = 10
): Promise<void | { authWall: true }> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await navigateToLinkedin({ page });
      const title = await page.title();
      const content = await page.content();
      const url = await page.url();
      if (title && content && url.includes("linkedin")) {
        break;
      }
    } catch (error) {
      console.error(`Navigation attempt ${attempt + 1} failed. Retrying...`);
      if (attempt === maxAttempts - 1) {
        console.error(
          "Max navigation attempts reached. Please check your network connection."
        );
        throw error;
      }
    }
  }
}

export async function navigateToLinkedin({ page }: Params): Promise<void> {
  await page.goto("https://www.linkedin.com/", {
    waitUntil: "domcontentloaded",
    timeout: 1500,
  });
  await page.waitForNavigation({
    waitUntil: "domcontentloaded",
    timeout: 1500,
  });
}

export async function executeLoginActions({
  page,
  email,
  password,
}: Params): Promise<void> {
  if (!password || !email) {
    return;
  }
  const url = await page.url();

  if (url.includes("/authwall")) {
    await page.click(selectors.loginAuthWall);
    await page.waitForNavigation();
  }

  await page.type(selectors.emailInput, email);
  await page.type(selectors.passwordInput, password);
}

export async function clickLogin({ page }: { page: Page }): Promise<void> {
  const selector = selectors.loginSubmit;
  await page.click(selector);
  await page.waitForNavigation();
}

export async function setCookies({ page }: Params): Promise<void> {
  const cookies = await page.cookies();
  const fs = require("fs");
  fs.writeFileSync("./cookies.json", JSON.stringify(cookies, null, 2));
}

export async function checkCookies({
  page,
}: Params): Promise<{ withCookies: boolean }> {
  try {
    const cookiesString = await fs.readFile("./cookies.json", "utf8");
    const cookies: Protocol.Network.Cookie[] = JSON.parse(cookiesString);
    for (const cookie of cookies) {
      await page.setCookie(cookie);
    }
    return {
      withCookies: true,
    };
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return {
        withCookies: false,
      };
    } else {
      console.error("Error reading or parsing cookies.json:", error);
      throw error;
    }
  }
}

export async function loginSuccessfulCheck({ page }: Params): Promise<boolean> {
  const url = await page.url();
  if (
    url === "https://www.linkedin.com/feed/?trk=homepage-basic_sign-in-submit"
  ) {
    setCookies({ page });
    return true;
  } else {
    throw new Error("Login not successful, please check credentials");
  }
}

async function login({ page, email, password }: Params): Promise<void> {
  if (!password) {
    return;
  }
  if (!email) {
    return;
  }

  try {
    await navigateWithRetry({ page });
    await executeLoginActions({ page: page as Page, email, password });
    await clickLogin({ page });
    await loginSuccessfulCheck({ page });
    const captcha = await page.$(selectors.captcha);

    if (captcha) {
      await ask("Please solve the captcha and then press enter");
      await page.goto("https://www.linkedin.com/", { waitUntil: "load" });
    }
  } catch (error) {
    console.error("Error executing login actions:", error);
    throw error;
  }
}

export default login;
