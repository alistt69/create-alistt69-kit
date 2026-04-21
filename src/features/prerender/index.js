import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';
import { appendAgentsSection } from '../../utils/agents-md.js';

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
            build: 'npm run build:assets && npm run prerender',
            'build:assets': 'webpack --env mode=production',
            'build:prod': 'npm run build',
            prerender: 'node ./scripts/prerender.mjs',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
    async apply({ projectPath }) {
        await appendAgentsSection(
            projectPath,
            'prerender',
            `
                ## Prerender
                
                - Production build runs in two steps: \`npm run build:assets\` then \`npm run prerender\`.
                - Prerender route manifest lives in \`prerender.routes.mjs\`.
                - Prerender script lives in \`scripts/prerender.mjs\`.
                - When adding static routes, keep \`prerender.routes.mjs\` updated.
            `,
        );
    },
});