export interface Workplace {
  REMOTE: boolean;
  ON_SITE: boolean;
  HYBRID: boolean;
}

export interface JobDescription {
  whitelist: string[];
  blacklist: string[];
}

export interface YearsOfExperience {
  [key: string]: number;
}

export interface LanguageProficiency {
  [key: string]: string;
}

export interface TextFields {
  [key: string]: string;
}

export interface Booleans {
  [key: string]: boolean;
}

export interface MultipleChoiceFields {
  [key: string]: string;
}

export type DatePosted = 'Past 24 hours' | 'Past Week' | 'Past Month' | 'Any time';
export interface Config {
  LINKEDIN_EMAIL: string;
  LINKEDIN_PASSWORD: string;
  KEYWORDS: string;
  LOCATION: string;
  OPEN_AI_KEY: string;
  EASY_APPLY: boolean;
  APPLIES_AMOUNT: number;
  HEADLESS: boolean; // Wether chrome will show up or not.
  WORKPLACE: Workplace;
  DATE_POSTED: DatePosted; // Past 24 hours | Past week | Past month | Any time
  JOB_TITLE: string; 
  JOB_DESCRIPTION: JobDescription;
  JOB_DESCRIPTION_LANGUAGES: string[];
  PHONE: string;
  CV_PATH: string;
  COVER_LETTER_PATH: string;
  HOME_CITY: string;
  YEARS_OF_EXPERIENCE: YearsOfExperience;
  LANGUAGE_PROFICIENCY: LanguageProficiency;
  REQUIRES_VISA_SPONSORSHIP: boolean;
  TEXT_FIELDS: TextFields;
  BOOLEANS: Booleans;
  MULTIPLE_CHOICE_FIELDS: MultipleChoiceFields;
  SINGLE_PAGE: boolean;
}
