import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

import { assert, assertIncludes } from '../lib/assert.mjs';
import { createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { runCli } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'existing dir + --defaults => fail',
    { tags: ['overwrite', 'errors', 'flags'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('existing-dir-app');
        const { workspacePath, projectName, projectPath } = fixture;

        try {
            await mkdir(projectPath, { recursive: true });
            await writeFile(path.join(projectPath, 'keep.txt'), 'hello', 'utf8');

            let capturedError = null;

            try {
                await runCli([projectName, '--defaults'], {
                    cwd: workspacePath,
                    verbose,
                });
            } catch (error) {
                capturedError = error;
            }

            assert(capturedError, 'command should fail without --overwrite for non-empty existing dir');

            const combinedOutput = [
                capturedError.message ?? '',
                capturedError.stdout ?? '',
                capturedError.stderr ?? '',
            ].join('\n');

            assertIncludes(
                combinedOutput,
                'Use --overwrite to overwrite it',
                'error should mention --overwrite',
            );
        } finally {
            await cleanupFixture(fixture);
        }
    },
);