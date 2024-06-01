import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(join(__filename, "../"));

export const templatePath = (name: string) =>
  `${__dirname}/templates/${name}.template`;
