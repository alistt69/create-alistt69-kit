import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';
import { appendAgentsSection } from '../../utils/agents-md.js';

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
        scripts: {
            'generate:page': 'node ./scripts/generate/page.mjs',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
    async apply({ projectPath }) {
        await appendAgentsSection(
            projectPath,
            'react-router',
            `
                ## React Router
                
                - Routing is configured under \`src/app/providers/router/\`.
                - Route-level pages live in \`src/pages/\`.
                - Generate a new page with \`npm run generate:page -- <page-name>\`.
                - Do not remove router marker comments used by the page generator unless you also disable auto-registration.
            `,
        );
    },
});