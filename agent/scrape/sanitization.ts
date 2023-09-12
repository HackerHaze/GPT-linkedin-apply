import cheerio, { CheerioAPI, load, Element, } from "cheerio";

export const PGPT_ID = "pgpt-id";
const H_TAGS = "h1, h2, h3, h4, h5, h6";
const FORM_TAG = "form";
const BODY_TAG = "body";
const DIV_SECTION_MAIN_TAGS = "div, section, main";

interface TagObject {
  tag: string;
  text?: string;
}

export async function sanitizeHtml(html: string): Promise<CheerioAPI> {
  html = html.replace(/<\//g, "</");
  let $ = load(html);

  $("script, style").remove();

  let important = [
    "main",
    '[role="main"]',
    "#bodyContent",
    "#search",
    "#searchform",
    ".kp-header",
  ];

  // Reorder important elements to the top
  important.forEach((im) => {
    $(im).each((i, el) => {
      $(el).prependTo("body");
    });
  });

  return $;
}
function handleElement(element: Element, $: CheerioAPI): string {
  let output = "";

  if ($(element).is(H_TAGS)) {
    output += "<" + element.name + ">";
  }

  if ($(element).is(FORM_TAG)) {
    output += "\n<" + element.name + ">\n";
  }

  if ($(element).is(DIV_SECTION_MAIN_TAGS)) {
    output += "\n";
  }

  let targetTag = createHtmlTagString(element);

  if ($(element).attr(PGPT_ID)) {
    output += " " + (targetTag.tag ? targetTag.tag : "");
  } else if ((element.type as string) === "tag" && !$(element).attr(PGPT_ID)) {
    output += " " + $(element).text().trim();
  } else if (
    (element.type as string) === "text" &&
    element.parent &&
    !$(element.parent).attr(PGPT_ID)
  ) {
    const textElement = element as unknown as { data?: string };
    if (textElement.data) {
      output += " " + textElement.data.trim();
    } else {
      console.log(`element.data is undefined`);
    }
  } else {
    console.log(
      `element.type is not 'text', or element.parent is null, or element.parent has a 'pgpt-id' attribute`
    );
  }

  if ($(element).is(H_TAGS)) {
    output += "</" + element.name + ">";
  }

  if ($(element).is(FORM_TAG)) {
    output += "\n</" + element.name + ">\n";
  }

  if ($(element).is(`${H_TAGS}, ${DIV_SECTION_MAIN_TAGS}`)) {
    output += "\n";
  }

  return output
    .replace(/[^\S\n]+/g, " ")
    .replace(/ \n+/g, "\n")
    .replace(/[\n]+/g, "\n");
}
function traverse(element: Element, $: CheerioAPI): string {
  const children = element.children;
  let output = handleElement(element, $);
  if (children) {
    children.forEach((child) => {
      if (child.type === "tag") {
        // output += traverse(child as Element, $);
      }
    });
  }

  return output;
}
export async function generateHtmlString(html: string): Promise<string> {
  const $ = await sanitizeHtml("<body>" + html + "</body>");

  return traverse($(BODY_TAG)[0], $);
}
export function createHtmlTagString(element: Element): TagObject {
  const $ = cheerio;

  let textContent = $(element).text().replace(/\s+/g, " ").trim();
  let placeholder = $(element).attr("placeholder");
  let tagName = element.name;
  let title = $(element).attr("title");
  let value = $(element).attr("value");
  let role = $(element).attr("role");
  let type = $(element).attr("type");
  let href = $(element).attr("href");
  let pgpt_id = $(element).attr(PGPT_ID);

  if (href && href.length > 32) {
    href = href.substring(0, 32) + "[..]";
  }

  if (placeholder && placeholder.length > 32) {
    placeholder = placeholder.substring(0, 32) + "[..]";
  }

  if (title && title.length > 32) {
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
  if (pgpt_id) {
    tag += ` pgpt-id="${pgpt_id}"`;
  }

  tag += `>`;

  let obj: TagObject = {
    tag: tag,
  };

  if (textContent) {
    obj.text = textContent;
    obj.tag += `${textContent}</${tagName}>`;
  }

  return obj;
}
