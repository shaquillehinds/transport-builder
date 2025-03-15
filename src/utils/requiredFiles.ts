import {
  httpClientTemplate,
  interceptorsTemplate,
  transportsIndexTemplate,
  transportsTemplate,
  transportsTypeTemplate,
} from "./constants/templates";

export const requiredFolders = [
  "transports",
  "transports/base",
  "transports/base/schemas",
] as const;
export const requiredFiles = [
  "transports/index.ts",
  "transports/transports.ts",
  "transports/base/HttpClient.ts",
  "transports/base/interceptors.ts",
  "transports/base/transports.types.ts",
] as const;
export const requiredFilesAndFolders = [...requiredFolders, ...requiredFiles];
export type RequiredFiles = (typeof requiredFiles)[number];
export type RequiredFolders = (typeof requiredFolders)[number];
export type RequiredFilesAndFolders = (typeof requiredFilesAndFolders)[number];

export const requiredFilesContent: Record<RequiredFiles, string> = {
  "transports/index.ts": transportsIndexTemplate,
  "transports/transports.ts": transportsTemplate,
  "transports/base/HttpClient.ts": httpClientTemplate,
  "transports/base/interceptors.ts": interceptorsTemplate,
  "transports/base/transports.types.ts": transportsTypeTemplate,
};

export const requiredRESTFiles = [] as const;
export const requiredRESTFolders = ["transports/REST"] as const;
export const requiredRESTFilesAndFolders = [
  ...requiredRESTFiles,
  ...requiredRESTFolders,
] as const;
export const requiredRESTFilesContent: Record<RequiredRestFiles, string> = {};
export type RequiredRestFiles = (typeof requiredRESTFiles)[number];
export type RequiredRestFolders = (typeof requiredRESTFolders)[number];
export type RequiredRestFilesAndFolders =
  (typeof requiredRESTFilesAndFolders)[number];

export const requiredGraphQLFiles = [] as const;
export const requiredGraphQLFolders = ["transports/GraphQL"] as const;
export const requiredGraphQLFilesAndFolders = [
  ...requiredGraphQLFiles,
  ...requiredGraphQLFolders,
] as const;
export const requiredGraphQLFilesContent: Record<RequiredGraphQLFiles, string> =
  {};
export type RequiredGraphQLFiles = (typeof requiredGraphQLFiles)[number];
export type RequiredGraphQLFolders = (typeof requiredGraphQLFolders)[number];
export type RequiredGraphQLFilesAndFolders =
  (typeof requiredGraphQLFilesAndFolders)[number];
