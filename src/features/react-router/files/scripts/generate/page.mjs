import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROUTER_TYPES_PATH = path.join(
    'src',
    'app',
    'providers',
    'router',
    'types',
    'index.ts',
);

const ROUTER_CONFIG_PATH = path.join(
    'src',
    'app',
    'providers',
    'router',
    'model',
    'config',
    'index.ts',
);

const ROUTER_FILE_PATH = path.join(
    'src',
    'app',
    'providers',
    'router',
    'model',
    'router',
    'index.tsx',
);

const PRERENDER_ROUTES_PATH = 'prerender.routes.mjs';

async function main() {
    const rawPageName = process.argv[2];

    if (!rawPageName) {
        printUsageAndExit();
    }

    const pageSlug = normalizePageSlug(rawPageName);

    if (!pageSlug) {
        fail('Page name cannot be empty.');
    }

    const pageDirPath = path.join(process.cwd(), 'src', 'pages', pageSlug);

    if (await pathExists(pageDirPath)) {
        fail(`Page "${pageSlug}" already exists: ${toRelativeProjectPath(pageDirPath)}`);
    }

    const pageMeta = buildPageMeta(pageSlug);

    await createPageFiles(pageDirPath, pageMeta);

    const autoRegisterResult = await autoRegisterPage(pageMeta);

    console.log(`✔ Page "${pageSlug}" created.`);

    if (autoRegisterResult.status === 'registered') {
        console.log('✔ Route registration updated.');
        return;
    }

    console.log(`ℹ ${autoRegisterResult.message}`);
}

function printUsageAndExit() {
    console.error('Usage: npm run generate:page -- <page-name>');
    console.error('Example: npm run generate:page -- about');
    process.exit(1);
}

function fail(message) {
    console.error(`✖ ${message}`);
    process.exit(1);
}

