import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unused from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    {
        ignores: ['**/dist', '**/node_modules', '**/build', 'webpack.config.ts'],
    },

    // TS base + parser
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic, // TS-стилистика
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { sourceType: 'module' },
        },
    },

    // Глобальные стилевые правила (замена prettier)
    stylistic.configs['recommended'],

    // Реакт / импорты / утиль
    {
        plugins: {
            react,
            'react-hooks': reactHooks,
            '@stylistic': stylistic,
            import: importPlugin,
            'unused-imports': unused,
        },
        settings: { react: { version: 'detect' } },
        rules: {
            // ==== БАЗОВОЕ ФОРМАТИРОВАНИЕ (как prettier) ====
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/eol-last': ['error', 'always'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/quote-props': ['error', 'as-needed', { keywords: false }],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: { delimiter: 'semi', requireLast: true },
                singleline: { delimiter: 'semi', requireLast: false },
            }],
            // запрет однострочного return (<JSX/>)
            // (через строгую трактовку лишних скобок вокруг однострочного выражения)
            '@stylistic/no-extra-parens': 'off',
            '@stylistic/jsx-indent-props': 'off',
            '@stylistic/multiline-ternary': 'off',

            // Пустые строки/пробелы
            'no-trailing-spaces': ['warn', { skipBlankLines: false }],
            'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
            'comma-style': ['error', 'last'],
            'max-len': ['error', {
                code: 120,
                tabWidth: 4,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreComments: false,
                ignoreTemplateLiterals: true,
            }],

            // Импорты
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': ['warn', {
                args: 'after-used',
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
            'import/order': ['error', {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
                pathGroups: [
                    { pattern: '@/**', group: 'internal', position: 'after' },
                    { pattern: '@app/**', group: 'internal', position: 'after' },
                    { pattern: '@pages/**', group: 'internal', position: 'after' },
                    { pattern: '@widgets/**', group: 'internal', position: 'after' },
                    { pattern: '@features/**', group: 'internal', position: 'after' },
                    { pattern: '@entities/**', group: 'internal', position: 'after' },
                    { pattern: '@shared/**', group: 'internal', position: 'after' },
                ],
                pathGroupsExcludedImportTypes: ['builtin', 'external'],
                'newlines-between': 'never',
                alphabetize: { order: 'asc', caseInsensitive: true },
            }],

            // React / JSX
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react/prop-types': 'off',

            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
            'react/jsx-equals-spacing': ['error', 'never'],
            'react/jsx-tag-spacing': ['error', {
                closingSlash: 'never',
                beforeSelfClosing: 'always',
                afterOpening: 'never',
                beforeClosing: 'never',
            }],
            'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
            'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
            'react/jsx-closing-bracket-location': ['error', 'line-aligned'],

            // Прочее
            '@typescript-eslint/no-unused-vars': 'off', // перекрываем unused-imports
            'no-console': ['warn', { allow: ['error'] }],
            'no-restricted-imports': ['error', {
                name: 'react',
                importNames: ['default'],
                message: 'React импортировать не надо (v17+). Удалите import React from "react".',
            }],
        },
    },
];
