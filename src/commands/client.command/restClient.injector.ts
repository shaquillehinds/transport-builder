import { templatePath } from "@src/utils/constants";
import InjectionPipeline from "tscodeinject";

interface ClientInjectorProps {
  transportName: string;
  clientName: string;
}

export default async function restClientInjector(props: ClientInjectorProps) {
  const name = props.clientName.trim();
  const Name = name[0].toUpperCase() + name.slice(1);
  const TransportName =
    props.transportName[0].toUpperCase() + props.transportName.slice(1);

  //@ts-ignore
  await new InjectionPipeline(
    `src/transports/REST/${props.transportName}/index.ts`
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
        stringTemplate: `this.${name} = new ${Name}Client(baseUrl + "/${name}", interceptors); // make sure the endpoint is correct`,
      },
      { name: `${TransportName}Transport` }
    )
    .injectDirectory(`src/transports/REST/${props.transportName}/${name}`)
    .injectFileFromTemplate({
      newFilePath: `src/transports/REST/${props.transportName}/${name}/index.ts`,
      templatePath: templatePath("clientIndex"),
      replaceKeywords: [
        { keyword: "{{Name}}", replacement: Name },
        { keyword: "{{name}}", replacement: name },
      ],
    })
    .injectDirectory(
      `src/transports/REST/${props.transportName}/${name}/requests`
    )
    .injectFileFromTemplate({
      newFilePath: `src/transports/REST/${props.transportName}/${name}/requests/index.ts`,
      templatePath: templatePath("requestsIndex"),
      replaceKeywords: [
        { keyword: "{{Name}}", replacement: Name },
        { keyword: "{{name}}", replacement: name },
      ],
    })
    .finish([`src/transports/REST/${props.transportName}/index.ts`]);
}
