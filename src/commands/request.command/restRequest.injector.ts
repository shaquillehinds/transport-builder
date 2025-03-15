import { RequestMethod } from "@src/@types";
import { toCamelCase, toTitleCase } from "@src/utils/algorithms";
import { templatePath } from "@src/utils/constants";
import { requestTemplate, ValidityRef } from "@src/utils/constants/templates";
import src from "@src/utils/src";
import { InjectionPipeline } from "tscodeinject";

interface RequestInjectorProps {
  method: string;
  clientName: string;
  transportName: string;
  requestName: string;
  requestMethod: RequestMethod;
  returns?: any;
  requestBody?: any;
  requestParams?: any;
  requestQuery?: any;
  validityRef: ValidityRef;
  disableOpenFiles?: boolean;
}

export default async function restRequestInjector(props: RequestInjectorProps) {
  // const name = toCamelCase(props.requestName);
  const name = props.method.toLowerCase() === "delete" ? "del" : props.method;
  const Name = toTitleCase(props.requestName);
  const TransportName = toTitleCase(props.transportName);
  const clientName = toCamelCase(props.clientName);
  const ClientName = toTitleCase(clientName);

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
        validityRef: props.validityRef,
        requestBody: props.requestBody,
        requestQuery: props.requestQuery,
        requestParams: props.requestParams,
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
