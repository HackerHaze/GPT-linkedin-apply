# 🚀 Ultimate Job Application Assistant 🚀

Welcome to the Ultimate Job Application Assistant! This repository is aimed at anyone looking to automate their job application process. The goal is to provide a comprehensive collection of scripts and modules that interact with web pages and fill out forms based on the instructions received from the OpenAI API.

The repo is focused on TypeScript, and uses Puppeteer for web page interaction and OpenAI API for form filling instructions.


## 🌟 Getting Started 🌟

To get started with the Ultimate Job Application Assistant, follow these steps:

### Prerequisites

- Node.js installed on your machine
- A package manager like npm or Yarn
- TypeScript installed globally (`npm install -g typescript`)
- A LinkedIn account for job applications

### Installation

1. Clone the repository to your local machine
2. Navigate to the cloned directory
3. Install the dependencies
```bash
npm install
```
4. Start application
```bash
npm start
```
### Configuration

1. Rename the `example.config.json` to `config.json`.
2. Fill in your LinkedIn credentials and other necessary parameters in `config.json`.

### Running the Application

1. Compile the TypeScript files to JavaScript:

## 🎯 Goals of this Repository 🎯

1. **Automate Job Application**: Automate the process of applying for jobs on platforms like LinkedIn and, in the future, any application forms.

2. **Intelligent Form Filling**: Use OpenAI API to intelligently fill out application forms based on your data.

3. **Continuous Updates**: Regularly update the repository with improvements and new features.

4. **Community Driven**: Encourage contributions from the community. All contributions are welcome!

## 📚 Contents 📚

The repository is organized into several sections:

1. **Apply**: Contains the main application process, including navigating to the provided link, clicking the "Easy Apply" button, filling out the form fields, and submitting the application.

2. **Agent**: Responsible for the main functionality of the bot, which is to interact with a webpage and fill out forms based on the instructions received from the OpenAI API.

3. **Fetch Job Links**: Fetches job links from LinkedIn based on the provided search parameters.

4. **Config**: Contains the configuration for the bot, including LinkedIn credentials, job search parameters, and form data.
## 🚗 Roadmap 🚗

This section provides an overview of the features that have been implemented and the ones that are planned for future releases.

### ✅ Completed Features ✅

1. **Automated Job Application**: The bot can automatically apply for jobs on platforms like LinkedIn in Easy Apply mode.

2. **Intelligent Form Filling**: The bot uses OpenAI API to intelligently fill out application different forms based on your parameters.

3. **Fetch Job Links**: The bot can fetch job links from LinkedIn based on the provided search parameters and apply for them.

4. **Configurable**: The bot's behavior can be configured using a configuration file, including LinkedIn credentials, job search parameters, and form data.

### 📝 Planned Features 📝

1. **Support for (not easy) Apply**: In addition to LinkedIn, we plan to add support more general form filling.


2. **Improved Error Handling**: We plan to improve the bot's error handling capabilities to make it more robust and reliable.

3. **Integration with UI**: We plan on integrating this with agent with the Baby Yoda server to allow execution from a UI in the VSCode Extension (Baby Yoda) that will be coming out soon.

Please note that this is a tentative roadmap and the planned features may change based on user feedback and technical feasibility.
## 🙏 Contributing 🙏

We welcome contributions from everyone. If you'd like to contribute, please see the [Contributing Guide](CONTRIBUTING.md).

## ☕ Buy Me a Pizza ☕

If we got you a job or you want to show some appreciation, consider buying us a pizza! You can do so at the following link: [Buy Us a Pizza](https://www.buymeacoffee.com/matt93)
## 📃 License 📃


This project is licensed under the MIT License.

Happy job hunting and good luck with your applications! 🎉
