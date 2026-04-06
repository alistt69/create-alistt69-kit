import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const autoprefixerFeature = defineFeature({
    id: 'autoprefixer',
    title: 'Autoprefixer',
    hint: 'PostCSS vendor prefixes',
    packageJson: {
        devDependencies: {
            autoprefixer: '^10.4.21',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
});