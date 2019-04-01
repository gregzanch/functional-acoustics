import clamp from './clamp';

const ID = {
    Generate: (len) => {
        return Math.round((Math.random() * 1e15)).toString(16).slice(0, clamp(len,1,16))
    }
}

export default ID;