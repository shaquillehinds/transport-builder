import fs from "fs";

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
  for (let folder of requiredFolders) {
    const exists = fs.existsSync(folder);
    if (exists) continue;
    if (autoCreate.folders?.includes(folder)) fs.mkdirSync(folder);
    else throw new Error(`${folder} does not exist.`);
  }
  for (let f of requiredFiles) {
    const file = f as File;
    const exists = fs.existsSync(file);
    if (exists) continue;
    if (autoCreate.files && autoCreate.files[file]) {
      const contents = autoCreate.files[file];
      fs.writeFileSync(file, contents);
    } else throw new Error(`${file} does not exist.`);
  }
}
