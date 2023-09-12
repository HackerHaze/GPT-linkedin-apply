import { agentConfig } from "../agent/config";

export interface Parameter {
  type: string;
  description?: string;
  items?: Record<string, any>;
}
export interface TabObject {
  tag: string;
  id: number;
  text?: string;
}
export const INPUT_UID = "input-uid";
export const DEFAULT_MESSAGE = `
## OBJECTIVE ##
You have been tasked with filling job applications.
You will be redirected to a page where in which you will apply for.

***MAIN TASK***: Your first step should be call the function available to you called ***type_input*** function if there are inputs available presented at the second message of this conversation.
You will analyze those inputs, and determine/infer which user data to fill it up with, at which input based on the user's knowledge capacity.

IMPORTANT 1: that sometimes a given input will not give so much information. You should ignore those.
IMPORTANT 2: YOU SHOULD NEVER CALL A FUNCTION THAT IS NOT MADE AVAILABLE TO YOU
IMPORTANT 2: YOU SHOULD NEVER CALL A FUNCTION THAT IS NOT MADE AVAILABLE TO YOU
The data of the candidate is as follows, ***** DO NOT FILL INFORMATION THAT IS NOT PRESENT IN THE FOLLOWING: *****
  ${agentConfig.userInfo}, you should use this data in order to fill up the required inputs.
`
export const ELEMENTS_TAGS =
  'input:not([type=hidden]):not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]), select:not([disabled]), a[href]:not([href="javascript:void(0)"]):not([href="#"])';
export const PGPT_ELEMENT = "pgpt-element";
export interface AvailableFunction {
  name: string;
  description: string;
  required?: string[];
  parameters: {
    type: string;
    properties: Record<string, Parameter>;
  };
}
export interface OpenAIPayload {
  id: number;
  agentId: number;
  userId: string;
  functions?: AvailableFunction[];
  messages: Array<{
    role: string;
    content: string;
    name?: string;
    function_call?: JSON;
  }>;
  timestamp: Date;
}
export interface Message {
  content: string;
  role: string;
}

interface Choice {
  finish_reason: string;
  index: number;
  message: Message;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface ResponseData {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: Usage;
  on: any;
}
