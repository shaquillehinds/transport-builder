import { RequestMethod } from "@src/@types";
import { toCamelCase, toTitleCase } from "@src/utils/algorithms";
import { templatePath } from "@src/utils/constants";
import { requestTemplate } from "@src/utils/constants/templates";
import src from "@src/utils/src";
import { InjectionPipeline } from "tscodeinject";

interface RequestInjectorProps {
  clientName: string;
  transportName: string;
  requestName: string;
  requestMethod: RequestMethod;
  returns?: any;
  requestBody?: any;
  disableOpenFiles?: boolean;
}

export default async function restRequestInjector(props: RequestInjectorProps) {
  const name = toCamelCase(props.requestName);
  const Name = toTitleCase(name);
  const TransportName = toTitleCase(props.transportName);
  const clientName = toCamelCase(props.clientName);
  const ClientName = toTitleCase(clientName);

  console.log($lf(25), clientName, ClientName, name, Name, TransportName);
  await new InjectionPipeline(
    src(`transports/REST/${props.transportName}/${clientName}/index.ts`)
  )
    .injectClassMember(
      {
        stringTemplate: `async ${name}(
    props: ${ClientName}RequestsProps.${Name}
  ): ${ClientName}RequestsReturn.${Name} {
    return await ${clientName}Requests.${name}.bind(this)(props);
  }`,
      },
      { name: `${ClientName}Client` }
    )
    .injectFileFromTemplate({
      newFilePath: src(
        `transports/REST/${props.transportName}/${clientName}/requests/${name}.ts`
      ),
      templatePath: templatePath("blank"),
      replaceKeywords: [],
    })
    .parse(
      src(
        `transports/REST/${props.transportName}/${clientName}/requests/${name}.ts`
      )
    )
    .injectStringTemplate({
      template: requestTemplate({
        ClientName,
        name,
        Name,
        method: props.requestMethod,
        returns: props.returns,
        requestBody: props.requestBody,
      }),
    })
    .parse(
      src(
        `transports/REST/${props.transportName}/${clientName}/requests/index.ts`
      )
    )
    .injectImport({ source: `./${name}`, importName: name })
    .injectImport({ source: `./${name}`, importName: `${Name}Props` })
    .injectImport({ source: `./${name}`, importName: `${Name}Return` })
    .injectProperty({ property: name }, { name: `${clientName}Requests` })
    .injectTSNamespace(
      { stringTemplate: `export type ${Name} = ${Name}Props` },
      { name: `${ClientName}RequestsProps` }
    )
    .injectTSNamespace(
      { stringTemplate: `export type ${Name} = ${Name}Return` },
      { name: `${ClientName}RequestsReturn` }
    )
    .finish(
      !props.disableOpenFiles
        ? [
            src(
              `transports/REST/${props.transportName}/${clientName}/requests/${name}.ts`
            ),
          ]
        : []
    );
}

function $lf(n: number) {
  return "$lf|commands/request.command/restRequest.injector.ts:" + n + " >";
  // Automatically injected by Log Location Injector vscode extension
}
