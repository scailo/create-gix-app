#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var ts = require("typescript");
var prompt = require("@inquirer/prompts");
var applicationIdentifier = "scailo-test-widget";
var applicationName = "Scailo Test Widget";
var version = "0.0.1";
var rootFolder = path.dirname(__dirname);
function acceptUserInputs() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prompt.input({
                        message: "Enter the Application Name: ",
                        default: applicationName,
                        required: true,
                        validate: function (input) { return input.length > 0; }
                    })];
                case 1:
                    applicationName = (_a.sent()).trim();
                    return [4 /*yield*/, prompt.input({
                            message: "Enter the Application Identifier: ",
                            default: applicationIdentifier,
                            required: true,
                            validate: function (input) { return input.length > 0; }
                        })];
                case 2:
                    applicationIdentifier = (_a.sent()).trim();
                    return [4 /*yield*/, prompt.input({
                            message: "Enter the Initial Version Number (Semver Format): ",
                            default: version,
                            required: true,
                            validate: function (input) { return input.length > 0; }
                        })];
                case 3:
                    version = (_a.sent()).trim();
                    console.log("Application Name: ".concat(applicationName));
                    console.log("Application Identifier: ".concat(applicationIdentifier));
                    console.log("Version: ".concat(version));
                    return [2 /*return*/];
            }
        });
    });
}
function spawnChildProcess(command, args, options) {
    if (args === void 0) { args = []; }
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var child = child_process.spawn(command, args, options);
        // Optional: Log stdout and stderr for debugging
        child.stdout.on('data', function (data) {
            console.log("".concat(data));
        });
        child.stderr.on('data', function (data) {
            console.error("stderr: ".concat(data));
        });
        child.on('close', function (code) {
            if (code === 0) {
                resolve("Child process exited with code ".concat(code));
            }
            else {
                reject(new Error("Child process exited with code ".concat(code)));
            }
        });
        child.on('error', function (err) {
            reject(err);
        });
    });
}
function setupGitIgnore() {
    return __awaiter(this, void 0, void 0, function () {
        var gitignoreList;
        return __generator(this, function (_a) {
            gitignoreList = [
                "node_modules/",
                ".env",
                "tsconfig.tsbuildinfo",
                ".DS_Store"
            ];
            fs.writeFileSync(".gitignore", gitignoreList.join("\n").trim(), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function setupNPMDependencies() {
    return __awaiter(this, void 0, void 0, function () {
        var npmDependencies, npmDevDependencies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    npmDependencies = [
                        "@kernelminds/scailo-sdk@latest",
                        "@bufbuild/protobuf@1.10.0",
                        "@connectrpc/connect-web@1.7.0"
                    ];
                    return [4 /*yield*/, spawnChildProcess("npm", __spreadArray(__spreadArray(["install"], npmDependencies, true), ["--save"], false))];
                case 1:
                    _a.sent();
                    npmDevDependencies = [
                        "tailwindcss",
                        "@tailwindcss/cli",
                        "daisyui@latest",
                        "typescript",
                        "@types/node",
                        "esbuild",
                        "@inquirer/prompts@7.8.6",
                        "@connectrpc/connect-node@1.7.0",
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
                    return [4 /*yield*/, spawnChildProcess("npm", __spreadArray(__spreadArray(["install"], npmDevDependencies, true), ["--save-dev"], false))];
                case 2:
                    _a.sent();
                    // Create the tsconfig.json
                    return [4 /*yield*/, spawnChildProcess("npx", ["tsc", "--init"])];
                case 3:
                    // Create the tsconfig.json
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setupScripts() {
    return __awaiter(this, void 0, void 0, function () {
        var scriptsFolderName, folders, _i, folders_1, folder;
        return __generator(this, function (_a) {
            scriptsFolderName = path.join("scripts");
            folders = [
                path.join(scriptsFolderName),
            ];
            for (_i = 0, folders_1 = folders; _i < folders_1.length; _i++) {
                folder = folders_1[_i];
                fs.mkdirSync(folder, { recursive: true });
            }
            // Copy package.ts
            fs.copyFileSync(path.join(rootFolder, "src", "package.ts"), path.join(scriptsFolderName, "package.ts"));
            return [2 /*return*/];
        });
    });
}
function createResourcesFolders() {
    var resourcesFolderName = path.join("resources");
    var distFolderName = path.join(resourcesFolderName, "dist");
    var srcFoldername = path.join(resourcesFolderName, "src");
    var resourcesFolders = [
        path.join(resourcesFolderName),
        path.join(distFolderName),
        path.join(distFolderName, "css"),
        path.join(distFolderName, "img"),
        path.join(distFolderName, "js"),
        path.join(srcFoldername),
        path.join(srcFoldername, "ts"),
        path.join(srcFoldername, "css")
    ];
    for (var _i = 0, resourcesFolders_1 = resourcesFolders; _i < resourcesFolders_1.length; _i++) {
        var folder = resourcesFolders_1[_i];
        fs.mkdirSync(folder, { recursive: true });
    }
    var inputCSSPath = path.join(srcFoldername, "css", "app.css");
    var inputTSPath = path.join(srcFoldername, "ts", "app.ts");
    // Copy the img folder
    fs.cpSync(path.join(rootFolder, "img"), path.join(distFolderName, "img"), { recursive: true });
    return {
        inputCSSPath: inputCSSPath,
        distFolderName: distFolderName,
        inputTSPath: inputTSPath
    };
}
function createBuildScripts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var packageJSON, packageJSONScripts, scripts, i, script;
        var inputCSSPath = _b.inputCSSPath, distFolderName = _b.distFolderName, inputTSPath = _b.inputTSPath;
        return __generator(this, function (_c) {
            packageJSON = JSON.parse(fs.readFileSync("package.json", "utf-8"));
            packageJSONScripts = packageJSON.scripts || {};
            scripts = [
                ["css:build", "npx tailwindcss -i ".concat(inputCSSPath, " -o ").concat(path.join(distFolderName, "css", "bundle.css"), " --minify")],
                ["css:watch", "npx tailwindcss -i ".concat(inputCSSPath, " -o ").concat(path.join(distFolderName, "css", "bundle.css"), " --watch")],
                ["ui:build", "npx esbuild ".concat(inputTSPath, " --bundle --outfile=").concat(path.join(distFolderName, "js", "bundle.src.min.js"), " --minify")],
                ["ui:watch", "npx esbuild ".concat(inputTSPath, " --bundle --outfile=").concat(path.join(distFolderName, "js", "bundle.src.min.js"), " --watch")],
                ["dev:serve", "npx tsx -r dotenv/config server.ts"],
                ["package", "npx tsx scripts/package.ts"],
            ];
            for (i = 0; i < scripts.length; i++) {
                script = scripts[i];
                packageJSONScripts[script[0]] = script[1];
            }
            packageJSON.scripts = packageJSONScripts;
            packageJSON.version = version;
            fs.writeFileSync("package.json", JSON.stringify(packageJSON, null, 2), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function createIndexHTML(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var html;
        var appName = _b.appName, version = _b.version;
        return __generator(this, function (_c) {
            html = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"shortcut icon\" href=\"./resources/dist/img/favicon.ico\" type=\"image/x-icon\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\n    <link rel=\"preload\" as=\"script\" href=\"./resources/dist/js/bundle.src.min.js\">\n    <link rel=\"stylesheet\" href=\"./resources/dist/css/bundle.css\">\n    <title>".concat(appName, "</title>\n</head>\n<body class=\"text-gray-800\">\n    <!-- Attach the JS bundle here -->\n    <script src=\"./resources/dist/js/bundle.src.min.js\"></script>\n</body>\n</html>");
            // Create index.html
            fs.writeFileSync("index.html", html.trim(), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function createEntryTS(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var script;
        var inputTSPath = _b.inputTSPath;
        return __generator(this, function (_c) {
            script = "\nimport { createConnectTransport } from \"@connectrpc/connect-web\";\n\nwindow.addEventListener(\"load\", async (evt) => {\n    evt.preventDefault();\n    console.log(\"Scailo Widget!\")\n});\n\nexport function getReadTransport() {\n    return createConnectTransport({\n        // Need to use binary format (at least for the time being)\n        baseUrl: location.origin, useBinaryFormat: false, interceptors: []\n    });\n}\n\n";
            // Create index.ts
            fs.writeFileSync(inputTSPath, script.trim(), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function createManifest(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var manifest;
        var appName = _b.appName, version = _b.version, appIdentifier = _b.appIdentifier;
        return __generator(this, function (_c) {
            manifest = "\nmanifest_version: 1\napp_version: \"".concat(version, "\"\napp_name: \"").concat(appName, "\"\napp_unique_identifier: \"").concat(appIdentifier, "\"\nmin_genesis_version: \"*\"\nmax_genesis_version: \"*\"\nresources:\n    html_entry: \"index.html\"\n    logos:\n        - \"resources/dist/img/logo.png\"\n    external_apis: []");
            // Create MANIFEST.yaml
            fs.writeFileSync("MANIFEST.yaml", manifest.trim(), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function createTestServer() {
    return __awaiter(this, void 0, void 0, function () {
        var envFile;
        return __generator(this, function (_a) {
            fs.copyFileSync(path.join(rootFolder, "server", "server.ts"), "server.ts");
            envFile = "\nupstreamAPI=http://127.0.0.1:21000\nport=9090\nusername=\npassword=";
            fs.writeFileSync(".env", envFile.trim(), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function stripJSONComments(jsonString) {
    // Remove multi-line comments
    jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove single-line comments
    jsonString = jsonString.replace(/\/\/.*$/gm, '');
    return jsonString;
}
function fixTSConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var configFileName, configFileText, _a, config, error, parsedCommandLine;
        return __generator(this, function (_b) {
            configFileName = ts.findConfigFile("tsconfig.json", ts.sys.fileExists);
            if (!configFileName) {
                throw new Error("Could not find a valid tsconfig.json");
            }
            configFileText = ts.sys.readFile(configFileName);
            if (!configFileText) {
                throw new Error("Could not read file ".concat(configFileName));
            }
            _a = ts.parseConfigFileTextToJson(configFileName, configFileText), config = _a.config, error = _a.error;
            if (error) {
                throw new Error("Error parsing tsconfig.json: ".concat(error.messageText));
            }
            parsedCommandLine = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configFileName));
            parsedCommandLine.options.verbatimModuleSyntax = false;
            parsedCommandLine.options.sourceMap = false;
            parsedCommandLine.options.declaration = false;
            parsedCommandLine.options.declarationMap = false;
            fs.writeFileSync("tsconfig.json", JSON.stringify(parsedCommandLine, null, 4), { flag: "w", flush: true });
            return [2 /*return*/];
        });
    });
}
function runPostSetupScripts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Run the first CSS build
                return [4 /*yield*/, spawnChildProcess("npm", ["run", "css:build"])];
                case 1:
                    // Run the first CSS build
                    _a.sent();
                    return [4 /*yield*/, spawnChildProcess("npm", ["run", "ui:build"])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, inputCSSPath, distFolderName, inputTSPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, acceptUserInputs()];
                case 1:
                    _b.sent();
                    // Create the destination folder
                    fs.mkdirSync(applicationIdentifier, { recursive: true });
                    // Copy the .vscode folder
                    fs.mkdirSync(path.join(applicationIdentifier, ".vscode"), { recursive: true });
                    fs.cpSync(path.join(rootFolder, ".vscode"), path.join(applicationIdentifier, ".vscode"), { recursive: true });
                    fs.copyFileSync(path.join(rootFolder, "README.md"), path.join(applicationIdentifier, "README.md"));
                    // Change the directory
                    process.chdir(applicationIdentifier);
                    // Create the package.json
                    return [4 /*yield*/, spawnChildProcess("npm", ["init", "-y"])];
                case 2:
                    // Create the package.json
                    _b.sent();
                    return [4 /*yield*/, setupGitIgnore()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, setupNPMDependencies()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, setupScripts()];
                case 5:
                    _b.sent();
                    _a = createResourcesFolders(), inputCSSPath = _a.inputCSSPath, distFolderName = _a.distFolderName, inputTSPath = _a.inputTSPath;
                    // Create the input css
                    fs.writeFileSync(inputCSSPath, ["@import \"tailwindcss\"", "@plugin \"daisyui\""].map(function (a) { return "".concat(a, ";"); }).join("\n"), { flag: "w", flush: true });
                    return [4 /*yield*/, createIndexHTML({ appName: applicationName, version: version })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, createEntryTS({ inputTSPath: inputTSPath })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, createManifest({ appName: applicationName, version: version, appIdentifier: "".concat(applicationIdentifier, ".gix") })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, createTestServer()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, createBuildScripts({ inputCSSPath: inputCSSPath, distFolderName: distFolderName, inputTSPath: inputTSPath })];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, fixTSConfig()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, runPostSetupScripts()];
                case 12:
                    _b.sent();
                    console.log("Your app is ready! What are you going to build next?");
                    return [2 /*return*/];
            }
        });
    });
}
main();
