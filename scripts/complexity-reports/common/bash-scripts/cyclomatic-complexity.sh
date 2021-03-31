echo 'Calculating the cyclomatic complexity for the source code ...'

node_modules/eslint/bin/eslint.js  --rulesdir=build/eslint-rules/ --rule 'complexity: ["error", 0]' "src/**/*[^spec].js" "src/**/*[^spec].jsx" -f compact > $1/src-complexity.txt

echo 'Calculating the cyclomatic complexity for the spec files ...'

node_modules/eslint/bin/eslint.js  --rulesdir=build/eslint-rules/ --rule 'complexity: ["error", 0]' "src/**/*.spec.js" "src/**/*.spec.jsx" -f compact > $1/tests-complexity.txt
