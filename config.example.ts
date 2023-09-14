import { Config } from "./core";

const config: Config = {
  LINKEDIN_EMAIL: "",
  LINKEDIN_PASSWORD: "",
  KEYWORDS: `typescript"`,
  LOCATION: "United States",
  APPLIES_AMOUNT: 2000,
  HEADLESS: true, // Wether chrome will not show up
  WORKPLACE: {
    REMOTE: true,
    ON_SITE: false,
    HYBRID: false,
    
  },
  DATE_POSTED: "Past 24 hours", // Past 24 hours | Past week | Past month | Any time
  EASY_APPLY: true,
  OPEN_AI_KEY: "sk-...",
  JOB_TITLE:
    "(javascript|frontend|typescript|react.js|react-native|front-end|fullstack|full-stack|nodejs|node|js).*(developer|engineer)",
  JOB_DESCRIPTION: {
    whitelist: ["contractor", "freelance", "freelance", "b2b", "1099", "c2c", "independent contractor", "remote"],
    blacklist: [
      "recruiting",
      "Jobot",
      "Junior",
      "CyberCoders",
      "recruitment",
      "IT Consulting",
      "IT Services",
      "IT consulting company",
      "outsourcing",
      "talents",
      "talentos",
      "talento",
      "inhouse",
      "scale-up",
      "staffing",
      "recruiting",
      "recruitment",
      "job-seeker",
      "job-seekers",
      "matching",
      "nearshore",
      "W2",
      "H-1B",
      "401k",
      "Visa",
      "Hybrid",
      "on-site",
      "US Citizens",
      "US Citizen",    
    ],
  },
  JOB_DESCRIPTION_LANGUAGES: ["portuguese", "english", "spanish"], // replace value with ["any"] to accept all job description laguages

  // FORM DATA
  PHONE: "",
  CV_PATH: "resume.pdf",
  COVER_LETTER_PATH: "",
  HOME_CITY: "Albufeira, Faro, Portugal",
  YEARS_OF_EXPERIENCE: {
    angular: 0,
    "react.js": 5,
    ".net": 0,
    php: 1,
    spring: 0,
    java: 2,
    node: 5,
    javascript: 5,
    typescript: 5,
    mongodb: 5,
    "CI/CD": 5,
    python: 5,
    firebase: 5,
    drupal: 5,
    sass: 5,
    "react-native": 5,
    "react native": 5,
    "tailwind-css": 5,
    html: 5,
    "google cloud": 5,
    docker: 4,
    css: 5,
    "Custom App Development": 5,
  },
  LANGUAGE_PROFICIENCY: {
    english: "professional",
    spanish: "conversational",
    chinese: "elementary",
  },
  REQUIRES_VISA_SPONSORSHIP: false,
  TEXT_FIELDS: { salary: "60000" },
  BOOLEANS: {
    "bachelhor|bacharelado": true,
    authorized: true,
  },
  MULTIPLE_CHOICE_FIELDS: { pronouns: "He/Him" },

  // OTHER SETTINGS
  SINGLE_PAGE: true,
};
export default config;
