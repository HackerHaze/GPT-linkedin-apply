import { Page } from "puppeteer";

import selectors from "../selectors";
import changeTextInput from "./changeTextInput";

interface TextFields {
  [labelRegex: string]: string | number;
}

async function fillTextFields(
  page: Page,
  textFields: TextFields
): Promise<void> {
  const inputs = await page.$$(
    ".jobs-easy-apply-modal input[type='text'], .jobs-easy-apply-modal textarea"
  );

  for (const input of inputs) {
    const id = await input.evaluate((el) => el.id);

    const label = await page
      .$eval(`label[for="${id}"]`, (el) => el.innerText)
      .catch(() => "");

    let hasExperience = false;
    for (const [labelRegex, value] of Object.entries(textFields)) {
      const regex = new RegExp(`\\b${labelRegex}\\b`, "i");
      if (regex.test(label)) {
        hasExperience = true;
        await changeTextInput(input, "", value.toString());
      }
    }
  }
  // const selects = await page.$$(".jobs-easy-apply-modal select");

  // for (const select of selects) {
  //   console.log(
  //     "🚀 ~ file: fillTextFields.ts:57 ~ TAKING A LOOK ON SELECT INPUT:"
  //   );
  //   const selected = await select.evaluate((el: HTMLSelectElement) => el.value);
  //   if (selected && (selected !== "Selecionar opção" || "Select an option")) {
  //     console.log(
  //       "🚀 ~ file: fillTextFields.ts:57 ~ SELECT INPUT ALREADY HAS A VALUE:",
  //       selected
  //     );
  
  //   }

  //   const id = await select.evaluate((el) => el.id);
  //   console.log("🚀 ~ file: fillTextFields.ts:63 ~ id:", id);
  //   const options = await select.evaluate((el: HTMLSelectElement) =>
  //     Array.from(el.options, (option) => option.value)
  //   );
  //   console.log("🚀 ~ file: fillTextFields.ts:57 ~ options:", options);

    // let selectedOption = options.includes("Yes") ? "Yes" : options[0];

    // try {
    //   console.log(
    //     `Selecting option "${selectedOption}" for select with id "${id}"`
    //   );
    //   await page.waitForSelector(`select[id="${id}"]`);
    //   await page.select(`select[id="${id}"]`, selectedOption);
    // } catch (error) {
    //   console.error(`Failed to select option: ${error}`);
    // }
  // }
}

export default fillTextFields;
