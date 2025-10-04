#!/usr/bin/env node

import fs = require("fs");
import path = require("path");
import child_process = require("child_process");
import ts = require('typescript');
import prompt = require('@inquirer/prompts');

let applicationIdentifier = "scailo-test-widget";
let applicationName = "Scailo Test Widget";

let version = "0.0.1";
const rootFolder = path.dirname(__dirname);

async function acceptUserInputs() {
    applicationName = (await prompt.input({
        message: "Enter the Application Name: ",
        default: applicationName,
        required: true,
        validate: input => input.length > 0
    })).trim();

    applicationIdentifier = (await prompt.input({
        message: "Enter the Application Identifier: ",
        default: applicationIdentifier,
        required: true,
        validate: input => input.length > 0
    })).trim();

    version = (await prompt.input({
        message: "Enter the Initial Version Number (Semver Format): ",
        default: version,
        required: true,
        validate: input => input.length > 0
    })).trim();

    console.log(`Application Name: ${applicationName}`);
    console.log(`Application Identifier: ${applicationIdentifier}`);
    console.log(`Version: ${version}`);
}

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

    fs.writeFileSync(".gitignore", gitignoreList.join("\n").trim(), { flag: "w", flush: true });
}

async function setupNPMDependencies() {
    // Setup the node modules installation
    const npmDependencies = [
        "@kernelminds/scailo-sdk@latest",
        "@bufbuild/protobuf@1.4.2",
        "@connectrpc/connect-web@1.1.2"
    ];

    await spawnChildProcess("npm", ["install", ...npmDependencies, "--save"]);

    const npmDevDependencies = [
        "tailwindcss",
        "@tailwindcss/cli",
        "daisyui@latest",
        "typescript",
        "@types/node",
        "esbuild",
        "@inquirer/prompts@7.8.6",
        "@connectrpc/connect-node@1.4.0",

        "fastify@4.28.1",
        "@fastify/http-proxy@9.5.0",
        "@fastify/static@7.0.4",
        "fastify-favicon@4.3.0",
        "dotenv",

        "semver",
        "@types/semver",
        "yaml",
        "adm-zip",
        "@types/adm-zip",
    ];

    await spawnChildProcess("npm", ["install", ...npmDevDependencies, "--save-dev"]);
    // Create the tsconfig.json
    await spawnChildProcess("npx", ["tsc", "--init"]);
}

async function setupScripts() {
    const scriptsFolderName = path.join("scripts")
    let folders = [
        path.join(scriptsFolderName),
    ];
    for (const folder of folders) {
        fs.mkdirSync(folder, { recursive: true });
    }
    // Copy package.ts
    fs.copyFileSync(path.join(rootFolder, "src", "package.ts"), path.join(scriptsFolderName, "package.ts"));
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

        ["dev:serve", `npx tsx -r dotenv/config server.ts`],

        ["package", `npx tsx scripts/package.ts`],
    ]

    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i]!;
        packageJSONScripts[script[0]!] = script[1];
    }

    (<any>packageJSON).scripts = packageJSONScripts;
    (<any>packageJSON).version = version;
    fs.writeFileSync("package.json", JSON.stringify(packageJSON, null, 2), { flag: "w", flush: true });
}

async function createIndexHTML({ appName, version }: { appName: string, version: string }) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="./resources/dist/img/favicon.ico" type="image/x-icon">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link rel="preload" as="script" href="./resources/dist/js/bundle.src.min.js">
    <link rel="stylesheet" href="./resources/dist/css/bundle.css">
    <title>${appName}</title>
</head>
<body class="text-gray-800">
    <!-- Attach the JS bundle here -->
    <script src="./resources/dist/js/bundle.src.min.js"></script>
</body>
</html>`;
    // Create index.html
    fs.writeFileSync("index.html", html.trim(), { flag: "w", flush: true });
}

async function createEntryTS({ inputTSPath }: { inputTSPath: string }) {
    const script = `
import { createConnectTransport } from "@connectrpc/connect-web";

window.addEventListener("load", async (evt) => {
    evt.preventDefault();
    console.log("Scailo Widget!")
});

