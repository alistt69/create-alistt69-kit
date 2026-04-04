import { confirm, isCancel } from '@clack/prompts';
import { access, readdir, rm } from 'node:fs/promises';
import process from 'node:process';
import { resolve } from 'node:path';

async function pathExists(targetDirPath) {
    try {
        await access(targetDirPath);
        return true;
    } catch {
        return false;
    }
}

export async function prepareTargetDirectory({
    projectName,
    overwrite = false,
    yes = false,
}) {
    const targetDirPath = resolve(process.cwd(), projectName);
    const exists = await pathExists(targetDirPath);

    if (!exists) {
        return {
            targetDirPath,
            wasOverwritten: false,
        };
    }

    const directoryEntries = await readdir(targetDirPath);
    const isEmpty = directoryEntries.length === 0;

    if (isEmpty) {
        return {
            targetDirPath,
            wasOverwritten: false,
        };
    }

    if (overwrite) {
        await rm(targetDirPath, { recursive: true, overwrite: true });

        return {
            targetDirPath,
            wasOverwritten: true,
        };
    }

    if (yes) {
        throw new Error(
            `Directory already exists and is not empty: ${targetDirPath}. Use --overwrite to overwrite it.`,
        );
    }

    const overwriteAnswer = await confirm({
        message: `Directory "${projectName}" already exists and will be overwritten. Continue?`,
        initialValue: false,
    });

    if (isCancel(overwriteAnswer) || !overwriteAnswer) {
        process.exit(0);
    }

    await rm(targetDirPath, { recursive: true, overwrite: true });

    return {
        targetDirPath,
        wasOverwritten: true,
    };
}