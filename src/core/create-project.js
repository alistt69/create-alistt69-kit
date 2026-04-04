import { outro, spinner } from '@clack/prompts';
import { format } from '../utils/console-format.js';
import { getRunScriptCommand } from '../utils/package-manager.js';
import { applyFeatures } from './apply-features.js';
import { collectProjectInfo } from './collect-project-info.js';
import { copyBaseTemplate } from './copy-base-template.js';
import { installDependencies } from './install-dependencies.js';
import { prepareTargetDirectory } from './prepare-target-directory.js';
import { replaceTokens } from './replace-tokens.js';
import { restoreSpecialFiles } from './restore-special-files.js';
import { renderProjectReadme } from './render-project-readme.js';

export async function createProject(cliArgs = {}) {
    const {
        projectName,
        selectedFeatureIds,
        shouldInstallDependencies,
        packageManager,
    } = await collectProjectInfo(cliArgs);

    const { targetDirPath } = await prepareTargetDirectory({
        projectName,
        overwrite: cliArgs.overwrite,
        yes: cliArgs.yes,
    });

    const progress = spinner();

    try {
        progress.start('Copying base template...');
        await copyBaseTemplate(targetDirPath);
        progress.stop('Base template copied');

        progress.start('Restoring special files...');
        await restoreSpecialFiles(targetDirPath);
        progress.stop('Special files restored');

        progress.start('Replacing template tokens...');
        await replaceTokens(targetDirPath, {
            '__PROJECT_NAME__': projectName,
        });
        progress.stop('Template tokens replaced');

        if (selectedFeatureIds.length > 0) {
            progress.start(`Applying features: ${selectedFeatureIds.join(', ')}`);
            await applyFeatures({
                projectPath: targetDirPath,
                selectedFeatureIds,
            });
            progress.stop('Features applied');
        }

        progress.start('Generating README...');
        await renderProjectReadme({
            projectPath: targetDirPath,
            projectName,
            selectedFeatureIds,
            packageManager,
        });
        progress.stop('README generated');

        if (shouldInstallDependencies) {
            progress.start(`Installing dependencies with ${packageManager}...`);
            await installDependencies(targetDirPath, packageManager);
            progress.stop('Dependencies installed');
        }
    } catch (error) {
        progress.stop('Operation failed');
        throw error;
    }

    const featuresLine = selectedFeatureIds.length
        ? selectedFeatureIds.join(', ')
        : 'none';

    const nextSteps = shouldInstallDependencies
        ? [
            `cd ${projectName}`,
            getRunScriptCommand(packageManager, 'start'),
        ]
        : [
            `cd ${projectName}`,
            packageManager === 'yarn' ? 'yarn' : `${packageManager} install`,
            getRunScriptCommand(packageManager, 'start'),
        ];

    outro([
        `${format.green('✔ Project created successfully')}`,
        '',
        format.sectionTitle('Project info'),
        `${format.label('Project')}  ${projectName}`,
        `${format.label('Path')}     ${targetDirPath}`,
        `${format.label('Features')} ${featuresLine}`,
        `${format.label('PM')}       ${packageManager}`,
        '',
        format.sectionTitle('Next steps'),
        ...nextSteps.map((step) => `  ${step}`),
    ].join('\n'));
}