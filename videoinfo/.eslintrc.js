
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:prettier/recommended"
    ],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": "error"
    },
    env: {
        es6: true,
        browser: true,
        node: true
    }
};
