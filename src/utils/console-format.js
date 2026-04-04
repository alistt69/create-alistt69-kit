const color = (code, text) => `\u001B[${code}m${text}\u001B[0m`;

export const format = {
    cyan: (text) => color('36', text),
    green: (text) => color('32', text),
    yellow: (text) => color('33', text),
    dim: (text) => color('2', text),
    bold: (text) => color('1', text),

    sectionTitle: (text) => color('36', text),
    label: (text) => color('2', text),
};