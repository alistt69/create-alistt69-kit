import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';
import { appendAgentsSection } from '../../utils/agents-md.js';

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
    async apply({ projectPath }) {
        await appendAgentsSection(
            projectPath,
            'autoprefixer',
            `
                ## CSS compatibility
                
                - Vendor prefixing is handled by Autoprefixer.
                - Do not add manual prefixes unless there is a confirmed need.
            `,
        );
    },
});