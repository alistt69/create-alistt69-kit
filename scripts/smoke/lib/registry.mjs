const tests = [];

export function defineTest(name, optionsOrRun, maybeRun) {
    let options = {};
    let run = maybeRun;

    if (typeof optionsOrRun === 'function') {
        run = optionsOrRun;
    } else if (Array.isArray(optionsOrRun)) {
        options = { tags: optionsOrRun };
    } else {
        options = optionsOrRun ?? {};
    }

    if (typeof run !== 'function') {
        throw new TypeError(`Test "${name}" must have a run function`);
    }

    tests.push({
        name,
        tags: options.tags ?? [],
        run,
    });
}

export function getTests() {
    return [...tests];
}