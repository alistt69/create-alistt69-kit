import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { featuresById } from '../features/index.js';
import { readPackageJson } from '../utils/package-json.js';
import { getRunScriptCommand } from '../utils/package-manager.js';

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

function formatFeatureList(selectedFeatureIds) {
    if (selectedFeatureIds.length === 0) {
        return '- None';
    }

    return selectedFeatureIds
        .map((featureId) => {
            const feature = featuresById.get(featureId);

            return `- ${feature?.title ?? featureId}`;
        })
        .join('\n');
}

function formatScripts(packageManager, scripts) {
    const entries = Object.entries(scripts);

    if (entries.length === 0) {
        return '_No scripts available._';
    }

    return entries.map(([scriptName]) => {
        const command = getRunScriptCommand(packageManager, scriptName);
        const description = scriptDescriptions[scriptName] ?? 'Project script';

        return `- \`${command}\` — ${description}`;
    }).join('\n');
}

export async function renderProjectReadme({
    projectPath,
    projectName,
    selectedFeatureIds,
    packageManager,
}) {
    const packageJson = await readPackageJson(projectPath);

    const readmeContent = [
        `# ${projectName}`,
        '',
        'Created with `create-alistt69-kit`.',
        '',
        '## Enabled features',
        '',
        formatFeatureList(selectedFeatureIds),
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