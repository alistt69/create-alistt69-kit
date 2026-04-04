import { cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addDevDependencies } from '../../utils/package-json.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const autoprefixerFeature = {
    id: 'autoprefixer',
    title: 'Autoprefixer',
    apply: async ({ projectPath }) => {
        await addDevDependencies(projectPath, {
            autoprefixer: '^10.4.21',
        });

        const filesDirPath = resolve(currentDirPath, 'files');

        await cp(filesDirPath, projectPath, {
            recursive: true,
        });
    },
};