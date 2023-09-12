import { Page } from "puppeteer";
import { DEFAULT_MESSAGE, Message } from "../../core";
import { sendChatMessage } from "../services/sendChatMessage";
import functionsMap, { InputFields } from "../functions";
import {
  ElementData,
  getButtonElements,
  getInputElements,
} from "../scrape/elements";
import { getPageContent } from "../scrape/content";
import { agentConfig } from "../config";
import clickNextButton from "../../apply-form/clickNextButton";

interface AgentAct {
  mode: "applyOnly" | "prospect";
  auto: boolean;
  debug: boolean;
}

// [CONSTR]
interface DoNextStepArgs {
  page: Page;
  content?: any;
  nextStep?: any;
  element?: any;
  moreInputs?: any;
}
export default async function startAct(
  page: Page
): Promise<string | void | InputFields[]> {
  let context: Message[] = [
    {
      role: "system",
      content: DEFAULT_MESSAGE,
    },
  ];

  let message: Message;

  // Get all buttons
  const pageContent = await getPageContent(page);
  const buttonElements: ElementData[] = await getButtonElements(page, "btn", [
    "Apply",
  ]);
  const inputElements: ElementData[] = await getInputElements(page, "inp", [
    "",
  ]);
  // [CONSTR]
  const formattedInputs = inputElements
    .filter(
      (el: ElementData) => el.inputType !== "hidden" && (el.label || el.value)
    )
    .map((el: ElementData) => {
      if (!el.value) {
        return `uniqueId: ${el.uniqueId}, label: ${el.label}}, inputType: ${el.inputType} `;
      } else if (!el.label) {
        return `uniqueId: ${el.uniqueId}, value: ${el.value} inputType: ${el.inputType}`;
      }
      return `uniqueId: ${el.uniqueId}, label: ${el.label}, value: ${el.value}, inputType: ${el.inputType}`;
    })
    .join(" ");

  const formattedButtons = buttonElements
    .filter((el: ElementData) => el.textContent)
    .map(
      (el: ElementData) =>
        `{ type: ${el.type}, textContent: ${el.textContent}, uniqueId: ${el.uniqueId} }`
    )
    .join(" ");

  message = {
    content: `The following is related to what inputs are made available to you: 
    (Keep in mind you need to provide the prefix/suffic of the uniqueId, it needs to be identical to the ones provided. i.e: inp-0, inp-2...)
    
    ${JSON.stringify(formattedInputs)}
    `,
    role: "user",
  };

  const result = await sendChatMessage(message, context, "auto", null);

  const functionCall = result.data?.choices?.[0]?.message?.function_call;

  const functionName = functionCall?.name as keyof typeof functionsMap;
  const func_arguments = functionCall?.arguments;
  let functionCallRes;
  if (functionName && functionsMap[functionName]) {
    try {
      functionCallRes = await functionsMap[functionName](func_arguments, page);
      await doNextStep({ page });
    } catch (error) {
      console.log(
        "🚀 ~ file: sendChatMessage.test.ts:78 ~ callfromOpenAI-test",
        error
      );
    }
  } else {
    // No function call
    return;
  }

  return functionCallRes;
}

async function doNextStep({ page }: DoNextStepArgs): Promise<void> {
  console.log("Calling next step");
  // Check if url is on linkedin, if it is, just call click next button and return
  if (page.url().includes("linkedin.com")) {
    await clickNextButton(page).catch(() => {});
    return;
  }
  // Check if has function call
  // Call up function call
  // Gets page content
  // Call next_step again
}
