module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    __: true,
  },
  extends: 'airbnb-base',
  env: {
    browser: true,
    node: true,
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-multi-spaces': [1, {
      'exceptions': {
          'ImportDeclaration': true
      }
    }],
    'no-underscore-dangle': 0,
    'dot-notation': 0,
  }
};
