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
var destinationPackage = "scailo-test-widget";
var rootFolder = process.cwd();
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
            fs.writeFileSync(".gitignore", gitignoreList.join("\n"), { flag: "w", flush: true });
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
            ];
            for (i = 0; i < scripts.length; i++) {
                script = scripts[i];
                packageJSONScripts[script[0]] = script[1];
            }
            packageJSON.scripts = packageJSONScripts;
            fs.writeFileSync("package.json", JSON.stringify(packageJSON, null, 2), { flag: "w", flush: true });
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
                case 0:
                    // Create the destination folder
                    fs.mkdirSync(destinationPackage, { recursive: true });
                    // Copy the .vscode folder
                    fs.cpSync(path.join(".vscode"), path.join(destinationPackage, ".vscode"), { recursive: true });
                    // Change the directory
                    process.chdir(destinationPackage);
                    // Create the package.json
                    return [4 /*yield*/, spawnChildProcess("npm", ["init", "-y"])];
                case 1:
                    // Create the package.json
                    _b.sent();
                    return [4 /*yield*/, setupGitIgnore()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, setupNPMDependencies()];
                case 3:
                    _b.sent();
                    _a = createResourcesFolders(), inputCSSPath = _a.inputCSSPath, distFolderName = _a.distFolderName, inputTSPath = _a.inputTSPath;
                    // Create the input css
                    fs.writeFileSync(inputCSSPath, ["@import \"tailwindcss\"", "@plugin \"daisyui\""].map(function (a) { return "".concat(a, ";"); }).join("\n"), { flag: "w", flush: true });
                    // Create the index.ts
                    fs.writeFileSync(inputTSPath, "console.log(\"Scailo Widget!\")", { flag: "w", flush: true });
                    return [4 /*yield*/, createBuildScripts({ inputCSSPath: inputCSSPath, distFolderName: distFolderName, inputTSPath: inputTSPath })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, runPostSetupScripts()];
                case 5:
                    _b.sent();
                    console.log("Hello there! We are live! This is from TypeScript");
                    return [2 /*return*/];
            }
        });
    });
}
main();
