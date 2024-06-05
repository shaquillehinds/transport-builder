import { Command } from "commander";
import fs from "fs";
import restClientInjector from "./restClient.injector";
import transportPrompt from "../transport.command/transport.prompt";
import clientPrompt from "./client.prompt";

export default function clientCommand(program: Command) {
  program
    .command("client [rest|graphql] [transportName] [clientName]")
    .description("Adds a new client")
    .action(async (type, transportName, clientName) => {
      if (!type) type = await transportPrompt.transportType();
      if (!type)
        throw new Error(
          'Please provide the type of transport "client <rest|graphql>"'
        );
      if (!transportName)
        transportName = await clientPrompt.transportName(type);
      if (!transportName)
        throw new Error(
          `Please provide the name of the transport "client ${type} <transportName>"`
        );
      if (!clientName) clientName = await clientPrompt.clientName();
      if (!clientName)
        throw new Error(
          `Please provide the name of the new client "client ${type} ${transportName} <clientName>"`
        );
      if (type === "rest") {
        if (fs.existsSync(`src/transports/REST/${transportName}/${clientName}`))
          throw new Error(clientName + " already created");
        await restClientInjector({ transportName, clientName });
      }
      process.exit(0);
    });
}
