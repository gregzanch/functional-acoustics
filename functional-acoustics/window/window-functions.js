const hann = (n, N) => Math.pow(Math.sin(Math.PI * n / (N-1)), 2)

export function Hann(N) {
    return Object.keys(Array(N).fill(0)).map(x => hann(Number(x), N));
}