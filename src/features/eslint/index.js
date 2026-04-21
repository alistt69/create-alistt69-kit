import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';
import { appendAgentsSection } from '../../utils/agents-md.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const eslintFeature = defineFeature({
    id: 'eslint',
    title: 'ESLint + Stylistic',
    hint: 'JS/TS/React linting',
    packageJson: {
        devDependencies: {
            eslint: '^9.0.0',
            '@eslint/js': '^9.0.0',
            '@stylistic/eslint-plugin': '^5.0.0',
            'typescript-eslint': '^8.0.0',
            'eslint-plugin-import': '^2.0.0',
            'eslint-plugin-react': '^7.0.0',
            'eslint-plugin-react-hooks': '^7.0.0',
            'eslint-plugin-unused-imports': '^4.0.0',
        },
        scripts: {
            lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
            'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
        },
    },
    copyFiles: resolve(currentDirPath, 'files'),
    async apply({ projectPath }) {
        await appendAgentsSection(
            projectPath,
            'eslint',
            `
                ## ESLint
                
                - Lint code with \`npm run lint\`.
                - Apply safe autofixes with \`npm run lint:fix\`.
                - Prefer fixing root-cause issues instead of disabling rules.
            `,
        );
    },
});