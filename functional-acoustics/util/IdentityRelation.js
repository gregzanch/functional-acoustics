class IdentityRelation {
    constructor(symbols) {
        this.symbols = symbols;
        this.exp = [];
    }
    invert(exp) {
        return exp.map(x => -1 * x)
    }
    addRelation(exp) {
        if (exp.length == this.symbols.length) {
            this.exp.push(exp);
        }
    }
    compare(m, n) {
        return this.exp[m].map((x, i) => ((x == this.exp[n][i]) && x != 0) ? 0 : -1 * this.exp[n][i] + x);
    }
    compareAll() {
        const _exp = [];
        const N = this.exp.length;
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                _exp.push(this.compare(i, j));
            }
        }
        return _exp;
    }
    latexify(exp) {
        const kvp = exp.map((x, i) => {
            return {
                exp: x,
                symbol: this.symbols[i]
            }
        });
        const numerators = kvp.filter(x => x.exp > 0).map(x => {
            if (Math.abs(x.exp) > 1) {
                return `${x.symbol}^{${Math.abs(x.exp)}}`
            } else {
                return `${x.symbol}`
            }
        }).join(' ');
        const denominators = kvp.filter(x => x.exp < 0).map(x => {
            if (Math.abs(x.exp) > 1) {
                return `${x.symbol}^{${Math.abs(x.exp)}}`
            } else {
                return `${x.symbol}`
            }
        }).join(' ');

        return "\\" + `frac{${numerators}}{${denominators}}`;
    }
}

const E = new IdentityRelation(["Q", "L", "C", "\\omega", "R", "2\\pi", "B", "f"]);
const relations = [
    [+0, +1, +1, +2, +0, +0, +0, +0],
    [+0, +0, +1, +2, +1, -1, -1, +0],
    [+1, +0, +0, +0, +0, +0, +1, -1],
    [+0, +1, +0, +0, -1, +1, +1, +0],
    [-1, +1, +0, +0, -1, +1, +0, +1],
    [+0, +0, +0, -1, +0, +1, +0, +1],
    [-1, +1, +0, +1, -1, +0, +0, +0]
];

relations.forEach(x => {
    E.addRelation(x)
});

const comparisons = E.compareAll();

console.log(E.latexify(comparisons[0]));
