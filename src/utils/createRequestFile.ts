import { existsSync, writeFileSync } from "fs";

type CreateRequestFileProps = {
  transportName: string;
  clientName: string;
  requestName: string;
};

export default function createRequestFile(props: CreateRequestFileProps) {
  if (
    !existsSync(
      `src/transports/REST/${props.transportName}/${props.clientName}/requests/${props.requestName}.ts`
    )
  )
    writeFileSync(
      `src/transports/REST/${props.transportName}/${props.clientName}/requests/${props.requestName}.ts`,
      "",
      "utf-8"
    );
}
