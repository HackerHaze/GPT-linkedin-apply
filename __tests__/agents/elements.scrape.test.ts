import { Browser, Page } from "puppeteer";
import fs from "fs";
import path from "path";
import wait from "../../utils/wait";
import {
  ElementData,
  getButtonElements,
  getInputElements,
} from "../../agent/scrape/elements";
import { INPUT_UID } from "../../core";
const puppeteer = require("puppeteer");

const currentPath = path.resolve(__dirname, "html-test.html");
describe("Input Field Identification", () => {
  jest.setTimeout(30000);
  let browser: Browser;
  let page: Page;
  let buttonElements: ElementData[];
  let inputElements: ElementData[];
  let inputWhitelist: string[] = [""];
  let buttonWhitelist: string[] = ["Apply"];
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    const html = fs.readFileSync(currentPath, "utf8");
    await page.setContent(html);

    buttonElements = await getButtonElements(page, "btn", buttonWhitelist);
    inputElements = await getInputElements(page, "inp", inputWhitelist);
  });

  afterAll(async () => {
    await browser.close();
  });
  // [TODO] Move this into a separate function
  it("should identify buttons on a criteria and click them", async () => {
    for (const uniqueId of buttonElements) {
      const element = await page.$(`[button-uid="${uniqueId}"]`);
      if (element) {
        await page.evaluate((uniqueId) => {
          const targetElement = document.querySelector(
            `[button-uid="${uniqueId}"]`
          );
          targetElement?.addEventListener("click", () => {
            (window as any)[`clicked-${uniqueId}`] = true;
          });
        }, uniqueId);
        const boundingBox = await element.boundingBox();
        if (boundingBox !== null) {
          await element.click();
          // This might trigger a navigation, so we might need to wait for this.
          const wasClicked = await page.evaluate(
            (uniqueId) => (window as any)[`clicked-${uniqueId}`],
            uniqueId
          );

          expect(wasClicked).toBeTruthy();
        }
      }
    }
  }, 30000);
  it("should type into an input field", async () => {
    for (const { uniqueId } of inputElements) {
      const element = await page.$(`[input-uid="${uniqueId}"]`);
      if (element) {
        await element.type("Test Input");
        const inputValue = await page.evaluate((uniqueId) => {
          const targetElement = document.querySelector(
            `[input-uid="${uniqueId}"]`
          );
          return (targetElement as HTMLInputElement).value;
        }, uniqueId);
        expect(inputValue).toBe("Test Input");
      }
    }
  }, 30000);
  xit("should identify at least one button", () => {
    console.log({ buttonElements });
    expect(buttonElements.length).toBeGreaterThan(0);
  });
  xit("should identify at least one input", () => {
    expect(inputElements.length).toBeGreaterThan(0);
  }, 30000);
});
