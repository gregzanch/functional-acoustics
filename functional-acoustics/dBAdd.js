const dBAdd = (dBs) => {
    let tentothe = dBs.map(dB => Math.pow(10, dB / 10));
    let sum = 0;
    tentothe.forEach(val => {
        sum += val;
    });
    return 10 * Math.log10(sum);
}
export default dBAdd;