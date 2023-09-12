import { Page } from "puppeteer";
import { generateHtmlString } from "./sanitization";

export async function getPageContent(page: Page): Promise<string> {
    const title = await page.evaluate(() => {
      return document.title;
    });
    const html = await page.evaluate(() => {
      return document.body.innerHTML;
    });
    const contents = await generateHtmlString(html);
    return (
      "## START OF PAGE CONTENT ##\nTitle: " +
      title +
      "\n\n" +
      contents +
      "\n## END OF PAGE CONTENT ##"
    );
  }
  