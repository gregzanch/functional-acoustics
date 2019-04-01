const WeightTranslation = (str) => {
    const z = ["unweighted", 'notweighted', "flat", "none", "not", "notweighted", 'noweighting', 'uncorrected'];

    const regex = /^(a|b|c|d|z)$|(?:^(?:db[-\s_\.\(]*)(a|b|c|d|z)[\)]*$)|(?:^(a|b|c|d|z)[-\s_\.]*weight(?:ed)?(?:ing)?$)/gmi;

    const subst = `\$1\$2\$3`;

    if (str.match(regex)) {
        return str.replace(regex, subst).toLowerCase();
    } else if (z.filter(
            verbose => verbose === str.replace(/[\s\t\-\_]+/gmi, '').toLowerCase()).length != 0) {
        return 'z';
    } else {
        const err = 'could not figure out what you meant by \'' + str + '\'';
        console.error(err);
        return null;
    }
}

export default WeightTranslation;