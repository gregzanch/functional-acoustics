export const readTextFile = ({ element, loaded, error } = {}) => {
    const reader = new FileReader();
    reader.onload = event => loaded(event.target.result);
    reader.onerror = err => error(err);
    reader.readAsText(element.files[0]);
};
