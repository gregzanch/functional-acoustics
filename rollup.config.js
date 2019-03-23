
import resolve from 'rollup-plugin-node-resolve'
export default {
    input: 'functional-acoustics/functional-acoustics.js',
    output: {
        file: 'functional-acoustics.js',
        format: 'umd',
        name: 'functional-acoustics',
    },
    external: ['mathjs', 'fast-sort'],
    plugins: [resolve({
        customResolveOptions: {
            moduleDirectory: 'node_modules'
        }
    })]
};