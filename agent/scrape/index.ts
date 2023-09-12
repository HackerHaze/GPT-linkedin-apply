import { getPageContent } from "./content";
import { generateHtmlString, sanitizeHtml } from "./sanitization";
import { getAllTabbableElements } from "./tabbable";


export default {
  getAllTabbableElements,
  getPageContent,
  sanitizeHtml,
  generateHtmlString
};

