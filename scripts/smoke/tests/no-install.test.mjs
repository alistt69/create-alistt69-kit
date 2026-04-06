import path from 'node:path';

import { assert, assertIncludes } from '../lib/assert.mjs';
import { assertFileExists, pathExists, readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    '--no-install',
    { tags: ['install', 'readme', 'flags'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('no-install-app');
        const { projectPath } = fixture;

        try {
            await generateProject(fixture, ['--features=all', '--no-install', '--defaults'], { verbose });

            await assertFileExists(path.join(projectPath, 'package.json'));

            const nodeModulesExists = await pathExists(path.join(projectPath, 'node_modules'));

            assert(!nodeModulesExists, 'node_modules should not exist when using --no-install');

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, 'Install dependencies first', 'README should mention install step when using --no-install');
            assertIncludes(readme, 'npm install', 'README should contain install command for npm when using --no-install');
            assertIncludes(readme, 'npm run start', 'README should contain start command for npm when using --no-install');
        } finally {
            await cleanupFixture(fixture);
        }
    },
);