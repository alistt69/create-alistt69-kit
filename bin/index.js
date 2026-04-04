#!/usr/bin/env node

import { cancel } from '@clack/prompts';
import process from 'node:process';
import { createProject } from '../src/core/create-project.js';
import { formatHelpMessage, parseCliArgs } from '../src/core/parse-cli-args.js';

try {
    const cliArgs = parseCliArgs(process.argv.slice(2));

    if (cliArgs.showHelp) {
        console.log(formatHelpMessage());
        process.exit(0);
    }

    await createProject(cliArgs);
} catch (error) {
    cancel(
        error instanceof Error
            ? `Failed to create project: ${error.message}`
            : 'Failed to create project',
    );

    process.exitCode = 1;
}