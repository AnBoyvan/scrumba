import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPrettier from 'eslint-plugin-prettier';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint).Linter.FlatConfig[]} */
export default [
	{
		plugins: {
			react: eslintReact,
			'react-hooks': eslintReactHooks,
			prettier: eslintPrettier,
		},
	},
	{
		ignores: ['node_modules', '.next/*'],
	},
	...ts.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				...globals.es2021,
			},
			parser: ts.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		rules: {
			...eslintConfigPrettier.rules,
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
				{
					plugins: [
						'prettier-plugin-tailwindcss',
						'@trivago/prettier-plugin-sort-imports',
					],
				},
			],

			'import/order': 'off',
			'no-console': 'warn',
			'no-var': 'off',
			'no-empty-pattern': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'react/display-name': 'off',
			'react/react-in-jsx-scope': 'off',
			'@next/next/no-img-element': 'off',
		},
	},
];
