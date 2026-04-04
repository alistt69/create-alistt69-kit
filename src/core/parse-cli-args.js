import { allowedPackageManagers } from '../utils/package-manager.js';

function readOptionValue(args, currentIndex, optionName) {
    const currentArg = args[currentIndex];

    if (currentArg.includes('=')) {
        return {
            value: currentArg.slice(currentArg.indexOf('=') + 1),
            nextIndex: currentIndex,
        };
    }

    const nextArg = args[currentIndex + 1];

    if (!nextArg || nextArg.startsWith('-')) {
        throw new Error(`Option ${optionName} requires a value`);
    }

    return {
        value: nextArg,
        nextIndex: currentIndex + 1,
    };
}

export function formatHelpMessage() {
    return [
        'Usage:',
        '  create-alistt69-kit <project-name> [options]',
        '',
        'Options:',
        '  -def, --defaults                    Skip prompts and use defaults',
        '  --overwrite                  Overwrite target directory if it exists',
        '  --no-install                 Do not install dependencies',
        '  --features <comma-list>      Example: eslint,stylelint,react-router',
        '  --features all               Enable all features',
        '  --pm <npm|pnpm|yarn>         Package manager',
        '  -h, --help                   Show help',
        '',
        'Defaults:',
        '  All features are enabled by default',
        '  Package manager: npm',
        '  Install dependencies: yes',
        '',
        'Examples:',
        '  create-alistt69-kit my-app',
        '  create-alistt69-kit my-app --features=all',
        '  create-alistt69-kit my-app --pm pnpm --no-install',
        '  create-alistt69-kit my-app --defaults',
        '  create-alistt69-kit my-app --defaults --overwrite',
    ].join('\n');
}

export function parseCliArgs(argv) {
    const result = {
        projectName: undefined,
        selectedFeatureIds: undefined,
        shouldInstallDependencies: undefined,
        packageManager: undefined,
        defaults: false,
        overwrite: false,
        showHelp: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === '-h' || arg === '--help') {
            result.showHelp = true;
            continue;
        }

        if (arg === '-def' || arg === '--defaults') {
            result.defaults = true;
            continue;
        }

        if (arg === '--overwrite') {
            result.overwrite = true;
            continue;
        }

        if (arg === '--no-install') {
            result.shouldInstallDependencies = false;
            continue;
        }

        if (arg.startsWith('--features')) {
            const { value, nextIndex } = readOptionValue(argv, index, '--features');
            index = nextIndex;

            result.selectedFeatureIds = value
                ? value.split(',').map((item) => item.trim()).filter(Boolean)
                : [];

            continue;
        }

        if (arg.startsWith('--pm')) {
            const { value, nextIndex } = readOptionValue(argv, index, '--pm');
            index = nextIndex;

            if (!allowedPackageManagers.includes(value)) {
                throw new Error(`Unknown package manager: ${value}`);
            }

            result.packageManager = value;
            continue;
        }

        if (arg.startsWith('-')) {
            throw new Error(`Unknown option: ${arg}`);
        }

        if (!result.projectName) {
            result.projectName = arg;
            continue;
        }

        throw new Error(`Unexpected argument: ${arg}`);
    }

    return result;
}