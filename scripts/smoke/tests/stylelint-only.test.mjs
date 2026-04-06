import path from 'node:path';

import { assert, assertIncludes, assertNotIncludes } from '../lib/assert.mjs';
import { assertFileExists, readJson, readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'stylelint only',
    { tags: ['stylelint', 'features', 'readme'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('stylelint-only-app');
        const { projectPath } = fixture;

        try {
            await generateProject(fixture, ['--features=stylelint', '--defaults'], { verbose });

            const packageJson = await readJson(path.join(projectPath, 'package.json'));

            assert(packageJson.devDependencies?.stylelint, 'stylelint should be installed');
            assert(!packageJson.devDependencies?.eslint, 'eslint should not be installed');

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, '- Stylelint', 'README should list stylelint feature');
            assertIncludes(readme, '`npm run lint:styles`', 'README should contain stylelint script');
            assertIncludes(readme, '`npm run lint:styles:fix`', 'README should contain stylelint autofix script');

            assertNotIncludes(readme, '`npm run lint`', 'README should not contain eslint scripts');
            assertNotIncludes(readme, '- ESLint + Stylistic', 'README should not list eslint feature');

            await assertFileExists(path.join(projectPath, 'stylelint.config.mjs'));
        } finally {
            await cleanupFixture(fixture);
        }
    },
);