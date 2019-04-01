import WeightConverter from '../weight/weight-converter';
import Types from '../data/types';
import TypeTranslation from '../verbose/translations/type-translation';

class Measurement {
    constructor(id) {
        this.id = id || "";
        this.datachain = [];
        this.name = "";
        this.type = "";
        this.operationHistory = ['constructor'];
    }
    lastOperation() {
        return this.operationHistory[this.operationHistory.length - 1];
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setFrequency(frequency) {
        this.frequency = frequency;
        this.operationHistory.push('setFrequency');
        return this;
    }
    addData(data) {
        this.pendingData = data;
        this.operationHistory.push('addData');
        return this;
    }
    ofType(type) {
        if (!this.pendingData) {
            console.error('must set data with \'.addData([*your-data*])\' before setting its type')
            return this;
        }
  
        let translation = TypeTranslation(type);
        if (translation) {
            let newdata = new Types[translation]();
            if (this.pendingName) {
                newdata.setName(this.pendingName);
                this.pendingName = undefined;
            }
            newdata.setData(this.pendingData);
            this.pendingData = undefined;
            this.datachain.push(newdata);
        }
        this.operationHistory.push('ofType');
        return this;
    }
    withName(name) {
        if (this.lastOperation() === 'ofType') {
            this.datachain[this.datachain.length - 1].setName(name);
        }
        else if (this.pendingData) {
            this.pendingName = name;
        }
        else if (!this.pendingData) {
            console.error('must set data with \'.addData([*your-data*])\' before setting its name')
            return this;
        }
        else 
        this.operationHistory.push('withName');
        return this;
    }
    withWeight(weight) {
        if (this.datachain[this.datachain.length - 1].type === "SoundPressureLevel") {
            this.datachain[this.datachain.length - 1].setWeight(weight);
        }
        else {
            const err = `Must have type SoundPressureLevel!`;
            console.error(err);
        }
        return this;
    }
    changeWeight(desiredWeight) {
        if (!this.frequency) {
            const err = `Must set frequency array before converting`
            console.error(err);
        }
        else if (this.datachain.length==0) {
            const err = `Must add data before converting`
            console.error(err);
        }
        else if (!(this.frequency.length == this.datachain[this.datachain.length-1].data.length)) {
            const err = `array mismatch: frequency array has length [${this.frequency.length}] while data array has length [${this.datachain[this.datachain.length-1].data.length}]. They must be the same size.`
            console.error(err);
        }
        else if (this.datachain[this.datachain.length-1].type!=="SoundPressureLevel"){
            const err = `Cannot change the weight of ${this.datachain[this.datachain.length - 1].type} data. must have type SoundPressureLevel`;
            console.error(err);
        }
        else {
            const newdata = new Types.SoundPressureLevel();
            newdata.setData(this.datachain[this.datachain.length - 1].data);
            newdata.setWeight(this.datachain[this.datachain.length - 1].weight);
            newdata.setName(this.datachain[this.datachain.length - 1].name);
            newdata.changeWeight(desiredWeight, this.frequency);
            this.datachain.push(newdata);
            return this;
        }
    }
}

export default Measurement;