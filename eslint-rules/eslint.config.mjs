import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname
})

const eslintConfig = [
    ...compat.plugins(...['eslint-plugin-check-file']),
    ...compat.plugins(...['eslint-plugin-import']),
    ...compat.plugins(...['eslint-plugin-react']),
    ...compat.plugins(...['eslint-plugin-react-hooks']),
    ...compat.extends('airbnb-base', 'prettier'),
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
