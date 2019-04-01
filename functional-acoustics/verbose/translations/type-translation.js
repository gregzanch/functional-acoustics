import Translations from './translations';

const TypeTranslation = (str) => {
    let _str = str.toLowerCase().replace(/[-_\s\t]+/gmi, '');
    let type = undefined;
    Object.keys(Translations).forEach(key => {
        Translations[key].forEach(translation => {
            if (_str === translation) {
                type = key;
            }
        })
    });
    return type;
}

export default TypeTranslation;