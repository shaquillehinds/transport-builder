import { templatePath } from "@src/utils/constants";
import checkFiles from "@src/utils/fileChecker";
import * as rf from "@src/utils/requiredFiles";
import { InjectionPipeline } from "tscodeinject";
interface TransportInjectorProps {
  name: string;
  disableOpenFiles?: boolean;
}

export default async function restTransportInjector(
  props: TransportInjectorProps
) {
  checkFiles({
    requiredFiles: rf.requiredRESTFiles,
    requiredFolders: rf.requiredRESTFolders,
    autoCreate: {
      files: rf.requiredRESTFilesContent,
      folders: rf.requiredRESTFolders,
    },
  });
  const name = props.name.trim();
  const Name = name[0].toUpperCase() + name.slice(1);

  console.log($lf(24), InjectionPipeline);

  const restTransportPipeline = new InjectionPipeline(
    "src/transports/transports.ts"
  );

  restTransportPipeline
    .injectImport({
      importName: `${Name}Transport`,
      source: `./REST/${name}`,
      isDefault: true,
    })
    .injectProperty(
      {
        property: `${name}: new ${Name}Transport("") // add the server url for this transport`,
      },
      { name: "transports" }
    )
    .injectDirectory(`src/transports/REST/${name}`)
    .injectFileFromTemplate({
      newFilePath: `src/transports/REST/${name}/index.ts`,
      templatePath: templatePath("transportIndex"),
      replaceKeywords: [{ keyword: "{{Name}}", replacement: Name }],
    })
    .finish(props.disableOpenFiles ? [] : ["src/transports/transports.ts"]);
}

function $lf(n: number) {
  return "$lf|commands/transport.command/restTransport.injector.ts:" + n + " >";
  // Automatically injected by Log Location Injector vscode extension
}
