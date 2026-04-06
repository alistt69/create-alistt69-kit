import path from 'node:path';

import { assertIncludes, assertNotIncludes } from '../lib/assert.mjs';
import { readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'README uses selected package manager commands',
    { tags: ['readme', 'package-manager'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('pm-readme-app');
        const { projectPath } = fixture;

        try {
            await generateProject(
                fixture,
                ['--features=eslint,stylelint', '--pm=pnpm', '--no-install', '--defaults'],
                { verbose },
            );

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, '`pnpm start`', 'README should use pnpm for start');
            assertIncludes(readme, '`pnpm build`', 'README should use pnpm for build');
            assertIncludes(readme, '`pnpm lint`', 'README should use pnpm for eslint');
            assertIncludes(readme, '`pnpm lint:styles`', 'README should use pnpm for stylelint');

            assertIncludes(readme, 'Install dependencies first', 'README should mention install step when dependencies are skipped');
            assertIncludes(readme, 'pnpm install', 'README should contain pnpm install command');

            assertNotIncludes(readme, 'npm run lint', 'README should not use npm commands when pnpm is selected');
        } finally {
            await cleanupFixture(fixture);
        }
    },
);