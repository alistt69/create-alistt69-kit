export function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

export function assertIncludes(text, expected, message) {
    if (!String(text).includes(expected)) {
        throw new Error(message ?? `Expected text to include: ${expected}`);
    }
}

export function assertNotIncludes(text, unexpected, message) {
    if (String(text).includes(unexpected)) {
        throw new Error(message ?? `Expected text not to include: ${unexpected}`);
    }
}