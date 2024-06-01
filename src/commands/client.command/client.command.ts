import { Command } from "commander";
import fs from "fs";
import restClientInjector from "./restClient.injector";

export default function clientCommand(program: Command) {
  program
    .command("client <rest|graphql> <add> <transportName> <clientName>")
    .description("Adds a new client")
    .action(async (type, method, transportName, clientName) => {
      if (!type)
        throw new Error(
          'Please provide the type of transport "transport <rest|graphql>"'
        );
      if (!method)
        throw new Error(
          'Please provide the method of operation "transport <rest|graphq> add"'
        );
      if (!transportName)
        throw new Error(
          'Please provide the name of the new transport "transport <rest|graphq> add <transportName>"'
        );
      if (!clientName)
        throw new Error(
          'Please provide the name of the new client "transport <rest|graphq> add <transportName> <clientName>"'
        );
      if (method === "add") {
        if (type === "rest") {
          if (
            fs.existsSync(`src/transports/REST/${transportName}/${clientName}`)
          )
            throw new Error(clientName + " already created");
          await restClientInjector({ transportName, clientName });
        }
      }
      process.exit(0);
    });
}
