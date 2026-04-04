import {
    cancel,
    confirm,
    intro,
    isCancel,
    multiselect,
    note,
    select,
    text,
} from '@clack/prompts';
import process from 'node:process';
import { format } from '../utils/console-format.js';
import { allowedPackageManagers } from '../utils/package-manager.js';

const availableFeatures = [
    {
        value: 'eslint',
        label: 'ESLint + Stylistic',
        hint: 'JS/TS/React linting',
    },
    {
        value: 'stylelint',
        label: 'Stylelint',
        hint: 'SCSS/CSS linting',
    },
    {
        value: 'autoprefixer',
        label: 'Autoprefixer',
        hint: 'PostCSS vendor prefixes',
    },
    {
        value: 'react-router',
        label: 'React Router DOM',
        hint: 'Routing + FSD-like app/pages/shared',
    },
];

const defaultFeatureIds = availableFeatures.map((feature) => feature.value);
const defaultPackageManager = 'npm';
const availableFeatureIdSet = new Set(defaultFeatureIds);

function handleCancel(value) {
    if (!isCancel(value)) {
        return value;
    }

    cancel('Operation cancelled.');
    process.exit(0);
}

function validateProjectName(value) {
    const projectName = value.trim();

    if (!projectName) {
        return 'Project name is required';
    }

    if (projectName.length > 214) {
        return 'Project name is too long';
    }

    if (!/^[a-z0-9._-]+$/i.test(projectName)) {
        return 'Use only letters, numbers, dots, underscores and hyphens';
    }

    if (projectName.startsWith('.')) {
        return 'Project name cannot start with a dot';
    }

    return;
}

function normalizeFeatureIds(featureIds) {
    const normalizedFeatureIds = [...new Set(featureIds.map((featureId) => featureId.toLowerCase()))];

    if (normalizedFeatureIds.includes('all')) {
        return defaultFeatureIds;
    }

    const unknownFeatureIds = normalizedFeatureIds.filter((featureId) => !availableFeatureIdSet.has(featureId));

    if (unknownFeatureIds.length > 0) {
        throw new Error(`Unknown features: ${unknownFeatureIds.join(', ')}`);
    }

    return defaultFeatureIds.filter((featureId) => normalizedFeatureIds.includes(featureId));
}

export async function collectProjectInfo(cliArgs = {}) {
    intro('create-alistt69-kit');

    let projectName = cliArgs.projectName;
    let selectedFeatureIds = cliArgs.selectedFeatureIds;
    let shouldInstallDependencies = cliArgs.shouldInstallDependencies;
    let packageManager = cliArgs.packageManager;

    if (cliArgs.yes && !projectName) {
        throw new Error('Project name is required when using --yes');
    }

    if (!projectName) {
        projectName = handleCancel(await text({
            message: 'Project name',
            placeholder: 'my-awesome-app',
            validate: validateProjectName,
        }));
    } else {
        const validationError = validateProjectName(projectName);

        if (validationError) {
            throw new Error(validationError);
        }
    }

    if (selectedFeatureIds === undefined) {
        if (cliArgs.yes) {
            selectedFeatureIds = defaultFeatureIds;
        } else {
            note(
                [
                    'All features are selected by default.',
                    'Remove anything you do not need.',
                    '',
                    '↑/↓ — move',
                    'Space — toggle feature',
                    'Enter — confirm selection',
                ].join('\n'),
                format.sectionTitle('Feature selection help'),
            );

            selectedFeatureIds = handleCancel(await multiselect({
                message: 'Remove unnecessary features',
                options: availableFeatures,
                initialValues: defaultFeatureIds,
                required: false,
            }));
        }
    }

    selectedFeatureIds = normalizeFeatureIds(selectedFeatureIds);

    if (!packageManager) {
        if (cliArgs.yes) {
            packageManager = defaultPackageManager;
        } else {
            packageManager = handleCancel(await select({
                message: 'Package manager',
                initialValue: defaultPackageManager,
                options: allowedPackageManagers.map((value) => ({
                    value,
                    label: value,
                })),
            }));
        }
    }

    if (shouldInstallDependencies === undefined) {
        if (cliArgs.yes) {
            shouldInstallDependencies = true;
        } else {
            shouldInstallDependencies = handleCancel(await confirm({
                message: 'Install dependencies?',
                initialValue: true,
            }));
        }
    }

    const summaryLines = [
        `${format.label('Project')}  ${projectName}`,
        `${format.label('Features')} ${selectedFeatureIds.length ? selectedFeatureIds.join(', ') : 'none'}`,
        `${format.label('PM')}       ${packageManager}`,
        `${format.label('Install')}  ${shouldInstallDependencies ? 'yes' : 'no'}`,
    ];

    note(summaryLines.join('\n'), format.sectionTitle('Summary'));

    if (!cliArgs.yes) {
        const shouldContinue = handleCancel(await confirm({
            message: 'Continue?',
            initialValue: true,
        }));

        if (!shouldContinue) {
            cancel('Operation cancelled.');
            process.exit(0);
        }
    }

    return {
        projectName: projectName.trim(),
        selectedFeatureIds,
        shouldInstallDependencies,
        packageManager,
    };
}