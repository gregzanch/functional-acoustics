const RMS = (samples) => Math.sqrt(samples.map(p => p * p).reduce((a, b) => a + b) / samples.length)

export default RMS