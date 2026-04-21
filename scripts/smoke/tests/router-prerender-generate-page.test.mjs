import path from 'node:path';

import { assertIncludes } from '../lib/assert.mjs';
import { assertFileExists, readText } from '../lib/fs.mjs';
import { cleanupFixture, createProjectFixture, generateProject } from '../lib/project.mjs';
import { runCommand } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'react-router + prerender page generator updates routes and prerender manifest',
    { tags: ['generator', 'router', 'prerender'] },
    async ({ step, verbose }) => {
        const fixture = await createProjectFixture('router-prerender-generator-app');
        const { projectPath } = fixture;

        try {
            step('creating project with react-router and prerender');
            await generateProject(
                fixture,
                ['--features=react-router,prerender', '--defaults'],
                { verbose },
            );

            step('generating page');
            await runCommand('npm', ['run', 'generate:page', '--', 'about'], {
                cwd: projectPath,
                verbose,
                errorMessage: 'generate:page should update router and prerender routes',
            });

            await assertFileExists(path.join(projectPath, 'src', 'pages', 'about', 'page.tsx'));

            const routeTypes = await readText(
                path.join(projectPath, 'src', 'app', 'providers', 'router', 'types', 'index.ts'),
            );
            const routeConfig = await readText(
                path.join(projectPath, 'src', 'app', 'providers', 'router', 'model', 'config', 'index.ts'),
            );
            const routerFile = await readText(
                path.join(projectPath, 'src', 'app', 'providers', 'router', 'model', 'router', 'index.tsx'),
            );
            const prerenderRoutes = await readText(
                path.join(projectPath, 'prerender.routes.mjs'),
            );

            assertIncludes(routeTypes, "ABOUT = 'about',", 'route enum should contain ABOUT');
            assertIncludes(routeConfig, '[ERoutePath.ABOUT]: {', 'route config should contain ABOUT entry');
            assertIncludes(
                routerFile,
                '<Route path={ERoutePath.ABOUT} element={<About />} />',
                'router should register ABOUT route',
            );
            assertIncludes(prerenderRoutes, "'/about',", 'prerender manifest should contain /about');
            assertIncludes(prerenderRoutes, '// @prerender-routes', 'prerender marker should remain in place');
        } finally {
            await cleanupFixture(fixture);
        }
    },
);