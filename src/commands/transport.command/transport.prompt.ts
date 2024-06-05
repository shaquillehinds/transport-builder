import inquirer from "inquirer";
//transport <rest|graphql> <transportName>

const transportType = async () =>
  (
    await inquirer.prompt({
      name: "transportType",
      type: "list",
      message: "What is the transport type?",
      default: "rest",
      loop: true,
      choices: [
        { value: "rest", name: "rest" },
        { value: "graphql", name: "graphql" },
      ],
    })
  ).transportType;

const transportName = async () =>
  (
    await inquirer.prompt({
      name: "transportName",
      type: "input",
      message: "What is the name of this transport?",
    })
  ).transportName;

const transportPrompt = { transportType, transportName };

export default transportPrompt;
