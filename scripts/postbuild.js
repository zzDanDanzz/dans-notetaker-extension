import { execSync } from "child_process";
import { existsSync, copyFileSync, rmSync } from "fs";
let fileNames = ["background"];
let SRC_DIR = "src/extension_scripts";
let DEST_DIR = "dist";
let extensions = {
    ts: ".ts",
    js: ".js",
};
main();
function main() {
    compileTsFiles();
    moveCompiledFiles();
}
function compileTsFiles() {
    fileNames.forEach((fileName) => {
        let path = `${SRC_DIR}/${fileName}${extensions.ts}`;
        console.log(`compiling ${path}`);
        if (!fileExists(path)) {
            console.error(`${path} does not exist`);
            return;
        }
        execCompileCommandOn(path);
    });
}
function moveCompiledFiles() {
    fileNames.forEach((fileName) => {
        let currPath = `${SRC_DIR}/${fileName}${extensions.js}`;
        let destPath = `${DEST_DIR}/${fileName}${extensions.js}`;
        console.log(`moving ${currPath} to ${destPath}`);
        if (!fileExists(currPath)) {
            console.error(`${currPath} does not exist\n`);
            return;
        }
        move(currPath, destPath);
    });
}
function move(src, dest) {
    try {
        copyFileSync(src, dest);
        rmSync(src);
        console.log(`Moved successfully\n`);
    }
    catch (error) {
        console.error(error);
    }
}
function execCompileCommandOn(path) {
    try {
        execSync(`npx tsc ${path}`);
        console.log(`Compilied ${path} successfully\n`);
    }
    catch (error) {
        console.error(error);
    }
}
function fileExists(path) {
    return existsSync(path);
}
// npx tsc --outDir dist --target es6 src/index.ts --allowSyntheticDefaultImports
