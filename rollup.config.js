
import resolve from 'rollup-plugin-node-resolve'
export default {
    input: 'functional-acoustics/functional-acoustics.js',
    output: {
        file: 'functional-acoustics.js',
        format: 'umd',
        name: 'functional-acoustics',
        globals: {
            "mathjs": 'math',
            "fast-sort": 'sort'
        }
    },
    external: ['mathjs', 'fast-sort'],
    plugins: [resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json'],
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    })]
};