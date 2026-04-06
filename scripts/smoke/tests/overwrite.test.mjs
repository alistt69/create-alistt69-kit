import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

import { assert } from '../lib/assert.mjs';
import { assertFileExists, pathExists } from '../lib/fs.mjs';
import { createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { runCli } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'existing dir + --defaults --overwrite => overwrite',
    { tags: ['overwrite', 'flags'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('overwrite-app');
        const { workspacePath, projectName, projectPath } = fixture;

        try {
            await mkdir(projectPath, { recursive: true });
            await writeFile(path.join(projectPath, 'old.txt'), 'old data', 'utf8');

            await runCli([projectName, '--defaults', '--overwrite', '--no-install'], {
                cwd: workspacePath,
                verbose,
            });

            const oldFileExists = await pathExists(path.join(projectPath, 'old.txt'));

            assert(!oldFileExists, 'old file should be removed after --overwrite');
            await assertFileExists(path.join(projectPath, 'package.json'));
        } finally {
            await cleanupFixture(fixture);
        }
    },
);