import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const reactRouterFeature = defineFeature({
    id: 'react-router',
    title: 'React Router DOM',
    hint: 'Routing + FSD-like app/pages/shared',
    packageJson: {
        dependencies: {
            'react-router-dom': '^7.13.2',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
});