## Documentation Apply

### File: apply/index.ts

**Purpose:** This file is responsible for the application process on a webpage. It interacts with the page, fills out forms based on the provided data, and submits the application.

## Function: clickEasyApplyButton

**Description:** The clickEasyApplyButton function is a helper function that clicks the "Easy Apply" button on a webpage.
**Parameters:** It takes a Page object from Puppeteer as an argument.
**Returns:** Returns a Promise that resolves to void.

## Interface: ApplicationFormData

**Description:** The ApplicationFormData interface defines the structure of the form data used in the application process.

## Interface: Params

**Description:** The Params interface defines the structure of the parameters used in the apply function.

## Function: apply

**Description:** The apply function is the main function exported from this file. It navigates to the provided link, clicks the "Easy Apply" button, fills out the form fields, and submits the application if the shouldSubmit parameter is true.
**Parameters:** It takes an object of type Params as an argument.
**Returns:** Returns a Promise that resolves to void.

**Note:** This file is part of a larger system that interacts with web pages to automate the application process. The actions are guided by the provided form data and the shouldSubmit parameter.
