import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function sortRecordEntries(record) {
    if (!record) {
        return record;
    }

    return Object.fromEntries(
        Object.entries(record).sort(([leftName], [rightName]) => (
            leftName.localeCompare(rightName)
        )),
    );
}

function mergeRecordEntries(currentRecord, entriesToAdd) {
    if (!entriesToAdd || Object.keys(entriesToAdd).length === 0) {
        return currentRecord;
    }

    return sortRecordEntries({
        ...(currentRecord ?? {}),
        ...entriesToAdd,
    });
}

function normalizePackageJson(packageJson) {
    packageJson.dependencies = sortRecordEntries(packageJson.dependencies);
    packageJson.devDependencies = sortRecordEntries(packageJson.devDependencies);
    packageJson.scripts = sortRecordEntries(packageJson.scripts);

    return packageJson;
}

export async function readPackageJson(projectPath) {
    const packageJsonPath = resolve(projectPath, 'package.json');
    const content = await readFile(packageJsonPath, 'utf8');

    return JSON.parse(content);
}

export async function writePackageJson(projectPath, packageJson) {
    const packageJsonPath = resolve(projectPath, 'package.json');

    await writeFile(
        packageJsonPath,
        `${JSON.stringify(normalizePackageJson(packageJson), null, 4)}\n`,
        'utf8',
    );
}

export async function updatePackageJson(projectPath, updater) {
    const packageJson = await readPackageJson(projectPath);

    await updater(packageJson);

    await writePackageJson(projectPath, packageJson);

    return packageJson;
}

export async function patchPackageJson(projectPath, patch) {
    return updatePackageJson(projectPath, (packageJson) => {
        packageJson.dependencies = mergeRecordEntries(
            packageJson.dependencies,
            patch.dependencies,
        );

        packageJson.devDependencies = mergeRecordEntries(
            packageJson.devDependencies,
            patch.devDependencies,
        );

        packageJson.scripts = mergeRecordEntries(
            packageJson.scripts,
            patch.scripts,
        );
    });
}

export async function addDependencies(projectPath, dependenciesToAdd) {
    return patchPackageJson(projectPath, {
        dependencies: dependenciesToAdd,
    });
}

export async function addDevDependencies(projectPath, dependenciesToAdd) {
    return patchPackageJson(projectPath, {
        devDependencies: dependenciesToAdd,
    });
}

export async function addScripts(projectPath, scriptsToAdd) {
    return patchPackageJson(projectPath, {
        scripts: scriptsToAdd,
    });
}