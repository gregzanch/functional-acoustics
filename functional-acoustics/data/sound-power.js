import Data from './data';


class SoundPower extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundPower');
        this.unit = 'W/m2';
        this.ref = 1e-12;
    }
}

export default SoundPower;