import path from 'node:path';

import { assert, assertIncludes, assertNotIncludes } from '../lib/assert.mjs';
import { assertFileExists, readJson, readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'eslint only',
    { tags: ['eslint', 'features', 'readme'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('eslint-only-app');
        const { projectPath } = fixture;

        try {
            await generateProject(fixture, ['--features=eslint', '--defaults'], { verbose });

            const packageJson = await readJson(path.join(projectPath, 'package.json'));

            assert(packageJson.devDependencies?.eslint, 'eslint should be installed');
            assert(!packageJson.devDependencies?.stylelint, 'stylelint should not be installed');
            assert(!packageJson.devDependencies?.autoprefixer, 'autoprefixer should not be installed');
            assert(!packageJson.dependencies?.['react-router-dom'], 'react-router-dom should not be installed');

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, '- ESLint + Stylistic', 'README should list eslint feature');
            assertIncludes(readme, '`npm run lint`', 'README should contain eslint script');
            assertIncludes(readme, '`npm run lint:fix`', 'README should contain eslint autofix script');

            assertNotIncludes(readme, '`npm run lint:styles`', 'README should not contain stylelint scripts');
            assertNotIncludes(readme, '- Stylelint', 'README should not list stylelint feature');

            await assertFileExists(path.join(projectPath, 'eslint.config.mjs'));
        } finally {
            await cleanupFixture(fixture);
        }
    },
);