import { readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { getTests } from './lib/registry.mjs';

const currentFilePath = fileURLToPath(import.meta.url);
const smokeDir = path.dirname(currentFilePath);
const testsDir = path.join(smokeDir, 'tests');

function parseArgs(argv) {
    const options = {
        grep: '',
        tag: '',
        bail: false,
        verbose: false,
        list: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === '--bail') {
            options.bail = true;
            continue;
        }

        if (arg === '--verbose') {
            options.verbose = true;
            continue;
        }

        if (arg === '--list') {
            options.list = true;
            continue;
        }

        if (arg.startsWith('--grep=')) {
            options.grep = arg.slice('--grep='.length);
            continue;
        }

        if (arg === '--grep') {
            options.grep = argv[index + 1] ?? '';
            index += 1;
            continue;
        }

        if (arg.startsWith('--tag=')) {
            options.tag = arg.slice('--tag='.length);
            continue;
        }

        if (arg === '--tag') {
            options.tag = argv[index + 1] ?? '';
            index += 1;
        }
    }

    return options;
}

async function loadTests() {
    const fileNames = (await readdir(testsDir))
        .filter((fileName) => fileName.endsWith('.test.mjs'))
        .sort();

    for (const fileName of fileNames) {
        const fileUrl = pathToFileURL(path.join(testsDir, fileName)).href;
        await import(fileUrl);
    }
}

function matchesFilters(test, options) {
    const matchesGrep = !options.grep
        || test.name.toLowerCase().includes(options.grep.toLowerCase());

    const matchesTag = !options.tag
        || test.tags.includes(options.tag);

    return matchesGrep && matchesTag;
}

function formatDuration(startedAtMs) {
    return `${((Date.now() - startedAtMs) / 1000).toFixed(1)}s`;
}

function tail(text, maxLines = 60) {
    return String(text)
        .trim()
        .split(/\r?\n/)
        .slice(-maxLines)
        .join('\n');
}

function formatError(error) {
    const parts = [];

    if (error?.message) {
        parts.push(error.message);
    } else {
        parts.push(String(error));
    }

    if (error?.stdout?.trim()) {
        parts.push(`STDOUT:\n${tail(error.stdout)}`);
    }

    if (error?.stderr?.trim()) {
        parts.push(`STDERR:\n${tail(error.stderr)}`);
    }

    return parts.join('\n\n');
}

function printTestsList(tests) {
    console.log('Available smoke tests:\n');

    for (const currentTest of tests) {
        const tagsText = currentTest.tags.length > 0
            ? ` [${currentTest.tags.join(', ')}]`
            : '';

        console.log(`- ${currentTest.name}${tagsText}`);
    }
}

await loadTests();

const options = parseArgs(process.argv.slice(2));
const allTests = getTests();
const selectedTests = allTests.filter((currentTest) => matchesFilters(currentTest, options));

if (options.list) {
    printTestsList(selectedTests);
    process.exit(0);
}

if (selectedTests.length === 0) {
    console.error('No smoke tests matched the provided filters.');
    process.exit(1);
}

console.log(`Running ${selectedTests.length} smoke tests...\n`);

const failures = [];

for (const currentTest of selectedTests) {
    const startedAtMs = Date.now();

    process.stdout.write(`→ ${currentTest.name}\n`);

    try {
        await currentTest.run({
            verbose: options.verbose,
            step(message) {
                process.stdout.write(`  ${message}\n`);
            },
        });

        process.stdout.write(`✓ ${currentTest.name} (${formatDuration(startedAtMs)})\n\n`);
    } catch (error) {
        failures.push({
            name: currentTest.name,
            duration: formatDuration(startedAtMs),
            details: formatError(error),
        });

        const shortMessage = error?.message
            ? error.message.split('\n')[0]
            : String(error);

        process.stdout.write(`✗ ${currentTest.name} (${formatDuration(startedAtMs)})\n`);
        process.stdout.write(`  ${shortMessage}\n\n`);

        if (options.bail) {
            break;
        }
    }
}

if (failures.length > 0) {
    console.error('Failures:\n');

    failures.forEach((failure, index) => {
        console.error(`${index + 1}. ${failure.name} (${failure.duration})`);
        console.error(`${failure.details}\n`);
    });

    console.error(`Smoke tests failed: ${failures.length}/${selectedTests.length}`);
    process.exit(1);
}

console.log('-------- All smoke tests passed --------');