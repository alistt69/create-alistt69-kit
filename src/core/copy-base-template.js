import { cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export async function copyBaseTemplate(targetDirPath) {
    const templateDirPath = resolve(currentDirPath, '../templates/base');

    await cp(templateDirPath, targetDirPath, { recursive: true });
}