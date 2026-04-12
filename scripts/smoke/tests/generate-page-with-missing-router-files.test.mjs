import path from 'node:path';

import { assertIncludes } from '../lib/assert.mjs';
import { assertFileExists, cleanupPath, pathExists } from '../lib/fs.mjs';
import { cleanupFixture, createProjectFixture, generateProject } from '../lib/project.mjs';
import { runCommand } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'react-router page generator creates page when router files are missing',
    { tags: ['generator', 'router', 'fallback'] },
    async ({ step, verbose }) => {
        const fixture = await createProjectFixture('router-page-generator-fallback-app');
        const { projectPath } = fixture;

        const routeTypesPath = path.join(
            projectPath,
            'src',
            'app',
            'providers',
            'router',
            'types',
            'index.ts',
        );

        const routeConfigPath = path.join(
            projectPath,
            'src',
            'app',
            'providers',
            'router',
            'model',
            'config',
            'index.ts',
        );

        const routerFilePath = path.join(
            projectPath,
            'src',
            'app',
            'providers',
            'router',
            'model',
            'router',
            'index.tsx',
        );

        try {
            step('creating project with react-router');
            await generateProject(fixture, ['--features=react-router', '--defaults'], { verbose });

            step('removing router files');
            await cleanupPath(routeTypesPath);
            await cleanupPath(routeConfigPath);
            await cleanupPath(routerFilePath);

            step('generating page without router files');
            const result = await runCommand('npm', ['run', 'generate:page', '--', 'faq'], {
                cwd: projectPath,
                verbose,
                errorMessage: 'generate:page should still create page when router files are missing',
            });

            await assertFileExists(path.join(projectPath, 'src', 'pages', 'faq', 'index.ts'));
            await assertFileExists(path.join(projectPath, 'src', 'pages', 'faq', 'lazy.ts'));
            await assertFileExists(path.join(projectPath, 'src', 'pages', 'faq', 'page.tsx'));

            assertIncludes(
                result.stdout,
                'Route auto-registration skipped.',
                'generator should explain that route registration was skipped',
            );

            if (await pathExists(routeTypesPath)) {
                throw new Error('route types file should remain missing');
            }

            if (await pathExists(routeConfigPath)) {
                throw new Error('route config file should remain missing');
            }

            if (await pathExists(routerFilePath)) {
                throw new Error('router file should remain missing');
            }
        } finally {
            await cleanupFixture(fixture);
        }
    },
);