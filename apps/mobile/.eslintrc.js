module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['/*.js', '/*.d.ts'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/destructuring-assignment': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.tsx', '.jsx'] },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': 'off',
    'no-use-before-define': 'off',
  },
};
