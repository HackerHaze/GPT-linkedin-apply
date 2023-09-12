## Documentation FetchJobLinksUser

### File: fetch/fetchJobLinksUser.ts

**Purpose:** This file is responsible for fetching job links from LinkedIn based on the provided search parameters.

## Interface: FetchJobLinksUserParams

**Description:** The FetchJobLinksUserParams interface defines the structure of the parameters used in the fetchJobLinksUser function.

## Function: getJobSearchMetadata

**Description:** The getJobSearchMetadata function is a helper function that navigates to the LinkedIn jobs page, fills out the search form, and retrieves the search metadata.
**Parameters:** It takes an object with a Page object, location, and keywords as arguments.
**Returns:** Returns a Promise that resolves to an object containing the geoId and the number of available jobs.

## Function: fetchJobLinksUser

**Description:** The fetchJobLinksUser function is the main function exported from this file. It fetches job links from LinkedIn based on the provided search parameters. It yields each job link, title, company name, and job description that matches the search criteria.
**Parameters:** It takes an object of type PARAMS as an argument.
**Returns:** Returns an AsyncGenerator that yields arrays containing a job link, title, company name, and job description.

**Note:** This file is part of a larger system that automates the job application process on LinkedIn. The actions are guided by the provided search parameters and the configuration provided in the config file.
