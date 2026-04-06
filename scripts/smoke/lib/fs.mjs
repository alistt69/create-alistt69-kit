import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export async function pathExists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

export async function readJson(filePath) {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
}

export async function readText(filePath) {
    return readFile(filePath, 'utf8');
}

export async function assertFileExists(targetPath) {
    const exists = await pathExists(targetPath);

    if (!exists) {
        throw new Error(`Expected file to exist: ${targetPath}`);
    }
}

export async function createTempWorkspace(prefix = 'alistt69-kit-smoke-') {
    return mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function cleanupPath(targetPath) {
    if (!targetPath) {
        return;
    }

    await rm(targetPath, { recursive: true, force: true });
}