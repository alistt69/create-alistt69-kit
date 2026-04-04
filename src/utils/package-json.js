import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function readPackageJson(projectPath) {
    const packageJsonPath = resolve(projectPath, 'package.json');
    const content = await readFile(packageJsonPath, 'utf8');

    return JSON.parse(content);
}

export async function writePackageJson(projectPath, packageJson) {
    const packageJsonPath = resolve(projectPath, 'package.json');

    await writeFile(
        packageJsonPath,
        `${JSON.stringify(packageJson, null, 4)}\n`,
        'utf8',
    );
}

export async function addDependencies(projectPath, dependenciesToAdd) {
    const packageJson = await readPackageJson(projectPath);

    packageJson.dependencies ??= {};

    for (const [dependencyName, dependencyVersion] of Object.entries(dependenciesToAdd)) {
        packageJson.dependencies[dependencyName] = dependencyVersion;
    }

    packageJson.dependencies = Object.fromEntries(
        Object.entries(packageJson.dependencies).sort(([leftName], [rightName]) => (
            leftName.localeCompare(rightName)
        )),
    );

    await writePackageJson(projectPath, packageJson);
}

export async function addDevDependencies(projectPath, dependenciesToAdd) {
    const packageJson = await readPackageJson(projectPath);

    packageJson.devDependencies ??= {};

    for (const [dependencyName, dependencyVersion] of Object.entries(dependenciesToAdd)) {
        packageJson.devDependencies[dependencyName] = dependencyVersion;
    }

    packageJson.devDependencies = Object.fromEntries(
        Object.entries(packageJson.devDependencies).sort(([leftName], [rightName]) => (
            leftName.localeCompare(rightName)
        )),
    );

    await writePackageJson(projectPath, packageJson);
}

export async function addScripts(projectPath, scriptsToAdd) {
    const packageJson = await readPackageJson(projectPath);

    packageJson.scripts ??= {};

    for (const [scriptName, scriptValue] of Object.entries(scriptsToAdd)) {
        packageJson.scripts[scriptName] = scriptValue;
    }

    packageJson.scripts = Object.fromEntries(
        Object.entries(packageJson.scripts).sort(([leftName], [rightName]) => (
            leftName.localeCompare(rightName)
        )),
    );

    await writePackageJson(projectPath, packageJson);
}