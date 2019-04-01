const buffer = (arr, n, fill) => {
    fill = fill || false;
    const N = Math.ceil(arr.length / n);
    if (fill) {
        return (
            Array
                .from(Array(N), (_, i) => arr.slice(i * n, i * n + n))
                .map(x => x.length == n ? x : x.concat(new Array(n - x.length).fill(0)))
        )
    }
    else {
        return (
            Array
            .from(Array(N), (_, i) => arr.slice(i * n, i * n + n))
        )
    }
}
export default buffer;