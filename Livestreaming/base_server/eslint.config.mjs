// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

// export default tseslint.config({
//     languageOptions: {
//         parserOptions: {
//             project: true,
//             tsconfigRootDir: import.meta.dirname
//         }
//     },
//     files: ['**/*.ts'],
//     extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, eslintConfigPrettier],
//     rules: {
//         // "no-console": "error",
//         'no-useless-catch': 0,
//         quotes: ['error', 'single', { allowTemplateLiterals: true }]
//     }
// })
export default tseslint.config({
    languageOptions: {
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, eslintConfigPrettier],
    rules: {
        'no-useless-catch': 0,
        quotes: ['error', 'single', { allowTemplateLiterals: true }],

        // Disable or set to warning level for other rules
        '@typescript-eslint/no-unsafe-assignment': 'off', // or 'off'
        '@typescript-eslint/no-unsafe-argument': 'off', // or 'off'
        '@typescript-eslint/no-unsafe-member-access': 'off', // or 'off'
        '@typescript-eslint/require-await': 'off', // or 'off'
        '@typescript-eslint/no-floating-promises': 'off', // or 'off'
        '@typescript-eslint/no-misused-promises': 'off' // or 'off'
    }
})
