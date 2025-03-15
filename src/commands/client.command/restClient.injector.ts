import { toCamelCase, toTitleCase } from "@src/utils/algorithms";
import { templatePath } from "@src/utils/constants";
import src from "@src/utils/src";
import { InjectionPipeline } from "tscodeinject";

interface ClientInjectorProps {
  transportName: string;
  clientName: string;
  path: string;
  disableOpenFiles?: boolean;
}

export default async function restClientInjector(props: ClientInjectorProps) {
  const clientName = props.clientName.trim();
  const name = toCamelCase(clientName);
  const Name = toTitleCase(name);
  const TransportName = toTitleCase(props.transportName);

  //@ts-ignore
  await new InjectionPipeline(
    src(`transports/REST/${props.transportName}/index.ts`),
    { disableLogs: true }
  )
    .injectImport({
      importName: `${Name}Client`,
      source: `./${name}`,
      isDefault: true,
    })
    .injectClassMember(
      { stringTemplate: `${name}: ${Name}Client` },
      { name: `${TransportName}Transport` }
    )
    .injectClassConstructor(
      {
        stringTemplate: `this.${name} = new ${Name}Client(baseUrl + "${props.path}", interceptors);`,
      },
      { name: `${TransportName}Transport` }
    )
    .injectDirectory(src(`transports/REST/${props.transportName}/${name}`))
    .injectFileFromTemplate({
      newFilePath: src(
        `transports/REST/${props.transportName}/${name}/index.ts`
      ),
      templatePath: templatePath("clientIndex"),
      replaceKeywords: [
        { keyword: "{{Name}}", replacement: Name },
        { keyword: "{{name}}", replacement: name },
      ],
    })
    .injectDirectory(
      src(`transports/REST/${props.transportName}/${name}/requests`)
    )
    .injectFileFromTemplate({
      newFilePath: src(
        `transports/REST/${props.transportName}/${name}/requests/index.ts`
      ),
      templatePath: templatePath("requestsIndex"),
      replaceKeywords: [
        { keyword: "{{Name}}", replacement: Name },
        { keyword: "{{name}}", replacement: name },
      ],
    })
    .finish(
      props.disableOpenFiles
        ? []
        : [src(`transports/REST/${props.transportName}/index.ts`)]
    );
}
