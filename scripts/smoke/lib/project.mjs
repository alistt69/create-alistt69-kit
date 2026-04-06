import path from 'node:path';
import process from 'node:process';

import { cleanupPath, createTempWorkspace } from './fs.mjs';
import { runCli } from './process.mjs';

export async function createProjectFixture(projectName) {
    const workspacePath = await createTempWorkspace();
    const projectPath = path.join(workspacePath, projectName);

    return {
        workspacePath,
        projectName,
        projectPath,
    };
}

export async function generateProject(fixture, cliArgs, options = {}) {
    await runCli([fixture.projectName, ...cliArgs], {
        cwd: fixture.workspacePath,
        verbose: options.verbose,
        stdio: 'inherit',
    });

    return fixture;
}

export async function cleanupFixture(fixture, options = {}) {
    const shouldKeep = options.keep === true || process.env.SMOKE_KEEP_TEMP === '1';

    if (shouldKeep) {
        console.log(`Keeping temp workspace: ${fixture?.workspacePath}`);
        return;
    }

    await cleanupPath(fixture?.workspacePath);
}