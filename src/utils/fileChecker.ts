import fs from "fs";
import src from "./src";

type CheckFilesProps<File extends string, Folder extends string> = {
  requiredFiles: readonly File[];
  requiredFolders: readonly Folder[];
  autoCreate: {
    files?: Record<File, string>;
    folders?: readonly Folder[];
  };
};
export default function checkFiles<File extends string, Folder extends string>({
  requiredFiles,
  requiredFolders,
  autoCreate,
}: CheckFilesProps<File, Folder>) {
  const autoCreateFolders = autoCreate.folders?.map((f) => src(f));
  for (let f of requiredFolders) {
    const folder = src(f) as Folder;
    const exists = fs.existsSync(folder);
    if (exists) continue;
    if (autoCreateFolders?.includes(folder)) fs.mkdirSync(folder);
    else throw new Error(`${folder} does not exist.`);
  }
  for (let f of requiredFiles) {
    const file = src(f) as File;
    const exists = fs.existsSync(file);
    if (exists) continue;
    if (autoCreate.files && autoCreate.files[f]) {
      const contents = autoCreate.files[f];
      fs.writeFileSync(file, contents);
    } else throw new Error(`${file} does not exist.`);
  }
}
