#!/usr/bin/env node

import fs = require("fs");
import path = require("path");
import child_process = require("child_process");

const destinationPackage = "scailo-test-widget";
const rootFolder = process.cwd();

function spawnChildProcess(command: string, args: string[] = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = child_process.spawn(command, args, options);

        // Optional: Log stdout and stderr for debugging
        child.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(`Child process exited with code ${code}`);
            } else {
                reject(new Error(`Child process exited with code ${code}`));
            }
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
}

async function setupGitIgnore() {
    // Setup the .gitignore file
    const gitignoreList = [
        "node_modules/",
        ".env",
        "tsconfig.tsbuildinfo",
        ".DS_Store"
    ];

    fs.writeFileSync(".gitignore", gitignoreList.join("\n"), { flag: "w", flush: true });
}

async function setupNPMDependencies() {
    // Setup the node modules installation
    const npmDependencies = [
        "@kernelminds/scailo-sdk@latest",
    ];

    await spawnChildProcess("npm", ["install", ...npmDependencies, "--save"]);

    const npmDevDependencies = [
        "tailwindcss",
        "@tailwindcss/cli",
        "daisyui@latest",
        "typescript",
        "@types/node",
        "esbuild",
    ];

    await spawnChildProcess("npm", ["install", ...npmDevDependencies, "--save-dev"]);
    // Create the tsconfig.json
    await spawnChildProcess("npx", ["tsc", "--init"]);
}

function createResourcesFolders() {
    const resourcesFolderName = path.join("resources");
    const distFolderName = path.join(resourcesFolderName, "dist");
    const srcFoldername = path.join(resourcesFolderName, "src");
    let resourcesFolders = [
        path.join(resourcesFolderName),

        path.join(distFolderName),
        path.join(distFolderName, "css"),
        path.join(distFolderName, "img"),
        path.join(distFolderName, "js"),

        path.join(srcFoldername),
        path.join(srcFoldername, "ts"),
        path.join(srcFoldername, "css")
    ];

    for (const folder of resourcesFolders) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const inputCSSPath = path.join(srcFoldername, "css", "app.css");
    const inputTSPath = path.join(srcFoldername, "ts", "app.ts");
    // Copy the img folder
    fs.cpSync(path.join(rootFolder, "img"), path.join(distFolderName, "img"), { recursive: true });

    return {
        inputCSSPath,
        distFolderName,
        inputTSPath
    }
}

async function createBuildScripts({ inputCSSPath, distFolderName, inputTSPath }: { inputCSSPath: string, distFolderName: string, inputTSPath: string }) {
    // Write all the package JSON scripts here
    let packageJSON = JSON.parse(fs.readFileSync("package.json", "utf-8")) as Object;
    let packageJSONScripts = (<any>packageJSON).scripts || {} as Object;

    let scripts = [
        ["css:build", `npx tailwindcss -i ${inputCSSPath} -o ${path.join(distFolderName, "css", "bundle.css")} --minify`],
        ["css:watch", `npx tailwindcss -i ${inputCSSPath} -o ${path.join(distFolderName, "css", "bundle.css")} --watch`],

        ["ui:build", `npx esbuild ${inputTSPath} --bundle --outfile=${path.join(distFolderName, "js", "bundle.src.min.js")} --minify`],
        ["ui:watch", `npx esbuild ${inputTSPath} --bundle --outfile=${path.join(distFolderName, "js", "bundle.src.min.js")} --watch`],
    ]

    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i]!;
        packageJSONScripts[script[0]!] = script[1];
    }

    (<any>packageJSON).scripts = packageJSONScripts;
    fs.writeFileSync("package.json", JSON.stringify(packageJSON, null, 2), { flag: "w", flush: true });
}

async function runPostSetupScripts() {
    // Run the first CSS build
    await spawnChildProcess("npm", ["run", "css:build"]);
    await spawnChildProcess("npm", ["run", "ui:build"]);
}

async function main() {

    // Create the destination folder
    fs.mkdirSync(destinationPackage, { recursive: true });
    // Copy the .vscode folder
    fs.cpSync(path.join(".vscode"), path.join(destinationPackage, ".vscode"), { recursive: true });

    // Change the directory
    process.chdir(destinationPackage);
    // Create the package.json
    await spawnChildProcess("npm", ["init", "-y"]);

    await setupGitIgnore();
    await setupNPMDependencies();


    // Create the resources folder
    const { inputCSSPath, distFolderName, inputTSPath } = createResourcesFolders();
    // Create the input css
    fs.writeFileSync(inputCSSPath, [`@import "tailwindcss"`, `@plugin "daisyui"`].map(a => `${a};`).join("\n"), { flag: "w", flush: true });

    // Create the index.ts
    fs.writeFileSync(inputTSPath, `console.log("Scailo Widget!")`, { flag: "w", flush: true });

    await createBuildScripts({ inputCSSPath, distFolderName, inputTSPath });
    await runPostSetupScripts();
    console.log("Hello there! We are live! This is from TypeScript");
}

main();