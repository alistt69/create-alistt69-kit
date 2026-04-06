import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);

export const rootDir = path.resolve(path.dirname(currentFilePath), '..', '..', '..');
export const cliEntryPath = path.resolve(rootDir, 'bin', 'index.js');

export async function runCommand(command, args, options = {}) {
    return new Promise((resolvePromise, rejectPromise) => {
        const child = spawn(command, args, {
            cwd: options.cwd ?? rootDir,
            env: {
                ...process.env,
                ...options.env,
            },
            stdio: options.stdio ?? 'pipe',
            shell: process.platform === 'win32',
        });

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (chunk) => {
            const text = String(chunk);
            stdout += text;

            if (options.verbose) {
                process.stdout.write(text);
            }
        });

        child.stderr?.on('data', (chunk) => {
            const text = String(chunk);
            stderr += text;

            if (options.verbose) {
                process.stderr.write(text);
            }
        });

        child.on('error', (error) => {
            rejectPromise(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolvePromise({ code, stdout, stderr });
                return;
            }

            const error = new Error(
                options.errorMessage
                ?? `Command failed: ${command} ${args.join(' ')}`,
            );

            error.code = code;
            error.command = command;
            error.args = args;
            error.stdout = stdout;
            error.stderr = stderr;

            rejectPromise(error);
        });
    });
}

export function runCli(args, options = {}) {
    return runCommand('node', [cliEntryPath, ...args], options);
}

export function runNpmBuild(projectPath, options = {}) {
    return runCommand('npm', ['run', 'build'], {
        cwd: projectPath,
        ...options,
    });
}