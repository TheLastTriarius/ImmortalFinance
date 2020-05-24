module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      webpack: {
        "config": "config/webpack.common.js"
      },
      node: {
        "moduleDirectory": ["node_modules"]
      },
      typescript: {
        "alwaysTryTypes": true
      }
    }
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    'react/prop-types': 0
  }
}
