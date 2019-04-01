import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'functional-acoustics/units/convert-units/lib/index.js',
    output: {
        file: 'functional-acoustics/units/convert.js',
        format: 'es',
        name: 'convert'
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};