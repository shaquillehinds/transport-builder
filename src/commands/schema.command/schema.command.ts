import { Command } from "commander";
import fs, { readFileSync } from "fs";
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
import { toCamelCase } from "@src/utils/algorithms";
import src from "@src/utils/src";

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

      let swaggerJSON;
      if (!location.includes("http"))
        swaggerJSON = JSON.parse(
          readFileSync(location, { encoding: "utf-8" })
        ) as OpenAPIV3.Document | OpenAPIV3_1.Document | string;
      else
        swaggerJSON = (await (await fetch(location)).json()) as
          | OpenAPIV3.Document
          | OpenAPIV3_1.Document
          | string;
      fs.writeFileSync(
        src(`transports/base/schemas/${transportName}.json`),
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
      const requestNames: Record<string, boolean> = {};
      for (const path in swaggerJSON.paths) {
        const parameters = path.split("/").slice(1);
        if (path.includes("{")) continue;
        const clientName = !parameters[0]
          ? "root"
          : parameters
              .filter((p) => p.match(/^[A-Za-z0-9-_]*$/))
              .map((p) => p[0].toUpperCase() + p.slice(1))
              .join("");
        console.log($lf(85), parameters, clientName);
        if (!Number.isNaN(Number(clientName[0]))) continue;
        const pathInfo = swaggerJSON.paths[path];
        console.warn($lf(88), `restClientInjection ${clientName}`);
        if (!clientNames.includes(clientName))
          await restClientInjector({
            path,
            clientName,
            transportName,
            disableOpenFiles,
          });
        clientNames.push(clientName);
        console.log($lf(97), "here");
        if (pathInfo) {
          const methodAndData = swaggerPathItemParser({
            clientName,
            path: pathInfo,
            // lastPathParameter,
            document: swaggerJSON,
          });
          for (const method in methodAndData) {
            const requestMethod = method as RequestMethod;
            const endpointData = methodAndData[requestMethod];
            if (endpointData) {
              const requestNameId = clientName + endpointData.requestName;
              if (requestNames[requestNameId]) continue;
              requestNames[requestNameId] = true;
              createRequestFile({
                clientName: toCamelCase(clientName),
                transportName,
                requestName: toCamelCase(endpointData.requestName),
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

function $lf(n: number) {
  return "$lf|commands/schema.command/schema.command.ts:" + n + " >";
  // Automatically injected by Log Location Injector vscode extension
}
