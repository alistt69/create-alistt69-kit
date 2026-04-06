export const allowedPackageManagers = ['npm', 'pnpm', 'yarn'];

export function getInstallCommand(packageManager) {
    if (packageManager === 'yarn') {
        return {
            command: 'yarn',
            args: [],
        };
    }

    return {
        command: packageManager,
        args: ['install', ' --verbose'],
    };
}

export function getRunScriptCommand(packageManager, scriptName) {
    if (packageManager === 'npm') {
        return `npm run ${scriptName}`;
    }

    return `${packageManager} ${scriptName}`;
}