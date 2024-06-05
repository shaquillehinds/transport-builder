import inquirer from "inquirer";
// client <rest|graphql> <transportName> <clientName>

const requestName = async () =>
  (
    await inquirer.prompt({
      name: "requestName",
      type: "input",
      message: "What is the name of the new request?",
    })
  ).requestName;

const requestMethod = async () =>
  (
    await inquirer.prompt({
      name: "requestMethod",
      type: "list",
      message: "What is the HTTP method of the new request?",
      loop: true,
      choices: [
        { value: "post", name: "post" },
        { value: "get", name: "get" },
        { value: "put", name: "put" },
        { value: "patch", name: "patch" },
        { value: "delete", name: "delete" },
      ],
    })
  ).requestMethod;

const requestPrompt = { requestName, requestMethod };

export default requestPrompt;
