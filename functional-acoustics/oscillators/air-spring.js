export function AirSpring({ fn, Patm, m, gamma, S, h, k, V }) {
    if (gamma && Patm && S && m && h) {
        return (1 / (Math.PI * 2)) * Math.sqrt((gamma * Patm * S) / (m * h));
    }
}