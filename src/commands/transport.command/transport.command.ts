import { Command } from "commander";
import fs from "fs";
import checkFiles from "../../utils/fileChecker";
import * as rf from "../../utils/requiredFiles";
import checkPackages from "../../utils/packageChecker";
import restTransportInjector from "./restTransport.injector";

export default function transportCommand(program: Command) {
  program
    .command("transport <rest|graphql> <add> <transportName>")
    .description("Adds a new transport")
    .action(async (type, method, name) => {
      if (!type)
        throw new Error(
          'Please provide the type of transport "transport <rest|graphql>"'
        );
      if (!method)
        throw new Error(
          'Please provide the method of operation "transport <rest|graphq> add"'
        );
      if (!name)
        throw new Error(
          'Please provide the name of the new transport "transport <rest|graphq> add <transportName>"'
        );
      if (method === "add") {
        checkFiles({
          requiredFiles: rf.requiredFiles,
          requiredFolders: rf.requiredFolders,
          autoCreate: {
            files: rf.requiredFilesContent,
            folders: rf.requiredFolders,
          },
        });
        checkPackages({ requiredPackages: [{ name: "axios" }] });
        if (type === "rest") {
          if (fs.existsSync("src/transports/REST/" + name))
            throw new Error(name + " already created");
          await restTransportInjector({ name });
        }
      }
      process.exit(0);
    });
}
