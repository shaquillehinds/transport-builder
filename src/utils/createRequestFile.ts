import { existsSync, writeFileSync } from "fs";
import src from "./src";

type CreateRequestFileProps = {
  transportName: string;
  clientName: string;
  requestName: string;
};

export default function createRequestFile(props: CreateRequestFileProps) {
  const path = src(
    `transports/REST/${props.transportName}/${props.clientName}/requests/${props.requestName}.ts`
  );
  if (!existsSync(path)) writeFileSync(path, "", "utf-8");
}
