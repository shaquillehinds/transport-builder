import { Command } from "commander";
import fs from "fs";
import checkFiles from "../../utils/fileChecker";
import * as rf from "../../utils/requiredFiles";
import checkPackages from "../../utils/packageChecker";
import restTransportInjector from "./restTransport.injector";
import transportPrompt from "./transport.prompt";

export default function transportCommand(program: Command) {
  program
    .command("transport [rest|graphql] [transportName]")
    .description("Adds a new transport")
    .action(async (type, name) => {
      if (!type) type = await transportPrompt.transportType();
      if (!type)
        throw new Error(
          'Please provide the type of transport "transport <rest|graphql>"'
        );
      if (!name) name = await transportPrompt.transportName();
      if (!name)
        throw new Error(
          `Please provide the name of the new transport "transport ${type} <transportName>"`
        );
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
      process.exit(0);
    });
}
