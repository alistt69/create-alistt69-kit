import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineFeature } from '../define-feature.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

export const agentsMdFeature = defineFeature({
    id: 'agents-md',
    title: 'AGENTS.md',
    hint: 'Root instructions file for AI coding agents',
    copyFiles: resolve(currentDirPath, 'files'),
});