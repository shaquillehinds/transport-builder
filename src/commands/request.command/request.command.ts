import { Command } from "commander";
import fs from "fs";
import restClientInjector from "./restRequest.injector";
import transportPrompt from "../transport.command/transport.prompt";
import clientPrompt from "../client.command/client.prompt";
import requestPrompt from "./request.prompt";
import createRequestFile from "@src/utils/createRequestFile";

export default function requestCommand(program: Command) {
  program
    .command(
      "request [rest|graphql] [transportName] [clientName] [requestName] [requestMethod]"
    )
    .description("Adds a new request function")
    .action(
      async (type, transportName, clientName, requestName, requestMethod) => {
        if (!type) type = await transportPrompt.transportType();
        if (!type)
          throw new Error(
            'Please provide the type of transport "request <rest|graphql>"'
          );
        if (!transportName)
          transportName = await clientPrompt.transportName(type);
        if (!transportName)
          throw new Error(
            `Please provide the name of the transport "request ${type} <transportName>"`
          );
        if (!clientName)
          clientName = await requestPrompt.clientName(type, transportName);
        if (!clientName)
          throw new Error(
            `Please provide the name of the client "request ${type} ${transportName} <clientName>"`
          );
        if (!requestName) requestName = await requestPrompt.requestName();
        if (!requestName)
          throw new Error(
            `Please provide the name of the new request "request ${transportName} ${clientName} <requestName>"`
          );
        if (!requestMethod) requestMethod = await requestPrompt.requestMethod();
        if (!requestMethod)
          throw new Error(
            `Please provide the method of the new request "request ${transportName} ${clientName} ${requestName} <requestMethod>"`
          );
        if (type === "rest") {
          createRequestFile({ transportName, requestName, clientName });
          await restClientInjector({
            transportName,
            clientName,
            requestMethod,
            requestName,
          });
        }
        process.exit(0);
      }
    );
}
