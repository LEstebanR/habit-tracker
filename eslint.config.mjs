import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: [
      'prisma/generated/**',
      'lib/generated/**',
      'node_modules/**',
      '.next/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '*.config.mts',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({
    extends: ['prettier'],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
    },
  }),
]

export default eslintConfig
