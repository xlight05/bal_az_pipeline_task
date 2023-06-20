import tl = require('azure-pipelines-task-lib/task');
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import taskutils = require('./taskutils');
import * as os from 'os';

const osPlat: string = os.platform();

//TODO - Add caching
//TODO - Add tests

async function run() {
    try {
        const version: string = tl.getInputRequired('version');
        console.log(version);
        
        let downloadUrl: string;
        
        downloadUrl = `https://dist.ballerina.io/downloads/${version}/ballerina-${version}-swan-lake-`;
        toolLib.findLocalTool
        if (osPlat == 'darwin') {
            downloadUrl = downloadUrl + "macos-x64.pkg";
            let downloadPath: string = await downloadTool(downloadUrl, "ballerina.pkg", version);
            await runPkgInstaller(downloadPath);
            toolLib.prependPath("/Library/Ballerina/bin");
        } else if (osPlat == 'linux') {
            downloadUrl = downloadUrl + "linux-x64.deb";
            let downloadPath: string = await downloadTool(downloadUrl, "ballerina.deb", version);
            await runDebInstaller(downloadPath);
            toolLib.prependPath("/usr/lib/ballerina/bin");
        } else if (osPlat == 'win32') {
            downloadUrl = downloadUrl + "windows-x64.msi";
            let downloadPath: string = await downloadTool(downloadUrl, "ballerina.msi", version);
            await runMsiInstaller(downloadPath);
            toolLib.prependPath("C:\\Program Files\\Ballerina\\bin");
        } else {
            throw new Error(tl.loc('UnexpectedOS', osPlat));
        }
    }
    catch (err : any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

async function downloadTool(url: string, fileName: string, version: string): Promise<string> {
    try {
        return await toolLib.downloadTool(url, fileName);
    } catch (err: any) {
        throw new Error(tl.loc('BallerinaVersionNotFound', version, osPlat));
    }
}


/**
 * Install a .pkg file.
 * Only for macOS.
 * Returns promise with return code.
 * @param pkgPath Path to a .pkg file.
 * @returns number
 */
async function runPkgInstaller(pkgPath: string): Promise<number> {
    const installer = taskutils.sudo('installer');
    installer.line(`-package "${pkgPath}" -target /`);
    return installer.exec();
}

/**
 * Install a dpkg file.
 * Only for Debian based OS.
 * Returns promise with return code.
 * @param debPath Path to a .deb file.
 * @returns number
 */
async function runDebInstaller(debPath: string): Promise<number> {
    const installer = taskutils.sudo('dpkg');
    installer.line(`-i "${debPath}"`);
    return installer.exec();
}

/**
 * Install a msi file.
 * Only for windows based OS.
 * Returns promise with return code.
 * @param msiPath Path to a .msi file.
 * @returns number
 */
async function runMsiInstaller(msiPath: string): Promise<number> {
    return tl.tool('msiexec').arg(['/i', msiPath, "/quiet", "/qr", "/L*V", "C:\\Temp\\msilog.log"]).exec();
}