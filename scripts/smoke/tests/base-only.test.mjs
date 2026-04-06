import path from 'node:path';

import { assert, assertIncludes, assertNotIncludes } from '../lib/assert.mjs';
import { assertFileExists, readJson, readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { runNpmBuild } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'base only + install + build',
    { tags: ['base', 'build', 'readme', 'features'] },
    async ({ step, verbose }) => {
        const fixture = await createProjectFixture('base-only-app');
        const { projectPath } = fixture;

        try {
            step('creating project');
            await generateProject(fixture, ['--features=', '--defaults'], { verbose });

            await assertFileExists(path.join(projectPath, 'package.json'));
            await assertFileExists(path.join(projectPath, 'src'));

            const packageJson = await readJson(path.join(projectPath, 'package.json'));

            assert(
                !packageJson.devDependencies?.eslint,
                'eslint should not be installed in base-only case',
            );
            assert(
                !packageJson.dependencies?.['react-router-dom'],
                'react-router-dom should not be installed in base-only case',
            );

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, '# base-only-app', 'README should contain project title');
            assertIncludes(readme, 'Created with `create-alistt69-kit`.', 'README should contain generator info');

            assertIncludes(readme, '`npm run start`', 'README should contain start script');
            assertIncludes(readme, '`npm run build`', 'README should contain build script');
            assertIncludes(readme, '`npm run typecheck`', 'README should contain typecheck script');

            assertNotIncludes(readme, '`npm run lint`', 'README should not contain eslint scripts in base-only case');
            assertNotIncludes(readme, '`npm run lint:styles`', 'README should not contain stylelint scripts in base-only case');

            assertIncludes(readme, '## Overview', 'README should contain overview section');
            assertIncludes(readme, '## Included by default', 'README should contain default stack section');
            assertIncludes(readme, '## Quick start', 'README should contain quick start section');
            assertIncludes(readme, '## Project structure', 'README should contain project structure section');
            assertIncludes(readme, '[React](https://react.dev/)', 'README should contain React docs link');
            assertIncludes(readme, '[Webpack](https://webpack.js.org/)', 'README should contain Webpack docs link');

            step('building project');
            await runNpmBuild(projectPath, { verbose });
        } finally {
            await cleanupFixture(fixture);
        }
    },
);