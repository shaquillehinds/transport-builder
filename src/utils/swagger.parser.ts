import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import { RequestMethod } from "@src/@types";
import { firstLetterCap } from "./algorithms";
import reservedKeywords from "./reservedKeywords";

type PathItemObject = OpenAPIV3.PathItemObject | OpenAPIV3_1.PathItemObject;
type SchemaOrReference =
  | OpenAPIV3.SchemaObject
  | OpenAPIV3_1.SchemaObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.ReferenceObject;

type ParameterOrReference =
  | OpenAPIV3.ParameterObject
  | OpenAPIV3_1.ParameterObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.ReferenceObject;

const methods: RequestMethod[] = ["post", "delete", "get", "patch", "put"];
export type EndpointData = {
  requestName: string;
  returns: any;
  requestBody?: any;
  queryParams?: any;
  parameters?: any;
};

type SwaggerPathItemParserProps = {
  document: OpenAPIV3.Document | OpenAPIV3_1.Document;
  clientName: string;
  path: PathItemObject;
};

type SwaggerPathItemParserReturn = Partial<Record<RequestMethod, EndpointData>>;

export function swaggerPathItemParser(
  props: SwaggerPathItemParserProps
): SwaggerPathItemParserReturn {
  const endpointData: SwaggerPathItemParserReturn = {};
  for (const method of methods) {
    const methodRequest = props.path[method];
    if (!methodRequest) continue;
    let requestName = methodRequest.operationId;
    if (requestName) {
      const split = requestName.split("_");
      requestName = split[1] || split[0];
      if (reservedKeywords[requestName]) {
        const found = requestName.search(new RegExp(props.clientName, "ig"));
        if (found === -1)
          requestName = props.clientName + firstLetterCap(requestName);
      }
    } else {
      requestName = method + firstLetterCap(props.clientName);
    }
    endpointData[method] = {
      requestName,
      returns: undefined,
    };
    for (const response in methodRequest.responses) {
      if (response[0] === "2") {
        const responseData = methodRequest.responses[response]!;
        if ("content" in responseData && responseData.content) {
          for (const mime in responseData.content) {
            const schema = responseData.content[mime].schema;
            if (schema && "type" in schema && schema.type) {
              endpointData[method]!.returns = schemaObjectParser({
                object: schema,
                document: props.document,
              });
            } else if (schema && "$ref" in schema) {
              const schemaRefReturn = getRef(schema.$ref, props.document);
              endpointData[method]!.returns = schemaRefReturn;
            }
          }
        }
      }
    }
    if (methodRequest.requestBody) {
      if ("content" in methodRequest.requestBody) {
        for (const mime in methodRequest.requestBody.content) {
          const schema = methodRequest.requestBody.content[mime].schema;
          if (schema && "type" in schema && schema.type) {
            endpointData[method]!.requestBody = schemaObjectParser({
              object: schema,
              document: props.document,
            });
          } else if (schema && "$ref" in schema) {
            endpointData[method]!.requestBody = getRef(
              schema.$ref,
              props.document
            );
          }
        }
      } else if ("$ref" in methodRequest.requestBody) {
        endpointData[method]!.requestBody = getRef(
          methodRequest.requestBody.$ref,
          props.document
        );
      }
    }
    const parsedPathParams = parseParams(props.document, props.path.parameters);
    const parsedMethodParams = parseParams(
      props.document,
      methodRequest.parameters
    );
    if (parsedPathParams || parsedMethodParams) {
      const params = {
        ...(parsedMethodParams?.endpointData.parameters || {}),
        ...(parsedPathParams?.endpointData.parameters || {}),
      };
      const query = {
        ...(parsedMethodParams?.endpointData.queryParams || {}),
        ...(parsedPathParams?.endpointData.queryParams || {}),
      };
      endpointData[method]!.parameters = JSON.stringify(params).replaceAll(
        '"',
        ""
      );
      endpointData[method]!.queryParams = JSON.stringify(query).replaceAll(
        '"',
        ""
      );
      const nRP = (parsedPathParams?.nRP || [], parsedMethodParams?.nRP || []);
      const nRQP =
        (parsedPathParams?.nRQP || [], parsedMethodParams?.nRQP || []);
      for (const notReq of nRP) {
        endpointData[method]!.parameters = endpointData[
          method
        ]!.parameters.replace(`${notReq}:`, `${notReq}?:`);
      }
      for (const notReq of nRQP) {
        endpointData[method]!.queryParams = endpointData[
          method
        ]!.queryParams.replace(`${notReq}:`, `${notReq}?:`);
      }
    }
  }
  return endpointData;
}

