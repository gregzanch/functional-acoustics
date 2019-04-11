export function BladePassageFrequency({ N, R, n }) {
    return n * N * R / 60;
}
/**
 * @param  {} n
 * @param  {} Ns
 * @param  {} Nb
 * @param  {} R
 * @param  {} k GCF
 */
export function StrutFrequency({ n, Ns, Nb, R, k }) {
    return n * Ns * Nb * R / (60 * k);
}