function normalizePageSlug(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildPageMeta(pageSlug) {
    return {
        pageSlug,
        pageComponentName: toPascalCase(pageSlug),
        pageTitle: toTitleCase(pageSlug),
        routeEnumKey: toScreamingSnake(pageSlug),
    };
}

function toPascalCase(value) {
    return value
        .split('-')
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join('');
}

function toScreamingSnake(value) {
    return value
        .split('-')
        .filter(Boolean)
        .join('_')
        .toUpperCase();
}

function toTitleCase(value) {
    return value
        .split('-')
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');
}

async function createPageFiles(pageDirPath, pageMeta) {
    const { pageComponentName, pageTitle } = pageMeta;

    await mkdir(pageDirPath, {
        recursive: true,
    });

    await writeFile(
        path.join(pageDirPath, 'index.ts'),
        `export { Lazy${pageComponentName} as ${pageComponentName} } from './lazy';\n`,
        'utf8',
    );

    await writeFile(
        path.join(pageDirPath, 'lazy.ts'),
        [
            "import { lazy } from 'react';",
            '',
            `export const Lazy${pageComponentName} = lazy(() => import('./page'));`,
            '',
        ].join('\n'),
        'utf8',
    );

    await writeFile(
        path.join(pageDirPath, 'page.tsx'),
        [
            `function ${pageComponentName}Page() {`,
            '    return (',
            `        <h2>${pageTitle} page</h2>`,
            '    );',
            '}',
            '',
            `export default ${pageComponentName}Page;`,
            '',
        ].join('\n'),
        'utf8',
    );
}

async function autoRegisterPage(pageMeta) {
    const projectRoot = process.cwd();

    const typesFilePath = path.join(projectRoot, ROUTER_TYPES_PATH);
    const configFilePath = path.join(projectRoot, ROUTER_CONFIG_PATH);
    const routerFilePath = path.join(projectRoot, ROUTER_FILE_PATH);
    const prerenderRoutesFilePath = path.join(projectRoot, PRERENDER_ROUTES_PATH);

    const [hasTypesFile, hasConfigFile, hasRouterFile, hasPrerenderRoutesFile] = await Promise.all([
        pathExists(typesFilePath),
        pathExists(configFilePath),
        pathExists(routerFilePath),
        pathExists(prerenderRoutesFilePath),
    ]);

    const updates = [];

    if (hasTypesFile && hasConfigFile && hasRouterFile) {
        await insertRouteEnum(typesFilePath, pageMeta);
        await insertRouteConfig(configFilePath, pageMeta);
        await insertRouteImport(routerFilePath, pageMeta);
        await insertRouteDefinition(routerFilePath, pageMeta);

        updates.push('router');
    }

    if (hasPrerenderRoutesFile) {
        await insertPrerenderRoute(prerenderRoutesFilePath, pageMeta);
        updates.push('prerender');
    }

    if (updates.length === 0) {
        return {
            status: 'skipped',
            message: [
                'Route auto-registration skipped.',
                `Missing files: ${[
                    ROUTER_TYPES_PATH,
                    ROUTER_CONFIG_PATH,
                    ROUTER_FILE_PATH,
                    PRERENDER_ROUTES_PATH,
                ].join(', ')}`,
            ].join(' '),
        };
    }

    return {
        status: 'registered',
        message: `Updated: ${updates.join(', ')}`,
    };
}

async function insertRouteEnum(filepath, pageMeta) {
    await insertBeforeMarkerLine({
        filepath,
        marker: '// @route-enum',
        block: `${pageMeta.routeEnumKey} = '${pageMeta.pageSlug}',`,
    });
}

async function insertRouteConfig(filepath, pageMeta) {
    await insertBeforeMarkerLine({
        filepath,
        marker: '// @route-config',
        block: [
            `[ERoutePath.${pageMeta.routeEnumKey}]: {`,
            `    path: ERoutePath.${pageMeta.routeEnumKey},`,
            `    title: '${pageMeta.pageTitle}',`,
            '},',
        ].join('\n'),
    });
}

async function insertRouteImport(filepath, pageMeta) {
    await insertBeforeMarkerLine({
        filepath,
        marker: '/* @route-imports */',
        block: `import { ${pageMeta.pageComponentName} } from '../../../../../pages/${pageMeta.pageSlug}';`,
    });
}

async function insertRouteDefinition(filepath, pageMeta) {
    await insertBeforeMarkerLine({
        filepath,
        marker: '{/* @route-routes */}',
        block: `<Route path={ERoutePath.${pageMeta.routeEnumKey}} element={<${pageMeta.pageComponentName} />} />`,
    });
}

async function insertPrerenderRoute(filepath, pageMeta) {
    await insertBeforeMarkerLine({
        filepath,
        marker: '// @prerender-routes',
        block: `'/${pageMeta.pageSlug}',`,
    });
}

async function insertBeforeMarkerLine({ filepath, marker, block }) {
    const fileContent = await readFile(filepath, 'utf8');
    const eol = detectEol(fileContent);
    const hadTrailingNewline = /\r?\n$/.test(fileContent);

    const lines = fileContent.split(/\r?\n/);

    if (hadTrailingNewline && lines.at(-1) === '') {
        lines.pop();
    }

    const markerLineIndex = lines.findIndex((line) => line.includes(marker));

    if (markerLineIndex === -1) {
        fail(`Marker "${marker}" not found in ${toRelativeProjectPath(filepath)}`);
    }

    const markerLine = lines[markerLineIndex];
    const baseIndent = getLineIndent(markerLine);
    const normalizedBlock = indentBlock(block, baseIndent);
    const normalizedBlockLines = normalizedBlock.split('\n');

    if (blockAlreadyInserted(lines, normalizedBlockLines)) {
        return;
    }

    lines.splice(markerLineIndex, 0, ...normalizedBlockLines);

    let nextContent = lines.join(eol);

    if (hadTrailingNewline) {
        nextContent += eol;
    }

    await writeFile(filepath, nextContent, 'utf8');
}

function detectEol(content) {
    return content.includes('\r\n') ? '\r\n' : '\n';
}

function getLineIndent(line) {
    const match = line.match(/^\s*/);

    return match ? match[0] : '';
}

function indentBlock(block, baseIndent) {
    const rawLines = block.split('\n');

    return rawLines
        .map((line) => {
            if (!line.trim()) {
                return '';
            }

            const lineIndentSize = countLeadingSpaces(line);
            const relativeIndentLevel = Math.floor(lineIndentSize / 4);
            const relativeIndent = ' '.repeat(relativeIndentLevel * 4);

            return `${baseIndent}${relativeIndent}${line.trimStart()}`;
        })
        .join('\n');
}

function countLeadingSpaces(line) {
    const match = line.match(/^ */);

    return match ? match[0].length : 0;
}

function blockAlreadyInserted(lines, normalizedBlockLines) {
    const comparableLines = normalizedBlockLines.filter((line) => line.trim() !== '');

    if (comparableLines.length === 0) {
        return false;
    }

    for (let index = 0; index <= lines.length - comparableLines.length; index += 1) {
        const currentSlice = lines.slice(index, index + comparableLines.length);

        if (currentSlice.join('\n') === comparableLines.join('\n')) {
            return true;
        }
    }

    return false;
}

async function pathExists(filepath) {
    try {
        await access(filepath);
        return true;
    } catch (_) {
        return false;
    }
}

function toRelativeProjectPath(filepath) {
    return path.relative(process.cwd(), filepath) || '.';
}

main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);

    fail(message);
});