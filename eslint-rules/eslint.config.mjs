/* eslint-disable */
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import stylistic from '@stylistic/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname
})

const eslintConfig = [
    stylistic.configs['recommended-flat'],
    ...compat.plugins(...['eslint-plugin-check-file']),
    ...compat.plugins(...['eslint-plugin-import']),
    ...compat.plugins(...['eslint-plugin-react']),
    ...compat.extends('airbnb-base', 'prettier'),
    ...pluginQuery.configs['flat/recommended'],
    {
        ignores: ['eslint.config.mjs']
    },
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    },
]

export default eslintConfig
