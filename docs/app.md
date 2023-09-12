## Documentation ApplyScript (App)
### File: scripts/apply.ts

**Purpose:** This file is responsible for orchestrating the job application process. It launches a browser, logs into the platform, fetches job links, and applies to each job.


## Interface: AppState

**Description:** The AppState interface defines the structure of the application state used in the script.

## Function: wait

**Description:** The wait function is a helper function that pauses the execution for a specified amount of time.
**Parameters:** It takes a number representing time in milliseconds.
**Returns:** Returns a Promise that resolves after the specified time.

## Function: askForPauseInput

**Description:** The askForPauseInput function is a helper function that pauses and resumes the program based on user input.
**Parameters:** None
**Returns:** Returns a Promise that resolves to void.

## Function: main

**Description:** The main function is an immediately invoked function expression (IIFE) that orchestrates the job application process. It launches a browser, logs into the platform, fetches job links, and applies to each job.
**Parameters:** None
**Returns:** Returns a Promise that resolves to void.

**Note:** This file is part of a larger system that automates the job application process on a platform. The actions are guided by the configuration provided in the config file and the user input.