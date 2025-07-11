module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
