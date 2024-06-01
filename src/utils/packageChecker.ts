import fs from "fs";
import cp from "child_process";
import chalk from "chalk";

type Package = { name: string; version?: string };

type CheckPackagesProps = {
  requiredPackages: Package[];
};

export default function checkPackages({
  requiredPackages,
}: CheckPackagesProps) {
  const packageJSON = fs.readFileSync("package.json", "utf-8");
  const isYarn = fs.existsSync("yarn.lock");
  let command = isYarn ? "yarn add" : "npm install";
  let install = false;
  for (let pkg of requiredPackages) {
    if (packageJSON.includes(`"${pkg.name}"`)) continue;
    command += ` ${pkg.name}@${pkg.version || "latest"}`;
    install = true;
  }
  if (install) {
    console.log(chalk.cyanBright(`Running command: ${command}`));
    cp.execSync(command, { encoding: "utf-8", stdio: "inherit" });
  }
}
