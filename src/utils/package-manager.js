export const allowedPackageManagers = ['npm', 'pnpm', 'yarn'];

export function isPackageManager(value) {
    return allowedPackageManagers.includes(value);
}

export function getInstallCommand(packageManager) {
    if (packageManager === 'yarn') {
        return {
            command: 'yarn',
            args: [],
        };
    }

    return {
        command: packageManager,
        args: ['install'],
    };
}

export function getRunScriptCommand(packageManager, scriptName) {
    if (packageManager === 'npm') {
        return `npm run ${scriptName}`;
    }

    return `${packageManager} ${scriptName}`;
}