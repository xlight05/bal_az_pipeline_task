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
exports.detach = exports.attach = exports.sudo = exports.sleepFor = void 0;
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const os = __importStar(require("os"));
/**
 * Returns promise which will be resolved in given number of milliseconds.
 * @param sleepDurationInMilliSeconds Number of milliseconds.
 * @returns Promise<any>
 */
function sleepFor(sleepDurationInMilliSeconds) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sleepDurationInMilliSeconds);
    });
}
exports.sleepFor = sleepFor;
/**
 * Run a tool with `sudo` on Linux and macOS.
 * Precondition: `toolName` executable is in PATH.
 * @returns ToolRunner
 */
function sudo(toolName) {
    if (os.platform() === 'win32') {
        return tl.tool(toolName);
    }
    else {
        const toolPath = tl.which(toolName);
        return tl.tool('sudo').line(toolPath);
    }
}
exports.sudo = sudo;
/**
 * Attach a disk image.
 * Only for macOS.
 * Returns promise with return code.
 * @param sourceFile Path to a disk image file.
 * @returns number
 */
function attach(sourceFile) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(tl.loc('AttachDiskImage'));
        const hdiutil = sudo('hdiutil');
        hdiutil.line(`attach "${sourceFile}"`);
        return hdiutil.exec();
    });
}
exports.attach = attach;
/**
 * Detach a disk image.
 * Only for macOS.
 * Returns promise with return code.
 * @param volumePath Path to the attached disk image.
 * @returns number
 */
function detach(volumePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(tl.loc('DetachDiskImage'));
        const hdiutil = sudo('hdiutil');
        hdiutil.line(`detach "${volumePath}"`);
        return hdiutil.exec();
    });
}
exports.detach = detach;
