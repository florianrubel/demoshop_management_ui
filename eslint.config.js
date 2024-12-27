import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import pluginCypress from 'eslint-plugin-cypress/flat';
import importPlugin from 'eslint-plugin-import';
import typescriptEslintParser from '@typescript-eslint/parser';

import javascriptRules from './src/sharedLib/eslintRulesets/javascript.js';
import typescriptRules from './src/sharedLib/eslintRulesets/typescript.js';
import vueRules from './src/sharedLib/eslintRulesets/vue.js';

const __filename = fileURLToPath(import.meta.url); // I think these two are only needed for Vite based projects
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
    },

    {
        name: 'app/files-to-ignore',
        ignores: [
            '**/dist/**',
            '**/dist-ssr/**',
            '**/coverage/**',
            '**/sharedLib/**',
            'eslint.config.js',
        ],
    },

    ...pluginVue.configs['flat/essential'],
    ...compat.extends('plugin:vue-pug/vue3-recommended'),
    ...vueTsEslintConfig(),

    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/*'],
    },

    {
        ...pluginCypress.configs.recommended,
        files: [
            'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/support/**/*.{js,ts,jsx,tsx}',
        ],
    },

    {
        plugins: {
            import: importPlugin, // Register the import plugin
        },
        rules: {
            ...javascriptRules,
            ...typescriptRules,
            ...vueRules,
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.ts', '.js', '.tsx', '.json', '.vue'],
                },
                alias: {
                    map: [
                        ['~', './src'],
                        ['~api', './src/sharedLib/api/src'],
                    ],
                    extensions: ['.ts', '.js', '.tsx', '.json', '.vue'],
                },
            },
        },
        // This is required for some typescript rules
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
    },
];