export function getReadTransport() {
    return createConnectTransport({
        // Need to use binary format (at least for the time being)
        baseUrl: location.origin, useBinaryFormat: false, interceptors: []
    });
}

`;

    // Create index.ts
    fs.writeFileSync(inputTSPath, script.trim(), { flag: "w", flush: true });
}

async function createManifest({ appName, version, appIdentifier }: { appName: string, version: string, appIdentifier: string }) {
    const manifest = `
manifest_version: 1
app_version: "${version}"
app_name: "${appName}"
app_unique_identifier: "${appIdentifier}"
min_genesis_version: "*"
max_genesis_version: "*"
resources:
    html_entry: "index.html"
    logos:
        - "resources/dist/img/logo.png"
    external_apis: []`;

    // Create MANIFEST.yaml
    fs.writeFileSync("MANIFEST.yaml", manifest.trim(), { flag: "w", flush: true });
}

async function createTestServer() {
    fs.copyFileSync(path.join(rootFolder, "server", "server.ts"), "server.ts");

    const envFile = `
upstreamAPI=http://127.0.0.1:21000
port=9090
username=
password=`;

    fs.writeFileSync(".env", envFile.trim(), { flag: "w", flush: true });
}

function stripJSONComments(jsonString: string) {
    // Remove multi-line comments
    jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove single-line comments
    jsonString = jsonString.replace(/\/\/.*$/gm, '');
    return jsonString;
}

async function fixTSConfig() {
    const configFileName = ts.findConfigFile(
        "tsconfig.json",
        ts.sys.fileExists,
    );

    if (!configFileName) {
        throw new Error(`Could not find a valid tsconfig.json`);
    }

    const configFileText = ts.sys.readFile(configFileName);
    if (!configFileText) {
        throw new Error(`Could not read file ${configFileName}`);
    }

    const { config, error } = ts.parseConfigFileTextToJson(configFileName, configFileText);

    if (error) {
        throw new Error(`Error parsing tsconfig.json: ${error.messageText}`);
    }

    const parsedCommandLine = ts.parseJsonConfigFileContent(
        config,
        ts.sys,
        path.dirname(configFileName)
    );

    parsedCommandLine.options.verbatimModuleSyntax = false;
    parsedCommandLine.options.sourceMap = false;
    parsedCommandLine.options.declaration = false;
    parsedCommandLine.options.declarationMap = false;

    fs.writeFileSync("tsconfig.json", JSON.stringify(parsedCommandLine, null, 4), { flag: "w", flush: true });
}

async function runPostSetupScripts() {
    // Run the first CSS build
    await spawnChildProcess("npm", ["run", "css:build"]);
    await spawnChildProcess("npm", ["run", "ui:build"]);
}

async function main() {
    await acceptUserInputs();

    // Create the destination folder
    fs.mkdirSync(applicationIdentifier, { recursive: true });
    // Copy the .vscode folder
    fs.mkdirSync(path.join(applicationIdentifier, ".vscode"), { recursive: true });
    fs.cpSync(path.join(rootFolder, ".vscode"), path.join(applicationIdentifier, ".vscode"), { recursive: true });

    // Change the directory
    process.chdir(applicationIdentifier);
    // Create the package.json
    await spawnChildProcess("npm", ["init", "-y"]);

    await setupGitIgnore();
    await setupNPMDependencies();
    await setupScripts();

    // Create the resources folder
    const { inputCSSPath, distFolderName, inputTSPath } = createResourcesFolders();
    // Create the input css
    fs.writeFileSync(inputCSSPath, [`@import "tailwindcss"`, `@plugin "daisyui"`].map(a => `${a};`).join("\n"), { flag: "w", flush: true });

    await createIndexHTML({ appName: applicationName, version });
    await createEntryTS({ inputTSPath });
    await createManifest({ appName: applicationName, version, appIdentifier: `${applicationIdentifier}.gix` });
    await createTestServer();

    await createBuildScripts({ inputCSSPath, distFolderName, inputTSPath });
    await fixTSConfig();
    await runPostSetupScripts();
    console.log("Your app is ready! What are you going to build next?");
}

main();