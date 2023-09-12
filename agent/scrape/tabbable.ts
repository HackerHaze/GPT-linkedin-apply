import { Page, ElementHandle } from "puppeteer";
import { PGPT_ID } from "./sanitization";
import { PGPT_ELEMENT, ELEMENTS_TAGS, TabObject } from "../../core";


async function getNextTabbableElement(
  page: Page,
  element:
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | HTMLAnchorElement
    | ElementHandle<HTMLAnchorElement>
    | HTMLAnchorElement,
  id: number,
  selector: string = "*"
): Promise<any> {
  let obj: TabObject | boolean = await page.evaluate(
    async (element, id, selector) => {
      if (!element.matches(selector)) {
        return false;
      }

      const tagName = element.tagName;

      if (tagName === "BODY") {
        return false;
      }

      let textContent = element.textContent
        ? element.textContent.replace(/\s+/g, " ").trim()
        : "";

      if (textContent === "" && !element.matches("select, input, textarea")) {
        return false;
      }

      element.classList.add(PGPT_ELEMENT + id);
      let role = element.getAttribute("role");

      let placeholder;
      if ("placeholder" in element) {
        placeholder = element.placeholder;
      }

      let title = element.title;

      let type = element.type;

      let href = (element as HTMLAnchorElement).href;

      let value;
      if ("value" in element) {
        value = element.value;
      }

      if (href && href.length > 32) {
        href = href.substring(0, 32) + "[..]";
      }

      if (placeholder && placeholder.length > 32) {
        placeholder = placeholder.substring(0, 32) + "[..]";
      }

      if (!textContent && title && title.length > 32) {
        title = title.substring(0, 32) + "[..]";
      }

      if (textContent && textContent.length > 200) {
        textContent = textContent.substring(0, 200) + "[..]";
      }

      let tag = `<${tagName}`;

      if (href) {
        tag += ` href="${href}"`;
      }
      if (type) {
        tag += ` type="${type}"`;
      }
      if (placeholder) {
        tag += ` placeholder="${placeholder}"`;
      }
      if (title) {
        tag += ` title="${title}"`;
      }
      if (role) {
        tag += ` role="${role}"`;
      }
      if (value) {
        tag += ` value="${value}"`;
      }

      tag += `>`;

      let obj: TabObject = {
        tag: tag,
        id: id,
      };

      if (textContent) {
        obj.text = textContent;
      }

      return obj;
    },
    element,
    id,
    selector
  );

  if (!obj) {
    return false;
  }

  const visible = await page.evaluate(async (id) => {
    const element = document.querySelector(
      `.${PGPT_ELEMENT}` + id
    ) as HTMLElement;
    if (!element) {
      return false;
    }

    const visibility = element.style.visibility;
    const display = element.style.display;
    const clip = element.style.clip;
    const rect = element.getBoundingClientRect();

    return (
      visibility !== "hidden" &&
      display !== "none" &&
      rect.width != 0 &&
      rect.height != 0 &&
      clip !== "rect(1px, 1px, 1px, 1px)" &&
      clip !== "rect(0px, 0px, 0px, 0px)"
    );
  }, id);

  if (!visible) {
    return false;
  } else {
    await page.evaluate(async (id) => {
      const element: HTMLElement | null = document.querySelector(
        `.${PGPT_ELEMENT}` + id
      );
      if (!element) {
        return;
      }
      element.setAttribute(PGPT_ID, id.toString());
      element.style.border = "1px solid red";
    }, id);
  }

  return obj;
}
export async function getAllTabbableElements(
  page: Page,
  selector: string = "*"
): Promise<any[]> {
  let tabbableElements = [];
  let skipped = [];
  let id = 0;

  let elements = await page.$$(ELEMENTS_TAGS);

  let limit = 400;

  for (const elementHandle of elements) {
    if (--limit < 0) {
      break;
    }

    const nextTab = await getNextTabbableElement(
      page,
      elementHandle,
      ++id,
      selector
    );

    if (nextTab !== false) {
      tabbableElements.push(nextTab);
    }
  }
  //   if (debug) {
  //     fs.writeFileSync("skipped.json", JSON.stringify(skipped, null, 2));
  //   }

  //   if (debug) {
  //     fs.writeFileSync(
  //       "tabbable.json",
  //       JSON.stringify(tabbableElements, null, 2)
  //     );
  //   }

  return tabbableElements;
}
