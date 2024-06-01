import {
  httpClientTemplate,
  interceptorsTemplate,
  transportsIndexTemplate,
  transportsTemplate,
  transportsTypeTemplate,
} from "./constants/templates";

export const requiredFolders = [
  "src",
  "src/transports",
  "src/transports/base",
] as const;
export const requiredFiles = [
  "src/transports/index.ts",
  "src/transports/transports.ts",
  "src/transports/base/HttpClient.ts",
  "src/transports/base/interceptors.ts",
  "src/transports/base/transports.types.ts",
] as const;
export const requiredFilesAndFolders = [...requiredFolders, ...requiredFiles];
export type RequiredFiles = (typeof requiredFiles)[number];
export type RequiredFolders = (typeof requiredFolders)[number];
export type RequiredFilesAndFolders = (typeof requiredFilesAndFolders)[number];

export const requiredFilesContent: Record<RequiredFiles, string> = {
  "src/transports/index.ts": transportsIndexTemplate,
  "src/transports/transports.ts": transportsTemplate,
  "src/transports/base/HttpClient.ts": httpClientTemplate,
  "src/transports/base/interceptors.ts": interceptorsTemplate,
  "src/transports/base/transports.types.ts": transportsTypeTemplate,
};

export const requiredRESTFiles = [] as const;
export const requiredRESTFolders = ["src", "src/transports/REST"] as const;
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
export const requiredGraphQLFolders = [
  "src",
  "src/transports/GraphQL",
] as const;
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
