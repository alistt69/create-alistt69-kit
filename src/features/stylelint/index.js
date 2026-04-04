import { cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addDevDependencies, addScripts } from '../../utils/package-json.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const stylelintFeature = {
    id: 'stylelint',
    title: 'Stylelint',
    apply: async ({ projectPath }) => {
        await addDevDependencies(projectPath, {
            stylelint: '^17.6.0',
            'stylelint-config-standard-scss': '^17.0.0',
        });

        await addScripts(projectPath, {
            'lint:styles': 'stylelint "src/**/*.{scss,css}"',
            'lint:styles:fix': 'stylelint "src/**/*.{scss,css}" --fix',
        });

        const filesDirPath = resolve(currentDirPath, 'files');

        await cp(filesDirPath, projectPath, {
            recursive: true,
        });
    },
};