module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "node": true,
      "jquery": true
  },
  "extends": "airbnb-base",
  "plugins": [ "import", "html" ],
  "rules": {
      // 0 "off", 1 "warn" 2 "error"
      "no-console": 0,
      "no-plusplus": 0,
      "no-var": 0,
      "var-on-top": 0,
      "quotes": [ 2, "single" ],
      "no-underscore-dangle": 1,
      "comma-dangle": [ 2, "never"],
      "no-return-assign": [1, "always"]
  }
};