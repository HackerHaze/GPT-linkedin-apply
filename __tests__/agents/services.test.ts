import { Message, AvailableFunction } from "../../core";
import { sendChatMessage } from "../../agent/services/sendChatMessage";

describe("sendChatMessage", () => {
  it("should execute a function call from Open AI", async () => {
    let message: Message;
    let summaryTestAssertion = "This is the Way";
    let answerTestAssertion = "Great: This is the Way";
    let incomingSummaryTestAssertion: string = "";
    let incomingAnswerTestAssertion: string = "";
    let functions: AvailableFunction[];
    message = {
      content: "",
      role: "user",
    };
    let context: Message[] = [
      {
        role: "system",
        content: `
## OBJECTIVE ##
You have been tasked with crawling the internet for job positions. This is an integration test. 
As so, you will pretend task you have finished your task, and you will report back to the user calling answer_user
with the information "Great: This is the Way", and a summary of: "This is the Way" 
`.trim(),
      },
    ];
    functions = [
      {
        name: "answer_user",
        description:
          "Give an answer to the user and end the navigation. Use when the given task has been completed. Summarize the relevant parts of the page content first and give an answer to the user based on that.",
        parameters: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description:
                "A summary of the relevant parts of the page content that you base the answer on",
            },
            answer: {
              type: "string",
              description: "The response to the user",
            },
          },
        },
        required: ["summary", "answer"],
      },
    ];
    const result = await sendChatMessage(message, context, "auto", functions);

    const availableFunctions = {
      answer_user: (param: string) => {
        let result;
        try {
          result = JSON.parse(param);
        } catch (error) {
          throw error;
        }
        return result;
      },
    };

    const functionCall = result.data?.choices?.[0]?.message?.function_call;
    const functionName = functionCall?.name as keyof typeof availableFunctions;
    const func_arguments = functionCall?.arguments;

    if (functionName && availableFunctions[functionName]) {
      try {
        incomingSummaryTestAssertion = await availableFunctions[functionName](
          func_arguments
        ).summary;

        incomingAnswerTestAssertion = await availableFunctions[functionName](
          func_arguments
        ).answer;
      } catch (error) {
        console.log(
          "🚀 ~ file: sendChatMessage.test.ts:78 ~ callfromOpenAI-test",
          error
        );
      }
    }
    expect(summaryTestAssertion).toEqual(incomingSummaryTestAssertion);
    expect(answerTestAssertion).toEqual(incomingAnswerTestAssertion);
  });
  xit("should send a chat message", async () => {
    let message: Message;
    let context: Message[];
    let functions: AvailableFunction[];
    message = { content: "Test message", role: "system" };
    context = [{ content: "Test context", role: "user" }];
    functions = [
      {
        name: "Test function",
        description: "This is a test function",
        parameters: {
          type: "string",
          properties: {
            plan: {
              type: "string",
              description: "Test key",
            },
          },
        },
      },
    ];
    const result = await sendChatMessage(message, context, "auto", functions);
    expect(result.status).toEqual(200);
  });
});
