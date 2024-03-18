module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['plugin:@docusaurus/recommended', 'plugin:mdx/recommended', 'eslint-config-prettier'],
    settings: {
        'mdx/code-blocks': true,
        'mdx/language-mapper': {},
    },
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            files: '*.mdx',
            extends: 'plugin:mdx/recommended',
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['react', 'eslint-plugin-prettier', '@docusaurus', '@typescript-eslint'],
    rules: {
        '@docusaurus/no-untranslated-text': ['warn', { ignoredStrings: ['·', '—', '×'] }],
        '@docusaurus/string-literal-i18n-messages': 'error',
    },
}
