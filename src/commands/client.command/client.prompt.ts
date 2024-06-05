import inquirer from "inquirer";
// client <rest|graphql> <transportName> <clientName>

const clientName = async () =>
  (
    await inquirer.prompt({
      name: "clientName",
      type: "input",
      message: "What is the name of the new client?",
    })
  ).clientName;

const clientPrompt = { clientName };

export default clientPrompt;
