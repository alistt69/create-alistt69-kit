import { cp } from 'node:fs/promises';

import { patchPackageJson } from '../utils/package-json.js';

export function defineFeature({
    id,
    title,
    hint,
    packageJson,
    apply,
    copyFiles,
}) {
    return {
        id,
        title,
        hint,
        async applyFeature(context) {
            if (packageJson) {
                await patchPackageJson(context.projectPath, packageJson);
            }

            if (copyFiles) {
                await cp(copyFiles, context.projectPath, {
                    recursive: true,
                });
            }

            if (apply) {
                await apply(context);
            }
        },
    };
}