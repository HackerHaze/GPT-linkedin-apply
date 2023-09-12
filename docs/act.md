## Documentation Act
### File: agent/act/index.ts

**Purpose:** This file is responsible for the main functionality of the bot, which is to interact with a webpage and fill out forms based on the instructions received from the OpenAI API.

## Function: startAct

**Description:** The startAct function is the main function exported from this file. 
**Parameters:** It takes a Page object from Puppeteer as an argument.
**Returns:** Returns a Promise that resolves to a string, void, or an array of InputFields.

## Interaction: Page Interaction

**Description:** The bot interacts with the page by getting all the buttons and input elements on the page. It then filters and maps these elements to create a list of available inputs and buttons.

## Function: doNextStep

**Description:** The doNextStep function is a helper function that is used to perform the next step in the process. It is currently a work in progress.

**Note:** This file is part of a larger system that interacts with web pages and the OpenAI API to fill out forms on the internet. The bot's actions are guided by the instructions it receives from the OpenAI API.
