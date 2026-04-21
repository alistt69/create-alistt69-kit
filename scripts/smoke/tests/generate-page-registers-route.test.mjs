import path from 'node:path';

import { assertIncludes } from '../lib/assert.mjs';
import { assertFileExists, readText } from '../lib/fs.mjs';
import { cleanupFixture, createProjectFixture, generateProject } from '../lib/project.mjs';
import { runCommand, runNpmBuild } from '../lib/process.mjs';
import { defineTest } from '../lib/registry.mjs';

defineTest(
    'react-router page generator registers route and builds',
    { tags: ['generator', 'router', 'build'] },
    async ({ step, verbose }) => {
        const fixture = await createProjectFixture('router-page-generator-app');
        const { projectPath } = fixture;

        try {
            step('creating project with react-router');
            await generateProject(fixture, ['--features=react-router', '--defaults'], { verbose });

            step('generating page');
            await runCommand('npm', ['run', 'generate:page', '--', 'about'], {
                cwd: projectPath,
                verbose,
                errorMessage: 'generate:page should create and register the page',
            });

            await assertFileExists(path.join(projectPath, 'src', 'pages', 'about', 'index.ts'));
            await assertFileExists(path.join(projectPath, 'src', 'pages', 'about', 'lazy.ts'));
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
            const readme = await readText(path.join(projectPath, 'README.md'));

            assertIncludes(routeTypes, "ABOUT = 'about',", 'route enum should contain ABOUT');
            assertIncludes(routeTypes, '// @route-enum', 'route enum marker should remain in place');

            assertIncludes(routeConfig, '[ERoutePath.ABOUT]: {', 'route config should contain ABOUT entry');
            assertIncludes(routeConfig, "title: 'About',", 'route config should contain About title');
            assertIncludes(routeConfig, '// @route-config', 'route config marker should remain in place');

            assertIncludes(
                routerFile,
                "import { About } from '../../../../../pages/about';",
                'router should import About page',
            );
            assertIncludes(
                routerFile,
                '<Route path={ERoutePath.ABOUT} element={<About />} />',
                'router should register ABOUT route',
            );
            assertIncludes(routerFile, '{/* @route-routes */}', 'router marker should remain in place');

            assertIncludes(readme, '## Page generator', 'generated README should document page generator');

            assertIncludes(
                readme,
                'npm run generate:page about',
                'generated README should contain page generator example',
            );

            step('building project');
            await runNpmBuild(projectPath, { verbose });
        } finally {
            await cleanupFixture(fixture);
        }
    },
);