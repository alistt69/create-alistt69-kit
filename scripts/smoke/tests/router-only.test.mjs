import path from 'node:path';

import { assert, assertIncludes, assertNotIncludes } from '../lib/assert.mjs';
import { assertFileExists, readJson, readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'react-router only',
    { tags: ['react-router', 'features', 'readme'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('router-only-app');
        const { projectPath } = fixture;

        try {
            await generateProject(fixture, ['--features=react-router', '--defaults'], { verbose });

            const packageJson = await readJson(path.join(projectPath, 'package.json'));

            assert(packageJson.dependencies?.['react-router-dom'], 'react-router-dom should be installed');

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, '- React Router DOM', 'README should list router feature');
            assertNotIncludes(readme, '`npm run lint`', 'README should not contain eslint scripts');
            assertNotIncludes(readme, '`npm run lint:styles`', 'README should not contain stylelint scripts');

            await assertFileExists(
                path.join(projectPath, 'src', 'app', 'providers', 'router', 'model', 'router', 'index.tsx'),
            );
            await assertFileExists(path.join(projectPath, 'src', 'pages', 'main', 'page.tsx'));
            await assertFileExists(path.join(projectPath, 'src', 'pages', 'error', 'page.tsx'));
        } finally {
            await cleanupFixture(fixture);
        }
    },
);