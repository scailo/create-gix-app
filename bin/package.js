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
Object.defineProperty(exports, "__esModule", { value: true });
var child_process = require("child_process");
var path = require("path");
var prompt = require("@inquirer/prompts");
var YAML = require("yaml");
var fs = require("fs");
var semver = require("semver");
var AdmZip = require("adm-zip");
function loadManifest() {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            file = fs.readFileSync('MANIFEST.yaml', 'utf8');
            return [2 /*return*/, YAML.parse(file)];
        });
    });
}
function acceptUserInputs(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var nextVersion, userEnteredVersion;
        var existingVersion = _b.existingVersion;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nextVersion = semver.inc(existingVersion, "patch") || "0.0.1";
                    return [4 /*yield*/, prompt.input({
                            message: "Current version: " + existingVersion + ". Enter the Next Version (Semver Format): ",
                            default: nextVersion,
                            required: true,
                            validate: function (input) { return input.length > 0; }
                        })];
                case 1:
                    userEnteredVersion = (_c.sent()).trim();
                    if (!semver.valid(userEnteredVersion)) {
                        console.log("Invalid semver: " + userEnteredVersion);
                        process.exit(1);
                    }
                    if (semver.compare(userEnteredVersion, existingVersion) <= 0) {
                        console.log("Version should be greater than ".concat(existingVersion));
                        process.exit(1);
                    }
                    else {
                    }
                    return [2 /*return*/, userEnteredVersion];
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
        // child.stderr.on('data', (data) => {
        //     console.error(`stderr: ${data}`);
        // });
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var manifest, userEnteredVersion, entryHTML, zip, outputName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadManifest()];
                case 1:
                    manifest = _a.sent();
                    return [4 /*yield*/, acceptUserInputs({ existingVersion: manifest["app_version"] })];
                case 2:
                    userEnteredVersion = _a.sent();
                    manifest["app_version"] = userEnteredVersion;
                    fs.writeFileSync('MANIFEST.yaml', YAML.stringify(manifest, { indent: 4 }));
                    return [4 /*yield*/, spawnChildProcess("npm", ["run", "css:build"])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, spawnChildProcess("npm", ["run", "ui:build"])];
                case 4:
                    _a.sent();
                    fs.mkdirSync(path.join("artifacts", "resources"), { recursive: true });
                    fs.copyFileSync("MANIFEST.yaml", path.join("artifacts", "MANIFEST.yaml"));
                    entryHTML = manifest["resources"]["html_entry"];
                    fs.copyFileSync(entryHTML, path.join("artifacts", entryHTML));
                    fs.cpSync(path.join("resources", "dist"), path.join("artifacts", "resources", "dist"), { recursive: true });
                    process.chdir("artifacts");
                    zip = new AdmZip();
                    zip.addLocalFolder(process.cwd());
                    process.chdir("..");
                    outputName = "".concat(manifest["app_name"], ".gix");
                    zip.writeZip(outputName);
                    fs.rmSync(path.join("artifacts"), { recursive: true });
                    console.log("Successfully package: ".concat(outputName, " (").concat(userEnteredVersion, ")"));
                    return [2 /*return*/];
            }
        });
    });
}
main();
