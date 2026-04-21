import path from 'node:path';

import { assert, assertIncludes } from '../lib/assert.mjs';
import { assertFileExists, readJson, readText } from '../lib/fs.mjs';
import { generateProject, createProjectFixture, cleanupFixture } from '../lib/project.mjs';
import { runNpmBuild } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'all features + install + build',
    { tags: ['all', 'build', 'readme', 'features'] },
    async ({ step, verbose }) => {
        const fixture = await createProjectFixture('all-features-app');
        const { projectPath } = fixture;

        try {
            step('creating project');
            await generateProject(fixture, ['--features=all', '--defaults'], { verbose });

            const packageJson = await readJson(path.join(projectPath, 'package.json'));

            assert(packageJson.devDependencies?.eslint, 'eslint should be installed');
            assert(packageJson.devDependencies?.stylelint, 'stylelint should be installed');
            assert(packageJson.devDependencies?.autoprefixer, 'autoprefixer should be installed');
            assert(packageJson.dependencies?.['react-router-dom'], 'react-router-dom should be installed');
            assert(packageJson.scripts?.['generate:page'], 'generate:page script should be added');
            assert(packageJson.devDependencies?.puppeteer, 'puppeteer should be installed');
            assert(packageJson.devDependencies?.['serve-handler'], 'serve-handler should be installed');
            assert(packageJson.scripts?.prerender, 'prerender script should be added');
            assert(packageJson.scripts?.['build:assets'], 'build:assets script should be added');

            await assertFileExists(path.join(projectPath, 'eslint.config.mjs'));
            await assertFileExists(path.join(projectPath, 'stylelint.config.mjs'));
            await assertFileExists(path.join(projectPath, 'postcss.config.cjs'));
            await assertFileExists(path.join(projectPath, 'src', 'app', 'providers', 'router', 'model', 'router', 'index.tsx'));
            await assertFileExists(path.join(projectPath, 'prerender.routes.mjs'));
            await assertFileExists(path.join(projectPath, 'scripts', 'prerender.mjs'));

            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(readme, '- ESLint + Stylistic', 'README should list eslint feature');
            assertIncludes(readme, '- Stylelint', 'README should list stylelint feature');
            assertIncludes(readme, '- Autoprefixer', 'README should list autoprefixer feature');
            assertIncludes(readme, '- React Router DOM', 'README should list router feature');

            assertIncludes(readme, '`npm run lint`', 'README should contain eslint script');
            assertIncludes(readme, '`npm run lint:fix`', 'README should contain eslint autofix script');
            assertIncludes(readme, '`npm run lint:styles`', 'README should contain stylelint script');
            assertIncludes(readme, '`npm run lint:styles:fix`', 'README should contain stylelint autofix script');
            assertIncludes(readme, '`npm run generate:page`', 'README should contain page generator script');
            assertIncludes(readme, '## Page generator', 'README should contain page generator section');

            assertIncludes(readme, '- Prerender', 'README should list prerender feature');
            assertIncludes(readme, '`npm run prerender`', 'README should contain prerender script');
            assertIncludes(readme, '## Prerender', 'README should contain prerender section');

            step('building project');
            await runNpmBuild(projectPath, { verbose });
        } finally {
            await cleanupFixture(fixture);
        }
    },
);