// import { sanitizeHtml, generateHtmlString } from './index';
import puppeteer, { Browser, Page } from "puppeteer";

import fs from "fs";
import path from "path";
import {
  generateHtmlString,
  sanitizeHtml,
} from "../../agent/scrape/sanitization";
import { getPageContent } from "../../agent/scrape/content";
import { getAllTabbableElements } from "../../agent/scrape/tabbable";
const currentPath = path.resolve(__dirname, "html-test.html");

describe("sanitizeHtml", () => {
  it("should sanitize HTML", async () => {
    const html = fs.readFileSync(currentPath, "utf8");
    const $ = await sanitizeHtml(html);

    // Check for the absence of <script> and <style> tags
    expect($("script").length).toBe(0);
    expect($("style").length).toBe(0);

    // Check for the presence and content of <h1>, <h2>, and <p> tags
    expect($("h1").length).toBeGreaterThan(0);
    expect($("h1").text()).toBe("Welcome to the Test Page");

    expect($("h2").length).toBeGreaterThan(0);
    expect($("h2").first().text()).toBe("Section 1");
    expect($("h2").last().text()).toBe("Section 2");

    expect($("p").length).toBeGreaterThan(0);
    expect($("p").first().text()).toBe("This is a paragraph in section 1.");
    expect($("p").last().text()).toBe(
      "This is a paragraph in subsection 2.1.2.1"
    );

    // Check for the presence of other tags
    expect($("main").length).toBeGreaterThan(0);
    expect($("div").length).toBeGreaterThan(0);
    expect($("section").length).toBeGreaterThan(0);
    expect($("form").length).toBeGreaterThan(0);
    expect($("input").length).toBeGreaterThan(0);
    expect($("button").length).toBeGreaterThan(0);
    expect($("a").length).toBeGreaterThan(0);
  });
});

describe("generateHtmlString", () => {
  xit("should generate HTML string", async () => {
    const html = fs.readFileSync(currentPath, "utf8");
    const result = await generateHtmlString(html);
    expect(result).toContain("Search");
    expect(result).toContain("Section 1");
    expect(result).toContain("This is a paragraph in section 1.");
    expect(result).toContain("Welcome to the Test Page");
    expect(result).toContain("Section 2");
    expect(result).toContain("This is a paragraph in section 2.");
    expect(result).toContain("Visit Example.com");
    expect(result).toContain("Test Page");
    expect(result).toContain("Subsection 1.1");
    expect(result).toContain("This is a paragraph in subsection 1.1.");
    expect(result).toContain("Subsection 2.1");
    expect(result).toContain("This is a paragraph in subsection 2.1.");
    expect(result).toContain("Visit Example2.com");
  });
});

describe("getPageContent", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });
  
  xit("should get page content", async () => {
    const html = fs.readFileSync(currentPath, "utf8");
    await page.setContent(html);
    let content = await getPageContent(page);
    content = content
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
    expect(content).toBe(
      `## START OF PAGE CONTENT ##
      Title: Test Page

      Option 1
      Option 2
      Check this box
      Select this option
      Apply for this job
      Section 1
      This is a paragraph in section 1.
      Subsection 1.1
      This is a paragraph in subsection 1.1.
      Welcome to the Test Page
      Section 2
      This is a paragraph in section 2.
      Visit Example.com
      Subsection 2.1
      This is a paragraph in subsection 2.1.
      Visit Example2.com
      Subsection 2.1.1
      This is a paragraph in subsection 2.1.1
      Visit Example2.com
      Subsection 2.1.2
      This is a paragraph in subsection 2.1.2
      Visit Example2.com
      Subsection 2.1.2.1
      This is a paragraph in subsection 2.1.2.1
      Visit Example2.com
      ## END OF PAGE CONTENT ##`
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
    );
  });

  xit("should sanitize and generate HTML string from page content", async () => {
    const content = await getPageContent(page);

    const $ = await sanitizeHtml(content);

    expect($("h1").length).toBeGreaterThan(0);
    
    expect(content).toContain("Example Domain");
  });
});
