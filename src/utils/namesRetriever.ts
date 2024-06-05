import fs from "fs";

type NameRetrieverProps = {
  dirPath: string;
  rmExt?: boolean;
  rmIndex?: boolean;
};

export default function namesRetriever(props: NameRetrieverProps) {
  let contents = fs.readdirSync(props.dirPath);
  if (props.rmExt) contents = contents.map((item) => item.split(".")[0]);
  if (props.rmIndex)
    contents = contents.filter((item) => !item.includes("index"));
  return contents;
}

// namesRetriever({ dirPath: "src/transports/REST" });
