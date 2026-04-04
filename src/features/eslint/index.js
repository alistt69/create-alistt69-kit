import { cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addDevDependencies, addScripts } from '../../utils/package-json.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const eslintFeature = {
    id: 'eslint',
    title: 'ESLint + Stylistic',
    apply: async ({ projectPath }) => {
        await addDevDependencies(projectPath, {
            "eslint": "^9.0.0",
            "@eslint/js": "^9.0.0",
            "@stylistic/eslint-plugin": "^5.0.0",
            "typescript-eslint": "^8.0.0",
            "eslint-plugin-import": "^2.0.0",
            "eslint-plugin-react": "^7.0.0",
            "eslint-plugin-react-hooks": "^7.0.0",
            "eslint-plugin-unused-imports": "^4.0.0"
        });

        await addScripts(projectPath, {
            lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
            'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
        });

        const filesDirPath = resolve(currentDirPath, 'files');

        await cp(filesDirPath, projectPath, {
            recursive: true,
        });
    },
};