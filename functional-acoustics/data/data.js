import ID from '../util/id';
import units from '../units/units';
import num from '../util/num';
import { round } from '../util/round';

class Data {
    constructor(id) {
        this.id = id || ID.Generate(8);
        this.name = id ? id : "";
        this.data = undefined;
        this.type = undefined;
        this.unit = undefined;
    }
    setName(name) {
        this.name = name;
        return this;
    }
    setData(data) {
        if (num.computable(data)) {
            this.data = data; 
            if (num.numCheck(this.data)) {
                this._data_is = "number";
            } else if (num.numArrayCheck(this.data)) {
                this._data_is = "array"
            }
        }
        else {
             console.error('data needs to be a number or an array of numbers');
        }
        return this;
    }
    setID(id) {
        this.id = id;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setUnit(unit) {
        let error = false;
        try {
            units.checkConversion(unit, this.unit);
        } catch (err) {
            error = true;
            console.error(err);
        } finally {
            if (!error) {
                this.unit = unit;

                return this;
            } else {
  
                return this;
                
            }
        }
       
    }
    convertTo(unit) {
        if (units.checkConversion(unit, this.unit)) {
            switch (this._data_is) {
                case "number":
                    this.data = units.convert(this.data).from(this.unit).to(unit);
                    this.unit = unit;
                    break;
                case "array":
                    this.data = this.data.map(x => units.convert(x).from(this.unit).to(unit));
                    this.unit = unit;
                default:
                    break;
            }
        }
        return this;
    }
    roundTo(decimalPrecision) {
            switch (this._data_is) {
                case "number":
                    this.data = round(this.data,decimalPrecision) 
                    break;
                case "array":
                    this.data = this.data.map(x => round(x, decimalPrecision));
                default:
                    break;
            }
        return this;
    }
    tabulate(orientation = "vertical", order = ["name", "type", "unit", "data"]) {
        let tabular = "";
        let temp = {
            data: this.data,
            unit: this.unit,
            type: this.type,
            name: this.name
        };

        switch (this._data_is) {
            case "number":
                temp.data = [this.data];
                break;
            case "array":
                break;
            default:
                break;
        }
        if (orientation === 'column') {
            orientation = "vertical";
        }
        if (orientation === 'row') {
            orientation = 'horizontal';
        }
        switch (orientation) {
            case "vertical":
                order.forEach(item => {
                    if (item === "data") {
                        temp.data.forEach(d => {
                            tabular += `${d}\n`
                        })
                    }
                    else {
                         tabular += `${temp[item]}\n`
                    }
                })
                break;
            case "horizontal":
            order.forEach(item => {
                 if (item === "data") {
                     temp.data.forEach(d => {
                         tabular += `${d}\t`
                     })
                 } else {
                     tabular += `${temp[item]}\t`
                 }
            })
            break;
            default:
                break;
        }
        console.log(tabular);
        return tabular;
    }
}

export default Data;

