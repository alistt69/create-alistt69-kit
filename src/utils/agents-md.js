import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const AGENTS_MD_PATH = 'AGENTS.md';
const SECTIONS_MARKER = '<!-- @agents-sections -->';

export function getAgentsMdPath(projectPath) {
    return resolve(projectPath, AGENTS_MD_PATH);
}

export async function hasAgentsMd(projectPath) {
    try {
        await access(getAgentsMdPath(projectPath));
        return true;
    } catch (_) {
        return false;
    }
}

export async function appendAgentsSection(projectPath, sectionKey, content) {
    if (!(await hasAgentsMd(projectPath))) {
        return false;
    }

    const filepath = getAgentsMdPath(projectPath);
    const fileContent = await readFile(filepath, 'utf8');

    if (fileContent.includes(`<!-- @agents:${sectionKey} -->`)) {
        return false;
    }

    const block = [
        `<!-- @agents:${sectionKey} -->`,
        content.trim(),
        `<!-- /@agents:${sectionKey} -->`,
    ].join('\n');

    let nextContent;

    if (fileContent.includes(SECTIONS_MARKER)) {
        nextContent = fileContent.replace(
            SECTIONS_MARKER,
            `${block}\n\n${SECTIONS_MARKER}`,
        );
    } else {
        const trimmed = fileContent.trimEnd();
        nextContent = `${trimmed}\n\n${block}\n`;
    }

    await writeFile(filepath, nextContent, 'utf8');

    return true;
}