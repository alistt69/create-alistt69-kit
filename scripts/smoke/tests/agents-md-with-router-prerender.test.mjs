import path from 'node:path';

import { assertIncludes } from '../lib/assert.mjs';
import { readText } from '../lib/fs.mjs';
import { cleanupFixture, createProjectFixture, generateProject } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'agents-md with router and prerender gets appended sections',
    { tags: ['agents-md', 'react-router', 'prerender'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('agents-md-router-prerender-app');
        const { projectPath } = fixture;

        try {
            await generateProject(
                fixture,
                ['--features=agents-md,react-router,prerender', '--defaults'],
                { verbose },
            );

            const agents = await readText(path.join(projectPath, 'AGENTS.md'));

            assertIncludes(agents, '## React Router', 'AGENTS.md should contain router section');
            assertIncludes(agents, '## Prerender', 'AGENTS.md should contain prerender section');
            assertIncludes(agents, 'npm run generate:page -- <page-name>', 'AGENTS.md should mention page generator');
            assertIncludes(agents, 'npm run build:assets', 'AGENTS.md should mention build:assets');
            assertIncludes(agents, 'npm run prerender', 'AGENTS.md should mention prerender');
        } finally {
            await cleanupFixture(fixture);
        }
    },
);