module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/recommended",
        'airbnb-base'
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        'no-plusplus': 'off',
        'no-use-before-define': 'off',
        'func-names': 'off',
        "space-before-function-paren": ["error", "never"],
        'vue/html-self-closing': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/no-unused-vars': 'error',
        "vue/max-attributes-per-line": ["error", {
            "singleline": 3,
            "multiline": {
              "max": 3,
              "allowFirstLine": true
            }
        }]
    }
};