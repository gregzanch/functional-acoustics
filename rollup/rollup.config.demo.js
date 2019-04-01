// rollup.config.js
import json from 'rollup-plugin-json';

export default {
    input: 'functional-acoustics/functional-acoustics.js',
    output: {
        file: 'demo/functional-acoustics.js',
        format: 'es',
        name: 'AC'
    },

    plugins: [
        json({
            exclude: ['node_modules/**'],

            // for tree-shaking, properties will be declared as
            // variables, using either `var` or `const`
            preferConst: true, // Default: false

            // specify indentation for the generated default export —
            // defaults to '\t'
            indent: '  ',

            // ignores indent and generates the smallest code
            compact: true, // Default: false

            // generate a named export for every property of the JSON object
            namedExports: true // Default: true
        })
    ]
};