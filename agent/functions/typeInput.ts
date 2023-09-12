import { Page } from "puppeteer";
import { InputFields } from ".";

// [WIP]
export default async function typeInput(
  formData: InputFields[],
  page: Page
): Promise<string | void | InputFields[]> {
  for (const { uniqueId, value, inputType } of formData) {
    const element = await page.$(`[input-uid="${uniqueId}"]`);
    if (element) {
      switch (inputType) {
        case "text":
          await element.type(value);
          break;
        case "checkbox":
          await page.evaluate(
            (uniqueId, value) => {
              const targetElement = document.querySelector(
                `[input-uid="${uniqueId}"]`
              ) as HTMLInputElement;
              targetElement.checked = true;
            },
            uniqueId,
            value
          );
          break;
        default:
          await element.type(value);
          break;
      }
    }
  }
}
