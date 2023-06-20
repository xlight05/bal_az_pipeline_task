"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const toolLib = __importStar(require("azure-pipelines-tool-lib/tool"));
const taskutils = require("./taskutils");
const os = __importStar(require("os"));
const osPlat = os.platform();
//TODO - Add caching
//TODO - Add tests
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const version = tl.getInputRequired('version');
            console.log(version);
            let downloadUrl;
            downloadUrl = `https://dist.ballerina.io/downloads/${version}/ballerina-${version}-swan-lake-`;
            toolLib.findLocalTool;
            if (osPlat == 'darwin') {
                downloadUrl = downloadUrl + "macos-x64.pkg";
                let downloadPath = yield downloadTool(downloadUrl, "ballerina.pkg", version);
                yield runPkgInstaller(downloadPath);
                toolLib.prependPath("/Library/Ballerina/bin");
            }
            else if (osPlat == 'linux') {
                downloadUrl = downloadUrl + "linux-x64.deb";
                let downloadPath = yield downloadTool(downloadUrl, "ballerina.deb", version);
                yield runDebInstaller(downloadPath);
                toolLib.prependPath("/usr/lib/ballerina/bin");
            }
            else if (osPlat == 'win32') {
                downloadUrl = downloadUrl + "windows-x64.msi";
                let downloadPath = yield downloadTool(downloadUrl, "ballerina.msi", version);
                yield runMsiInstaller(downloadPath);
                toolLib.prependPath("C:\\Program Files\\Ballerina\\bin");
            }
            else {
                throw new Error(tl.loc('UnexpectedOS', osPlat));
            }
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
function downloadTool(url, fileName, version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield toolLib.downloadTool(url, fileName);
        }
        catch (err) {
            throw new Error(tl.loc('BallerinaVersionNotFound', version, osPlat));
        }
    });
}
/**
 * Install a .pkg file.
 * Only for macOS.
 * Returns promise with return code.
 * @param pkgPath Path to a .pkg file.
 * @returns number
 */
function runPkgInstaller(pkgPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const installer = taskutils.sudo('installer');
        installer.line(`-package "${pkgPath}" -target /`);
        return installer.exec();
    });
}
/**
 * Install a dpkg file.
 * Only for Debian based OS.
 * Returns promise with return code.
 * @param debPath Path to a .deb file.
 * @returns number
 */
function runDebInstaller(debPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const installer = taskutils.sudo('dpkg');
        installer.line(`-i "${debPath}"`);
        return installer.exec();
    });
}
function runMsiInstaller(msiPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return tl.tool('msiexec').arg(['/i', msiPath, "/quiet", "/qr", "/L*V", "C:\\Temp\\msilog.log"]).exec();
    });
}
