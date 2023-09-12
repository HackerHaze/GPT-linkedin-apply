import puppeteer, { Browser, Page } from "puppeteer";
import startAct from "../../agent/act";
import {
  ElementData,
  getButtonElements,
  getInputElements,
} from "../../agent/scrape/elements";
import fs from "fs";
import path from "path";

const currentPath = path.resolve(__dirname, "html-test.html");
describe("startAct function", () => {
  jest.setTimeout(30000);
  let page: Page;
  let browser: Browser;
  let buttonElements: ElementData[];
  let inputElements: ElementData[];
  let inputWhitelist: string[] = [""];
  let buttonWhitelist: string[] = ["Apply for This Job"];

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    // await page.goto(
    //   "https://jobs.zendesk.com/us/en/apply?jobSeqNo=ZENDUSR24260EXTERNALENUS&step=1",
    //   { waitUntil: "networkidle2" }
    // );
    const html = fs.readFileSync(currentPath, "utf8");
    await page.setContent(html);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should call startAct without throwing an error", async () => {
    await expect(startAct(page)).resolves.not.toThrow();
  });
  xit("should call type_input after a function call", async () => {
    const result = await startAct(page);
    // expect(result).toContainEqual({ uniqueId: "inp-0", value: "8" });
    // expect(result).toContainEqual({ uniqueId: "inp-1", value: "yes" });
    // expect(result).toContainEqual({ uniqueId: "inp-2", value: "React" });
  });
});
