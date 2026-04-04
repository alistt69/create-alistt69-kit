import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';

const rootDir = process.cwd();
const cliEntryPath = path.resolve(rootDir, 'bin', 'index.js');

const tests = [];
let failedCount = 0;

function test(name, run) {
    tests.push({ name, run });
}

function logStep(message) {
    console.log(`  ${message}`);
}

async function pathExists(targetPath) {
    try {
        await access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function readJson(filePath) {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
}

async function readText(filePath) {
    return readFile(filePath, 'utf8');
}

function assertIncludes(text, expected, message) {
    if (!text.includes(expected)) {
        throw new Error(message ?? `Expected text to include: ${expected}`);
    }
}

function assertNotIncludes(text, unexpected, message) {
    if (text.includes(unexpected)) {
        throw new Error(message ?? `Expected text not to include: ${unexpected}`);
    }
}

async function runCommand(command, args, options = {}) {
    return new Promise((resolvePromise, rejectPromise) => {
        const child = spawn(command, args, {
            cwd: options.cwd ?? rootDir,
            env: {
                ...process.env,
                ...options.env,
            },
            stdio: options.stdio ?? 'pipe',
            shell: process.platform === 'win32',
        });

        let stdout = '';
        let stderr = '';

        if (child.stdout) {
            child.stdout.on('data', (chunk) => {
                stdout += String(chunk);
            });
        }

        if (child.stderr) {
            child.stderr.on('data', (chunk) => {
                stderr += String(chunk);
            });
        }

        child.on('error', (error) => {
            rejectPromise(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolvePromise({ stdout, stderr, code });
                return;
            }

            const error = new Error(
                [
                    `Command failed: ${command} ${args.join(' ')}`,
                    `Exit code: ${code}`,
                    stdout ? `STDOUT:\n${stdout}` : '',
                    stderr ? `STDERR:\n${stderr}` : '',
                ].filter(Boolean).join('\n\n'),
            );

            rejectPromise(error);
        });
    });
}

async function runCli(args, options = {}) {
    return runCommand('node', [cliEntryPath, ...args], options);
}

async function createTempWorkspace() {
    return mkdtemp(path.join(os.tmpdir(), 'alistt69-kit-smoke-'));
}

async function assertFileExists(targetPath) {
    const exists = await pathExists(targetPath);

    if (!exists) {
        throw new Error(`Expected file to exist: ${targetPath}`);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function runNpmBuild(projectPath) {
    await runCommand('npm', ['run', 'build'], {
        cwd: projectPath,
        stdio: 'inherit',
    });
}

test('base only + install + build', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'base-only-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        logStep('creating project');
        await runCli([projectName, '--features=', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        await assertFileExists(path.join(projectPath, 'package.json'));
        await assertFileExists(path.join(projectPath, 'src'));

        const packageJson = await readJson(path.join(projectPath, 'package.json'));

        assert(!packageJson.devDependencies?.eslint, 'eslint should not be installed in base-only case');
        assert(!packageJson.dependencies?.['react-router-dom'], 'react-router-dom should not be installed in base-only case');

        const readme = await readText(path.join(projectPath, 'README.md'));

        assertIncludes(readme, '# base-only-app', 'README should contain project title');
        assertIncludes(readme, 'Created with `create-alistt69-kit`.', 'README should contain generator info');

        assertIncludes(readme, '`npm run start`', 'README should contain start script');
        assertIncludes(readme, '`npm run build`', 'README should contain build script');
        assertIncludes(readme, '`npm run typecheck`', 'README should contain typecheck script');

        assertNotIncludes(readme, '`npm run lint`', 'README should not contain eslint scripts in base-only case');
        assertNotIncludes(readme, '`npm run lint:styles`', 'README should not contain stylelint scripts in base-only case');

        logStep('building project');
        await runNpmBuild(projectPath);
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('all features + install + build', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'all-features-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        logStep('creating project');
        await runCli([projectName, '--features=all', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        const packageJson = await readJson(path.join(projectPath, 'package.json'));

        assert(packageJson.devDependencies?.eslint, 'eslint should be installed');
        assert(packageJson.devDependencies?.stylelint, 'stylelint should be installed');
        assert(packageJson.devDependencies?.autoprefixer, 'autoprefixer should be installed');
        assert(packageJson.dependencies?.['react-router-dom'], 'react-router-dom should be installed');

        await assertFileExists(path.join(projectPath, 'eslint.config.mjs'));
        await assertFileExists(path.join(projectPath, 'stylelint.config.mjs'));
        await assertFileExists(path.join(projectPath, 'postcss.config.cjs'));
        await assertFileExists(path.join(projectPath, 'src', 'app', 'providers', 'router', 'config', 'router.tsx'));

        const readme = await readText(path.join(projectPath, 'README.md'));

        assertIncludes(readme, '- ESLint + Stylistic', 'README should list eslint feature');
        assertIncludes(readme, '- Stylelint', 'README should list stylelint feature');
        assertIncludes(readme, '- Autoprefixer', 'README should list autoprefixer feature');
        assertIncludes(readme, '- React Router DOM', 'README should list router feature');

        assertIncludes(readme, '`npm run lint`', 'README should contain eslint script');
        assertIncludes(readme, '`npm run lint:fix`', 'README should contain eslint autofix script');
        assertIncludes(readme, '`npm run lint:styles`', 'README should contain stylelint script');
        assertIncludes(readme, '`npm run lint:styles:fix`', 'README should contain stylelint autofix script');

        logStep('building project');
        await runNpmBuild(projectPath);
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('eslint only', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'eslint-only-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await runCli([projectName, '--features=eslint', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        const packageJson = await readJson(path.join(projectPath, 'package.json'));

        assert(packageJson.devDependencies?.eslint, 'eslint should be installed');
        assert(!packageJson.devDependencies?.stylelint, 'stylelint should not be installed');
        assert(!packageJson.devDependencies?.autoprefixer, 'autoprefixer should not be installed');
        assert(!packageJson.dependencies?.['react-router-dom'], 'react-router-dom should not be installed');

        const readme = await readText(path.join(projectPath, 'README.md'));

        assertIncludes(readme, '- ESLint + Stylistic', 'README should list eslint feature');
        assertIncludes(readme, '`npm run lint`', 'README should contain eslint script');
        assertIncludes(readme, '`npm run lint:fix`', 'README should contain eslint autofix script');

        assertNotIncludes(readme, '`npm run lint:styles`', 'README should not contain stylelint scripts');
        assertNotIncludes(readme, '- Stylelint', 'README should not list stylelint feature');

        await assertFileExists(path.join(projectPath, 'eslint.config.mjs'));
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('stylelint only', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'stylelint-only-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await runCli([projectName, '--features=stylelint', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        const packageJson = await readJson(path.join(projectPath, 'package.json'));

        assert(packageJson.devDependencies?.stylelint, 'stylelint should be installed');
        assert(!packageJson.devDependencies?.eslint, 'eslint should not be installed');

        const readme = await readText(path.join(projectPath, 'README.md'));

        assertIncludes(readme, '- Stylelint', 'README should list stylelint feature');
        assertIncludes(readme, '`npm run lint:styles`', 'README should contain stylelint script');
        assertIncludes(readme, '`npm run lint:styles:fix`', 'README should contain stylelint autofix script');

        assertNotIncludes(readme, '`npm run lint`', 'README should not contain eslint scripts');
        assertNotIncludes(readme, '- ESLint + Stylistic', 'README should not list eslint feature');

        await assertFileExists(path.join(projectPath, 'stylelint.config.mjs'));
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('react-router only', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'router-only-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await runCli([projectName, '--features=react-router', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        const packageJson = await readJson(path.join(projectPath, 'package.json'));

        assert(packageJson.dependencies?.['react-router-dom'], 'react-router-dom should be installed');

        const readme = await readText(path.join(projectPath, 'README.md'));

        assertIncludes(readme, '- React Router DOM', 'README should list router feature');
        assertNotIncludes(readme, '`npm run lint`', 'README should not contain eslint scripts');
        assertNotIncludes(readme, '`npm run lint:styles`', 'README should not contain stylelint scripts');

        await assertFileExists(path.join(projectPath, 'src', 'app', 'providers', 'router', 'config', 'router.tsx'));
        await assertFileExists(path.join(projectPath, 'src', 'pages', 'main', 'page.tsx'));
        await assertFileExists(path.join(projectPath, 'src', 'pages', 'error', 'page.tsx'));
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('--no-install', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'no-install-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await runCli([projectName, '--features=all', '--no-install', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        await assertFileExists(path.join(projectPath, 'package.json'));

        const nodeModulesExists = await pathExists(path.join(projectPath, 'node_modules'));

        assert(!nodeModulesExists, 'node_modules should not exist when using --no-install');
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('existing dir + --yes => fail', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'existing-dir-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await mkdir(projectPath, { recursive: true });
        await writeFile(path.join(projectPath, 'keep.txt'), 'hello', 'utf8');

        let failedAsExpected = false;

        try {
            await runCli([projectName, '--yes'], {
                cwd: workspacePath,
            });
        } catch (error) {
            failedAsExpected = String(error.message).includes('Use --force to overwrite it');
        }

        assert(failedAsExpected, 'command should fail without --force for non-empty existing dir');
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('existing dir + --yes --force => overwrite', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'force-overwrite-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await mkdir(projectPath, { recursive: true });
        await writeFile(path.join(projectPath, 'old.txt'), 'old data', 'utf8');

        await runCli([projectName, '--yes', '--force', '--no-install'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        const oldFileExists = await pathExists(path.join(projectPath, 'old.txt'));

        assert(!oldFileExists, 'old file should be removed after --force overwrite');
        await assertFileExists(path.join(projectPath, 'package.json'));
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

test('README uses selected package manager commands', async () => {
    const workspacePath = await createTempWorkspace();
    const projectName = 'pm-readme-app';
    const projectPath = path.join(workspacePath, projectName);

    try {
        await runCli([projectName, '--features=eslint,stylelint', '--pm=pnpm', '--no-install', '--yes'], {
            cwd: workspacePath,
            stdio: 'inherit',
        });

        const readme = await readText(path.join(projectPath, 'README.md'));

        assertIncludes(readme, '`pnpm start`', 'README should use pnpm for start');
        assertIncludes(readme, '`pnpm build`', 'README should use pnpm for build');
        assertIncludes(readme, '`pnpm lint`', 'README should use pnpm for eslint');
        assertIncludes(readme, '`pnpm lint:styles`', 'README should use pnpm for stylelint');

        assertNotIncludes(readme, '`npm run lint`', 'README should not use npm commands when pnpm is selected');
    } finally {
        await rm(workspacePath, { recursive: true, force: true });
    }
});

async function main() {
    console.log(`Running ${tests.length} smoke tests...\n`);

    for (const currentTest of tests) {
        process.stdout.write(`→ ${currentTest.name}\n`);

        try {
            await currentTest.run();
            process.stdout.write(`✓ ${currentTest.name}\n\n`);
        } catch (error) {
            failedCount += 1;
            process.stdout.write(`✗ ${currentTest.name}\n`);
            console.error(error);
            process.stdout.write('\n');
        }
    }

    if (failedCount > 0) {
        console.error(`Smoke tests failed: ${failedCount}`);
        process.exit(1);
    }

    console.log('-------- All smoke tests passed --------');
}

await main();