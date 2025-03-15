import { TransportType } from "@src/@types";
import namesRetriever from "@src/utils/namesRetriever";
import src from "@src/utils/src";
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

const clientName = async (type: TransportType, transportName: string) =>
  (
    await inquirer.prompt({
      name: "clientName",
      type: "list",
      message: "Select the client this request belongs to:",
      loop: true,
      choices: namesRetriever({
        dirPath: src(
          `transports/${
            type === "graphql" ? "GRAPHQL" : "REST"
          }/${transportName}`
        ),
        rmIndex: true,
        rmExt: true,
      }).map((f) => ({ name: f, value: f })),
    })
  ).clientName;

const requestPrompt = { requestName, requestMethod, clientName };

export default requestPrompt;
