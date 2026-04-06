import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { featuresById } from '../features/index.js';
import { readPackageJson } from '../utils/package-json.js';
import { getRunScriptCommand } from '../utils/package-manager.js';

const defaultTooling = [
    {
        title: 'React',
        docs: 'https://react.dev/',
        description: 'UI library',
    },
    {
        title: 'TypeScript',
        docs: 'https://www.typescriptlang.org/',
        description: 'Static typing',
    },
    {
        title: 'Webpack',
        docs: 'https://webpack.js.org/',
        description: 'Bundling and build pipeline',
    },
    {
        title: 'SCSS Modules',
        docs: 'https://github.com/css-modules/css-modules',
        description: 'Scoped styling',
    },
    {
        title: 'SVGR',
        docs: 'https://react-svgr.com/',
        description: 'SVGs as React components',
    },
    {
        title: 'Webpack Bundle Analyzer',
        docs: 'https://github.com/webpack-contrib/webpack-bundle-analyzer',
        description: 'Bundle size inspection',
    },
];

const scriptDescriptions = {
    dev: 'Start development server',
    start: 'Start development server',
    build: 'Build for production',
    'build:dev': 'Build in development mode',
    'build:prod': 'Build in production mode',
    typecheck: 'Run TypeScript type check',
    lint: 'Run ESLint',
    'lint:fix': 'Run ESLint with autofix',
    'lint:styles': 'Run Stylelint',
    'lint:styles:fix': 'Run Stylelint with autofix',
};

function formatMarkdownList(items, fallback = '- None') {
    if (items.length === 0) {
        return fallback;
    }

    return items.join('\n');
}

function formatDefaultTooling() {
    return formatMarkdownList(
        defaultTooling.map(({ title, docs, description }) => (
            `- [${title}](${docs}) — ${description}`
        )),
    );
}

function formatFeatureList(selectedFeatureIds) {
    if (selectedFeatureIds.length === 0) {
        return '- None';
    }

    return selectedFeatureIds
        .map((featureId) => {
            const feature = featuresById.get(featureId);

            if (!feature) {
                return `- ${featureId}`;
            }

            return feature.hint
                ? `- ${feature.title} — ${feature.hint}`
                : `- ${feature.title}`;
        })
        .join('\n');
}

function formatScripts(packageManager, scripts) {
    const entries = Object.entries(scripts);

    if (entries.length === 0) {
        return '_No scripts available._';
    }

    return entries
        .map(([scriptName]) => {
            const command = getRunScriptCommand(packageManager, scriptName);
            const description = scriptDescriptions[scriptName] ?? 'Project script';

            return `- \`${command}\` — ${description}`;
        })
        .join('\n');
}

function formatQuickStart({
                              projectName,
                              packageManager,
                              shouldInstallDependencies,
                          }) {
    const steps = [`cd ${projectName}`];

    if (!shouldInstallDependencies) {
        steps.push(packageManager === 'yarn' ? 'yarn' : `${packageManager} install`);
    }

    steps.push(getRunScriptCommand(packageManager, 'start'));

    return [
        shouldInstallDependencies
            ? 'Dependencies are already installed.'
            : 'Install dependencies first, then start the development server.',
        '',
        '```bash',
        ...steps,
        '```',
    ].join('\n');
}

function formatProjectStructure() {
    return [
        '- `public/` — static assets and HTML template',
        '- `src/` — application source code',
        '- `src/app/` — app bootstrap, providers, entry-level setup',
        '- `src/styles/` — global styles and shared styling layer',
        '- `config/build/` — split webpack configuration',
    ].join('\n');
}

export async function renderProjectReadme({
                                              projectPath,
                                              projectName,
                                              selectedFeatureIds,
                                              packageManager,
                                              shouldInstallDependencies,
                                          }) {
    const packageJson = await readPackageJson(projectPath);

    const readmeContent = [
        `# ${projectName}`,
        '',
        'Created with `create-alistt69-kit`.',
        '',
        '## Overview',
        '',
        'Starter project based on React + TypeScript + Webpack with optional tooling selected during scaffolding.',
        '',
        '## Included by default',
        '',
        formatDefaultTooling(),
        '',
        '## Selected optional features',
        '',
        formatFeatureList(selectedFeatureIds),
        '',
        '## Quick start',
        '',
        formatQuickStart({
            projectName,
            packageManager,
            shouldInstallDependencies,
        }),
        '',
        '## Project structure',
        '',
        formatProjectStructure(),
        '',
        '## Available scripts',
        '',
        formatScripts(packageManager, packageJson.scripts ?? {}),
    ].join('\n');

    await writeFile(
        resolve(projectPath, 'README.md'),
        `${readmeContent}\n`,
        'utf8',
    );
}