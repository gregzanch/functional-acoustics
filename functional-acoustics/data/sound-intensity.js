import Data from './data';

class SoundIntensity extends Data {
    constructor(id) {
        super(id);
        this.setType('SoundIntensity');
        this.unit = 'W/m2';
        this.ref = 1e-12;
    }
   
}

export default SoundIntensity;