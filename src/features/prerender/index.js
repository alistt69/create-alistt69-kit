import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const prerenderFeature = defineFeature({
    id: 'prerender',
    title: 'Prerender',
    hint: 'Static HTML prerender via Puppeteer after webpack build',
    packageJson: {
        devDependencies: {
            puppeteer: '^24.19.0',
            'serve-handler': '^6.1.6',
        },
        scripts: {
            'build:assets': 'webpack --env mode=production',
            prerender: 'node ./scripts/prerender.mjs',
            build: 'npm run build:assets && npm run prerender',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
});