import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';
import { appendAgentsSection } from '../../utils/agents-md.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const stylelintFeature = defineFeature({
    id: 'stylelint',
    title: 'Stylelint',
    hint: 'SCSS/CSS linting',
    packageJson: {
        devDependencies: {
            stylelint: '^17.6.0',
            'stylelint-config-standard-scss': '^17.0.0',
        },
        scripts: {
            'lint:styles': 'stylelint "src/**/*.{scss,css}"',
            'lint:styles:fix': 'stylelint "src/**/*.{scss,css}" --fix',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
    async apply({ projectPath }) {
        await appendAgentsSection(
            projectPath,
            'stylelint',
            `
                ## Stylelint
                
                - Lint styles with \`npm run lint:styles\`.
                - Apply autofixes with \`npm run lint:styles:fix\`.
                - Keep styles compatible with the existing SCSS modules setup.
            `,
        );
    },
});