module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "object-shorthand": 0,
        "no-underscore-dangle": 0,
        "prefer-template": 1,
        "comma-dangle": [1, {
            "functions": "ignore",
            "objects": "always-multiline"
        }],
        "no-unused-vars": [2, { "args": "none" }],
        "class-methods-use-this": 1,
        /* "dot-notation": 1,
        "no-param-reassign": [2, { "props": false }],
        "no-unused-expressions": 1,
        "react/sort-comp": 0, */
        "no-else-return": 0,
        "jsx-a11y/label-has-for": [ 2, {
            "components": [ "Label" ],
            "required": {
                "every": ["id" ]
            },
            "allowChildren": false,
        }],
        "import/no-extraneous-dependencies": [0, {"devDependencies": ["**/*.test.js", "**/*.spec.js", "test/*"]}]
    }
};