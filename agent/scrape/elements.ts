import { Page } from "puppeteer";

export interface ElementData {
  uniqueId: string;
  type: string;
  label?: string;
  value?: string;
  inputType?: string;
  name?: string;
  textContent?: string;
  placeholder?: string;
}
export const getButtonElements = async (
  page: Page,
  idPrefix: string,
  buttonWhitelist: string[]
): Promise<ElementData[]> => {
  return await page.$$eval(
    "button",
    (
      elements: HTMLButtonElement[],
      idPrefix: string,
      buttonWhitelist: string[]
    ) => {
      return elements
        .filter((element) => {
          const textContent = element.textContent?.trim();
          return buttonWhitelist.length === 0
            ? true
            : buttonWhitelist.some((word) => textContent?.includes(word));
        })
        .map((element, index) => {
          const uniqueId = `${idPrefix}-${index}`;
          element.setAttribute("button-uid", uniqueId);
          return {
            uniqueId,
            type: "button",
            textContent: element.textContent?.trim(),
          };
        });
    },
    idPrefix,
    buttonWhitelist
  );
};

export const getInputElements = async (
  page: Page,
  idPrefix: string,
  inputWhitelist: string[]
): Promise<ElementData[]> => {
  return await page.$$eval(
    "input",
    (
      elements: HTMLInputElement[],
      idPrefix: string,
      inputWhitelist: string[]
    ) => {
      return elements
        .filter((element) => {
          const inputValue = element.value;
          const inputType = element.type;
          const inputName = element.name;
          const label = document.querySelector(`label[for="${element.id}"]`);
          const labelText = label ? label.textContent?.trim() : "";

          return inputWhitelist.length === 0
            ? true
            : inputWhitelist.some(
                (word) =>
                  inputValue.includes(word) ||
                  inputType.includes(word) ||
                  inputName.includes(word) ||
                  labelText?.includes(word)
              );
        })
        .map((element, index) => {
          const uniqueId = `${idPrefix}-${index}`;
          element.setAttribute("input-uid", uniqueId);
          const label = document.querySelector(`label[for="${element.id}"]`);
          const labelText = label ? label.textContent?.trim() : "";
          return {
            uniqueId,
            type: "input",
            label: labelText,
            value: element.value,
            inputType: element.type,
            name: element.name,
            placeholder: element.placeholder
          };
        });
    },
    idPrefix,
    inputWhitelist
  );
};
