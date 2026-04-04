import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const replaceTokensInFile = async (filePath, tokens) => {
    const fileContent = await readFile(filePath, 'utf8');

    let updatedContent = fileContent;

    for (const [token, value] of Object.entries(tokens)) {
        updatedContent = updatedContent.replaceAll(token, value);
    }

    await writeFile(filePath, updatedContent, 'utf8');
};

const replaceTokensRecursively = async (targetPath, tokens) => {
    const targetStat = await stat(targetPath);

    if (targetStat.isFile()) {
        await replaceTokensInFile(targetPath, tokens);
        return;
    }

    if (!targetStat.isDirectory()) {
        return;
    }

    const entries = await readdir(targetPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = resolve(targetPath, entry.name);

        if (entry.isDirectory()) {
            await replaceTokensRecursively(entryPath, tokens);
            continue;
        }

        if (entry.isFile()) {
            await replaceTokensInFile(entryPath, tokens);
        }
    }
};

export async function replaceTokens(targetDirPath, tokens) {
    await replaceTokensRecursively(targetDirPath, tokens);
}