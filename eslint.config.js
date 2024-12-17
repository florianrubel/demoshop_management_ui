import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import pluginCypress from 'eslint-plugin-cypress/flat'

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
    },

    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    },

    ...pluginVue.configs['flat/essential'],
    ...vueTsEslintConfig(),

    {
        ...pluginVitest.configs.recommended,
        files: ['src/**/__tests__/*'],
    },

    {
        ...pluginCypress.configs.recommended,
        files: [
            'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
            'cypress/support/**/*.{js,ts,jsx,tsx}'
        ],
    },

    {
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'vue/no-v-html': 'error',
            indent: ['error', 4],
            'max-len': ['warn', 200],
            'vue/max-len': ['warn', 200],
            'vue/html-indent': ['error', 4, {
                baseIndent: 0,
            }],
            'vue/multi-word-component-names': 'off',
            'vuejs-accessibility/label-has-for': 'off',
            'vuejs-accessibility/no-autofocus': 'off',
            // 'import/extensions': [
            //     'error',
            //     'ignorePackages',
            //     {
            //         ts: 'never',
            //         tsx: 'never',
            //     },
            // ],
            'vuejs-accessibility/form-control-has-label': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error', // or "error"
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'vue/singleline-html-element-content-newline': 'off',
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.ts', '.js', '.tsx', '.json', '.vue'],
                },
                alias: {
                    map: [
                        ['~', './src'],
                    ],
                    extensions: ['.ts', '.js', '.tsx', '.json', '.vue'],
                },
            },
        },
    }
]
