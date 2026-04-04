import { access, rename } from 'node:fs/promises';
import { resolve } from 'node:path';

async function renameIfExists(fromPath, toPath) {
    try {
        await access(fromPath);
    } catch {
        return;
    }

    await rename(fromPath, toPath);
}

export async function restoreSpecialFiles(projectPath) {
    await renameIfExists(
        resolve(projectPath, 'gitignore'),
        resolve(projectPath, '.gitignore'),
    );
}