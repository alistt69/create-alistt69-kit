import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import handler from 'serve-handler';
import puppeteer from 'puppeteer';

import getPrerenderRoutes from '../prerender.routes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const buildDir = path.join(projectRoot, 'build');

const routesRaw = await getPrerenderRoutes();
const routes = normalizeRoutes(routesRaw);

if (routes.length === 0) {
    throw new Error('No prerender routes provided in prerender.routes.mjs');
}

const rewrites = routes.map((route) => ({
    source: route,
    destination: '/index.html',
}));

const server = http.createServer((request, response) => (
    handler(request, response, {
        public: buildDir,
        rewrites,
    })
));

await new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', resolvePromise);
});

const address = server.address();

if (!address || typeof address === 'string') {
    throw new Error('Failed to start local prerender server');
}

const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await puppeteer.launch({
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
    ],
});

try {
    for (const route of routes) {
        const page = await browser.newPage();

        await page.goto(`${baseUrl}${route}`, {
            waitUntil: 'domcontentloaded',
        });

        await page.waitForSelector('#root', { timeout: 15000 });

        await page.waitForNetworkIdle({
            idleTime: 500,
            timeout: 15000,
        }).catch(() => {});

        await page.waitForFunction(
            () => globalThis.window?.__PRERENDER_READY__ !== false,
            { timeout: 3000 },
        ).catch(() => {});

        const html = `<!DOCTYPE html>\n${await page.content()}`;
        const targetFilePath = getTargetHtmlPath(buildDir, route);

        await fs.mkdir(path.dirname(targetFilePath), { recursive: true });
        await fs.writeFile(targetFilePath, html, 'utf8');

        await page.close();

        console.log(`✔ prerendered ${route} -> ${path.relative(projectRoot, targetFilePath)}`);
    }
} finally {
    await browser.close();
    server.close();
}

function normalizeRoutes(routes) {
    if (!Array.isArray(routes)) {
        throw new TypeError('prerender.routes.mjs must return an array of routes');
    }

    return [...new Set(
        routes
            .map((route) => String(route).trim())
            .filter(Boolean)
            .map((route) => {
                if (route === '/') {
                    return '/';
                }

                return `/${route.replace(/^\/+|\/+$/g, '')}`;
            }),
    )];
}

function getTargetHtmlPath(outputDir, route) {
    if (route === '/') {
        return path.join(outputDir, 'index.html');
    }

    return path.join(outputDir, route.slice(1), 'index.html');
}