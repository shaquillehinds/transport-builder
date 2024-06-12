import inquirer from "inquirer";

const schemaLocation = async () =>
  (
    await inquirer.prompt({
      name: "schemaLocation",
      type: "input",
      message: "What is the path or uri of the swagger schema?",
    })
  ).schemaLocation;

const schemaPrompt = { schemaLocation };

export default schemaPrompt;
