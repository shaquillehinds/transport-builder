import { RequestMethod } from "@src/@types";
import { templatePath } from "@src/utils/constants";
import { requestTemplate } from "@src/utils/constants/templates";
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
  const name = props.requestName.trim();
  const Name = name[0].toUpperCase() + name.slice(1);
  const TransportName =
    props.transportName[0].toUpperCase() + props.transportName.slice(1);
  const ClientName =
    props.clientName[0].toUpperCase() + props.clientName.slice(1);

  //@ts-ignore
  await new InjectionPipeline(
    `src/transports/REST/${props.transportName}/${props.clientName}/index.ts`
  )
    .injectClassMember(
      {
        stringTemplate: `async ${name}(
    props: ${ClientName}RequestsProps.${Name}
  ): ${ClientName}RequestsReturn.${Name} {
    return await ${props.clientName}Requests.${name}.bind(this)(props);
  }`,
      },
      { name: `${ClientName}Client` }
    )
    .injectFileFromTemplate({
      newFilePath: `src/transports/REST/${props.transportName}/${props.clientName}/requests/${name}.ts`,
      templatePath: templatePath("blank"),
      replaceKeywords: [],
    })
    .parse(
      `src/transports/REST/${props.transportName}/${props.clientName}/requests/${name}.ts`
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
      `src/transports/REST/${props.transportName}/${props.clientName}/requests/index.ts`
    )
    .injectImport({ source: `./${name}`, importName: name })
    .injectImport({ source: `./${name}`, importName: `${Name}Props` })
    .injectImport({ source: `./${name}`, importName: `${Name}Return` })
    .injectProperty({ property: name }, { name: `${props.clientName}Requests` })
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
            `src/transports/REST/${props.transportName}/${props.clientName}/requests/${name}.ts`,
          ]
        : []
    );
}
