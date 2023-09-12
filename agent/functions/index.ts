import { Page } from "puppeteer";
import wait from "../../utils/wait";
interface ClickLinkParams {
  linkId: string;
  linkText: string;
  allLinksAndInputs: any;
}
interface FunctionsMap {
  click_button: (params: ClickLinkParams, page: Page) => Promise<void | string>;
  type_input: (
    params: string,
    page: Page
  ) => Promise<string | void | InputFields[]>;
  analyze_text: (params: { text: string }) => Promise<void>;
}
// [under construction / bootstrapping function]
// TODO: change tests to start including these
async function click_button(
  params: {
    linkId: string;
    linkText: string;
    allLinksAndInputs?: any;
  },
  page: Page
): Promise<void | string> {
  const { allLinksAndInputs, linkId, linkText } = params;
  if (!linkId) {
    return;
  }
  if (!linkText) {
    return;
  }
}
export type InputFields = {
  uniqueId: string;
  value: string;
  inputType: string;
  checkboxValue: boolean;
};
async function type_input(
  params: string,
  page: Page
): Promise<string | void | InputFields[]> {
  let parsed: { formData: InputFields[] };

  try {
    parsed = await JSON.parse(params);
    console.log("🚀 ~ file: index.ts:50 ~ parsed:", parsed.formData);

    for (const {
      uniqueId,
      value,
      inputType,
      checkboxValue,
    } of parsed.formData) {
      await wait(3000);
      const element = await page.$(`[input-uid="${uniqueId}"]`);
      if (element) {
        switch (inputType) {
          case "text":
            await element.type(value);
            break;
          case "select":
            await page.select(`[input-uid="${uniqueId}"]`, value);
            break;
          case "checkbox":
            await page.evaluate(
              (uniqueId, checkboxValue) => {
                const targetElement = document.querySelector(
                  `[input-uid="${uniqueId}"]`
                ) as HTMLInputElement;
                if (checkboxValue) targetElement.checked = checkboxValue;
              },
              uniqueId,
              checkboxValue
            );
            break;
          // Add more cases as needed
          default:
            await element.type(value);
            break;
        }
        const inputValue = await page.evaluate((uniqueId) => {
          const targetElement = document.querySelector(
            `[input-uid="${uniqueId}"]`
          );
          return (targetElement as HTMLInputElement).value;
        }, uniqueId);
      }
    }
    await wait(3000);
  } catch (error) {
    console.error(error);
  }
}

async function analyze_text(): Promise<void> {}

const functionsMap: FunctionsMap = {
  click_button,
  analyze_text,
  type_input,
};
export default functionsMap;
