/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss'],
    rules: {
        'scss/no-global-function-names': null,
        'selector-class-pattern': [
            '^[a-z][a-z0-9-_]*$',
            {
                message: 'Class names should be lowercase and can include numbers, hyphens, and underscores.',
            },
        ],
        'at-rule-empty-line-before': null,
    },
};