import { TransportType } from "@src/@types";
import namesRetriever from "@src/utils/namesRetriever";
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

const transportName = async (type: TransportType) =>
  (
    await inquirer.prompt({
      name: "transportName",
      type: "list",
      message: "Select the transport this client belongs to:",
      loop: true,
      choices: namesRetriever({
        dirPath: `src/transports/${type === "graphql" ? "GRAPHQL" : "REST"}`,
      }).map((f) => ({ name: f, value: f })),
    })
  ).transportName;

const clientPrompt = { clientName, transportName };

export default clientPrompt;
