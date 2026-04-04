import { spawn } from 'node:child_process';
import process from 'node:process';
import { getInstallCommand } from '../utils/package-manager.js';

export function installDependencies(targetDirPath, packageManager) {
    const { command, args } = getInstallCommand(packageManager);

    return new Promise((resolvePromise, rejectPromise) => {
        const childProcess = spawn(command, args, {
            cwd: targetDirPath,
            stdio: 'inherit',
            shell: process.platform === 'win32',
        });

        childProcess.on('error', (error) => {
            rejectPromise(error);
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                resolvePromise();
                return;
            }

            rejectPromise(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`.trim()));
        });
    });
}