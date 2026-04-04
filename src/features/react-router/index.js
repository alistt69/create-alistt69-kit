import { cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addDependencies } from '../../utils/package-json.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const reactRouterFeature = {
    id: 'react-router',
    title: 'React Router DOM',
    apply: async ({ projectPath }) => {
        await addDependencies(projectPath, {
            'react-router-dom': '^7.13.2',
        });

        const filesDirPath = resolve(currentDirPath, 'files');

        await cp(filesDirPath, projectPath, {
            recursive: true,
        });
    },
};