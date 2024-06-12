import { Command } from "commander";
import fs from "fs";
import cp from "child_process";
import checkFiles from "../../utils/fileChecker";
import * as rf from "../../utils/requiredFiles";
import checkPackages from "../../utils/packageChecker";
import transportPrompt from "../transport.command/transport.prompt";
import schemaPrompt from "./schema.prompt";
import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import restTransportInjector from "../transport.command/restTransport.injector";
import restClientInjector from "../client.command/restClient.injector";
import restRequestInjector from "../request.command/restRequest.injector";
import { swaggerPathItemParser } from "@src/utils/swagger.parser";
import { RequestMethod } from "@src/@types";
import createRequestFile from "@src/utils/createRequestFile";

export default function schemaCommand(program: Command) {
  program
    .command("schema [schemaUrl|schemaPath] [transportName]")
    .description("Adds a new transport via swagger schema")
    .action(async (location, transportName) => {
      if (!location) location = await schemaPrompt.schemaLocation();
      if (!location)
        throw new Error(
          'Please provide the location of the swagger schema "schema [url|path]]"'
        );
      if (!transportName) transportName = await transportPrompt.transportName();
      if (!transportName)
        throw new Error(
          `Please provide the name of the new transport "schema ${location} <transportName>"`
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

      let swaggerJSON = (await (await fetch(location)).json()) as
        | OpenAPIV3.Document
        | OpenAPIV3_1.Document
        | string;
      fs.writeFileSync(
        `src/transports/base/schemas/${transportName}.json`,
        typeof swaggerJSON === "string"
          ? swaggerJSON
          : JSON.stringify(swaggerJSON),
        "utf-8"
      );
      cp.execSync(
        `yarn openapi-typescript ${location} -o src/transports/base/schemas/${transportName}.types.ts`,
        {
          encoding: "utf-8",
          stdio: "inherit",
        }
      );
      if (typeof swaggerJSON === "string")
        swaggerJSON = JSON.parse(swaggerJSON) as
          | OpenAPIV3.Document
          | OpenAPIV3_1.Document;
      const disableOpenFiles = true;
      await restTransportInjector({ name: transportName, disableOpenFiles });
      const clientNames: string[] = [];
      const requests: Record<string, string[]> = {};
      for (const path in swaggerJSON.paths) {
        const parameters = path.split("/").slice(1);
        const clientName = parameters.splice(0, 1)[0] || "root";
        let lastPathParameter = parameters.length
          ? parameters[parameters.length - 1]
          : "";
        let index = parameters.length - 2;
        while (lastPathParameter?.includes("{") && index) {
          lastPathParameter = parameters[index];
          index--;
        }
        const pathInfo = swaggerJSON.paths[path];
        console.warn(`restClientInjection ${clientName}`);
        if (!clientNames.includes(clientName))
          await restClientInjector({
            clientName,
            transportName,
            disableOpenFiles,
          });
        clientNames.push(clientName);
        if (pathInfo) {
          const methodAndData = swaggerPathItemParser({
            clientName,
            path: pathInfo,
            lastPathParameter,
            document: swaggerJSON,
          });
          for (const method in methodAndData) {
            const requestMethod = method as RequestMethod;
            const endpointData = methodAndData[requestMethod];
            if (endpointData) {
              createRequestFile({
                clientName,
                transportName,
                requestName: endpointData.requestName,
              });
              await restRequestInjector({
                clientName,
                requestMethod,
                transportName,
                requestName: endpointData.requestName,
                returns: endpointData.returns,
                requestBody: endpointData.requestBody,
                disableOpenFiles,
              });
            }
          }
        }
      }
      swaggerJSON.paths;
      process.exit(0);
    });
}
