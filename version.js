import path from "path";
import fs from "fs";

const driveLetterPattern = /^\/[A-Z]:\//;
let projectRootPath = new URL("./", import.meta.url).pathname;

if (driveLetterPattern.test(projectRootPath)) {
  projectRootPath = projectRootPath.substring(1);
}

projectRootPath = projectRootPath.replaceAll("\\", "/");

const packageJsonPath = path.join(projectRootPath, "package.json");

const packageJsonContents = fs.readFileSync(packageJsonPath).toString();
const packageData = JSON.parse(packageJsonContents);

export const { version } = packageData;