function parseParams(
  document: OpenAPIV3.Document | OpenAPIV3_1.Document,
  parameters?: ParameterOrReference[]
) {
  if (!parameters) return;
  const endpointData: Pick<EndpointData, "parameters" | "queryParams"> = {};
  // notRequiredParameters
  const nRP: string[] = [];
  const nRQP: string[] = [];
  for (const parameter of parameters) {
    if ("$ref" in parameter) {
      const returned = getParameterRef(parameter.$ref, document);
      if (typeof returned === "object" && "type" in returned) {
        if (returned.type === "path") {
          if (!endpointData.parameters) endpointData.parameters = {};
          endpointData.parameters[returned.name] = returned.param;
          if (!returned.required) nRP.push(returned.name);
        } else if (returned.type === "query") {
          if (!endpointData.queryParams) endpointData.queryParams = {};
          endpointData.queryParams[returned.name] = returned.param;
          if (!returned.required) nRQP.push(returned.name);
        }
      }
    } else if ("name" in parameter && parameter.schema) {
      if (parameter.in === "path") {
        if (!endpointData.parameters) endpointData.parameters = {};
        endpointData.parameters[parameter.name] = schemaObjectParser({
          object: parameter.schema,
          document,
        });
      } else if (parameter.in === "query") {
        if (!endpointData.queryParams) endpointData.queryParams = {};
        endpointData.queryParams[parameter.name] = schemaObjectParser({
          object: parameter.schema,
          document: document,
        });
      }
    }
  }
  return {
    endpointData,
    nRP,
    nRQP,
  };
}

type SchemaObjectParserProps = {
  object: SchemaOrReference;
  document: OpenAPIV3.Document | OpenAPIV3_1.Document;
  isNested?: boolean;
};
export function schemaObjectParser({
  object,
  isNested,
  document,
}: SchemaObjectParserProps) {
  if ("$ref" in object) {
    return getRef(object.$ref, document);
  }
  let returnValue: any = undefined;
  const isArray: boolean = false;
  if (object.enum) {
    return object.enum.map((e) => `'${e}'`).join(" | ");
  }
  switch (object.type) {
    case "integer":
      returnValue = "number";
      break;
    case "array": {
      if (object.items && "type" in object.items) {
        returnValue = schemaObjectParser({
          object: object.items,
          isNested: true,
          document,
        });
      }
      break;
    }
    case "object":
      if (object.properties) {
        const properties: Record<string, any> = {};
        for (const prop in object.properties) {
          properties[prop] = schemaObjectParser({
            document,
            object: object.properties[prop],
            isNested: true,
          });
        }
        returnValue = properties;
      }
      break;
    default:
      returnValue = object.type;
      break;
  }
  if (isNested) return returnValue;
  let returnString = JSON.stringify(returnValue);
  if (isArray) returnString += "[]";
  if (returnString) {
    returnString = returnString.replaceAll('"', "");
    if (object.properties && object.required) {
      for (const prop in object.properties) {
        if (!object.required.includes(prop))
          returnString = returnString.replace(`${prop}:`, `${prop}?:`);
      }
    }
    return returnString;
  }
  return returnString;
}

function getRef(
  refName: string,
  document: OpenAPIV3.Document | OpenAPIV3_1.Document
): any {
  if (document.components?.schemas) {
    const split = refName.split("/");
    const schemaName = split[split.length - 1];
    const refSchema = document.components.schemas[schemaName];
    if ("type" in refSchema)
      return schemaObjectParser({
        object: refSchema,
        document: document,
      });
  } else return refName;
}

function getParameterRef(
  refName: string,
  document: OpenAPIV3.Document | OpenAPIV3_1.Document
) {
  if (document.components?.parameters) {
    const split = refName.split("/");
    const paramName = split[split.length - 1];
    const parameter = document.components.parameters[paramName];
    // console.log($lf(276), parameter);
    if ("in" in parameter && parameter.schema)
      return {
        type: parameter.in,
        required: parameter.required,
        name: parameter.name,
        param: schemaObjectParser({
          object: parameter.schema,
          document: document,
        }),
      };
  } else return refName;
}

function $lf(n: number) {
  return "$lf|src/utils/swagger.parser.ts:" + n + " >";
  // Automatically injected by Log Location Injector vscode extension
}
