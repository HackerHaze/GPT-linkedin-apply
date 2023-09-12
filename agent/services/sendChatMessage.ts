import axios from "axios";
import { AvailableFunction, Message } from "../../core";
import { definitions } from "../config";
import config from "../../config";

const model = "gpt-3.5-turbo-16k";
const openaiApiKey = config.OPEN_AI_KEY;
const openAIUrl = "https://api.openai.com/v1/chat/completions";

function inArray(element: any, array: any[]): boolean {
  return array.includes(element);
}

export async function sendChatMessage(
  message: Message,
  context: Message[],
  function_call: string = "auto",
  functions: AvailableFunction[] | null = null
): Promise<any> {
  let messages = [...context];

  messages.push(message);

  // [TEMP]
  // let filteredDefinitions: AvailableFunction[] = definitions;

  // if (functions !== null) {
  //   const functionNames = functions.map((func) => func.name);
  //   filteredDefinitions = definitions.filter((definition) => {
  //     return inArray(definition.name, functionNames);
  //   });
  // } else {
  //   functions = definitions
  // }
  // console.log("🚀 ~ file: sendChatMessage.ts:32 ~ functions:", definitions, messages)
  
  const response = await axios
    .post(
      openAIUrl,
      {
        model: model,
        messages: messages,
        functions: definitions,
        function_call: function_call ?? "auto",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    )
    .catch(function (e: any) {
      console.log(e);
    });

  return response;
}
