import path from 'node:path';

import { assertIncludes } from '../lib/assert.mjs';
import { assertFileExists, readText } from '../lib/fs.mjs';
import { cleanupFixture, createProjectFixture, generateProject } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'agents-md only',
    { tags: ['agents-md', 'features'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('agents-md-only-app');
        const { projectPath } = fixture;

        try {
            await generateProject(fixture, ['--features=agents-md', '--defaults'], { verbose });

            await assertFileExists(path.join(projectPath, 'AGENTS.md'));

            const agents = await readText(path.join(projectPath, 'AGENTS.md'));

            assertIncludes(agents, '# AGENTS.md', 'AGENTS.md should exist');
            assertIncludes(agents, '<!-- @agents-sections -->', 'AGENTS.md should contain sections marker');
        } finally {
            await cleanupFixture(fixture);
        }
    },
);