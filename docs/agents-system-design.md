1. Initialization: The bot starts with a base URL and is set to apply-mode.

2. Page Interaction: The bot navigates to the base URL and identifies all the input fields on the page. It generates a data structure that includes the labels, IDs, and other necessary data for each input field.

3. OpenAI API Interaction: The bot sends a message to the OpenAI API, including the data structure of the input fields. The message could be a request for information to fill in the input fields, based on the labels and other data.

4. Response Handling: The bot receives a response from the OpenAI API. The response includes a data structure with the information to fill in the input fields.

5. Input Filling: The bot calls a function fill_all_inputs to fill in the input fields on the page based on the information from the OpenAI API response.

6. Form Submission: After all input fields are filled, the bot submits the form.

7. Error Handling: Throughout the process, the bot checks for errors and exceptions, such as navigation errors, invalid input fields, and invalid API responses. When an error occurs, the bot prints an error message and continues with the next step.

8. Page Interaction (Continued): After the form is submitted, the bot will wait for the page to load. If the page contains a confirmation message or any other relevant information, the bot will extract this information.

9. Confirmation: The bot sends a final message to the OpenAI API, including the confirmation message or other relevant information from the page. The API generates a response, which the bot sends to the user to confirm that the application has been submitted.

10. Completion: The bot ends the session and waits for the next task.

High-level flow of the process:

1. Initialize bot with base URL and set to apply-mode.
2. Navigate to the base URL.
3. Identify all input fields on the page and return that 

<!--
     Thought: Maybe try to run an open source model in order to:
    - Get the contents of the page
    - Outputs a generate `guess` about the page in the context of the task assigned.
    - Execute the call to gpt-4 with the optimal data
 -->
4. Send a message to the OpenAI API with the data structure.
5. Receive a response from the OpenAI API with information to fill in the input fields.
6. Fill in the input fields on the page.
7. Submit the form.
8. Wait for the page to load and extract any relevant information.
9. Send a final message to the OpenAI API with the relevant information.
10. Receive a final response from the OpenAI API and send it to the user.
11. End the session and wait for the next task.
