import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import pluginCypress from 'eslint-plugin-cypress/flat';
import importPlugin from 'eslint-plugin-import';

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

    ...pluginVue.configs['flat/recommended'],
    ...pluginVue.configs['flat/strongly-recommended'],
    ...pluginVue.configs['flat/essential'],
    ...compat.extends('plugin:vue-pug/vue3-recommended'),

    // This block has be before the recommendedTypeChecked
    // configuration!
    {
        plugins: {
            import: importPlugin,
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
    },
    // For some rules it is important to use the recommendedTypeChecked
    // configuration. It is slower that but than the normal configuration
    // but allows stricter rulesets.
    ...vueTsEslintConfig({ extends: ['recommendedTypeChecked'] }),

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
];
