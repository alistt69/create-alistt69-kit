import path from 'node:path';

import { assert, assertIncludes, assertNotIncludes } from '../lib/assert.mjs';
import { assertFileExists, readJson, readText } from '../lib/fs.mjs';
import { cleanupFixture, createProjectFixture, generateProject } from '../lib/project.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'prerender only',
    { tags: ['prerender', 'features', 'readme'] },
    async ({ verbose }) => {
        const fixture = await createProjectFixture('prerender-only-app');
        const { projectPath } = fixture;

        try {
            await generateProject(fixture, ['--features=prerender', '--defaults'], { verbose });

            const packageJson = await readJson(path.join(projectPath, 'package.json'));

            assert(packageJson.devDependencies?.puppeteer, 'puppeteer should be installed');
            assert(packageJson.devDependencies?.['serve-handler'], 'serve-handler should be installed');
            assert(packageJson.scripts?.['build:assets'], 'build:assets script should be added');
            assert(packageJson.scripts?.prerender, 'prerender script should be added');
            assert(
                packageJson.scripts?.build === 'npm run build:assets && npm run prerender',
                'build script should be overridden for prerender',
            );

            await assertFileExists(path.join(projectPath, 'prerender.routes.mjs'));
            await assertFileExists(path.join(projectPath, 'scripts', 'prerender.mjs'));

            const prerenderRoutes = await readText(path.join(projectPath, 'prerender.routes.mjs'));
            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(prerenderRoutes, "'/',", 'prerender routes should include root route');
            assertIncludes(readme, '- Prerender', 'README should list prerender feature');
            assertIncludes(readme, '## Prerender', 'README should contain prerender section');
            assertIncludes(readme, '`npm run prerender`', 'README should contain prerender command');
            assertNotIncludes(readme, '## Page generator', 'README should not contain page generator section');
        } finally {
            await cleanupFixture(fixture);
        }
    },
);