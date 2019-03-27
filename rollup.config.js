
// import resolve from 'rollup-plugin-node-resolve'
export default {
    input: 'functional-acoustics/functional-acoustics.js',
    output: {
        file: 'functional-acoustics.js',
        format: 'umd',
        name: 'AC'
    }
    // plugins: [resolve({
    //     extensions: ['.mjs', '.js', '.jsx', '.json'],
    //     customResolveOptions: {
    //         moduleDirectory: 'node_modules'
    //     }
    // })]
};