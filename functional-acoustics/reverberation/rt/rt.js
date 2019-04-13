import { Bands, OctaveBands, ThirdOctaveBands, Flower, Fupper } from '../../bands/bands';
import clamp from '../../util/clamp';
import { Surface } from '../../types/surface';
import { airAttenuation } from '../../properties/air-attenuation';

export class RT {
    constructor({
        surfaces,
        volume,
        units,
        frequency
    } = {}) {
        this.surfaces = surfaces || [];
        this.units = units || "m";
        this.volume = volume || undefined;
        this.setFrequency(frequency || Bands.Octave.fromRange(125, 4000));
        this.resolveUnitConstant();
        this.resolveSurfaceArea();
        this.resolveRelations();
    }
    addSurface(surface) {
        if (surface instanceof Surface) {
            this.surfaces.push(surface);
            this.resolveSurfaceArea();
            this.resolveRelations();
        }
        return this;
    }
    setFrequency(frequency) {
        this.frequency = frequency;
        this.setAirAbsorption(airAttenuation({
            frequency: frequency
        }));
        return this;
    }
    setVolume(volume) {
        this.volume = volume;
        return this;
    }
    setUnits(units) {
        this.units = units;
        this.resolveUnitConstant();
        return this;
    }
    setAirAbsorption(m) {
        this.AirAbsorption = m;
        return this;
    }
    resolveUnitConstant() {
        switch (this.units) {
            case "ft":
                this.unitConstant = 0.049;
                break;
            case "m":
                this.unitConstant = 0.161;
                break;
            default:
                break;
        }
    }
    resolveRelations() {
        if (this.surfaces.length > 0) {
            this.varIndices = this.surfaces.map((x, i) => x.isVar ? i : null).filter(x => x !== null);
        }
    }
    resolveSurfaceArea() {
        if (this.surfaces.length > 0) {
            this.surfaceArea = this.surfaces.map(x => x.modifiedSurfaceArea).reduce((a, b) => a + b);
        }
    }
    getSurfaceByName(name) {
        return this.surfaces.filter(x => x.name === name)[0];
    }
    calculateRT() {
        let num = this.unitConstant * this.volume;
        if (this.frequency) {
            if (this.frequency instanceof Array) {
                let sum = Array(this.frequency.length).fill(0);
                this.surfaces.forEach(s => {
                    s.sabins.forEach((m, i) => {
                        sum[i] += m;
                    });
                });
                this.absorption = sum;
                this.meanAlpha = sum.map(x => x / this.surfaceArea);
                this.T60 = this.meanAlpha.map((x, i, a) => {
                    if (x < 0.2) {
                        return num / (this.surfaceArea * x + (4 * (this.AirAbsorption[i] || 0) * this.volume));
                    } else {
                        return num / (-this.surfaceArea * Math.log(1 - x) + (4 * (this.AirAbsorption[i] || 0) * this.volume));
                    }
                });
                console.log(this.T60);
            }
        }
    }

};

export class RTOptimizer extends RT {
    constructor(props) {
        super(props);
    }
    setStepSize(stepSize) {
        this.stepSize = stepSize;
        return this;
    }
    setIterRate(iterRate) {
        this.iterRate = iterRate;
        return this;
    }
    setGoal(goal) {
        this.goal = goal;
        this.goalprime = [];
        for (let i = 0; i < this.goal.length - 1; i++) {
            this.goalprime.push(this.goal[i + 1] - this.goal[i]);
        }

        return this;
    }
    setIterCount(iterCount) {
        this.iterCount = iterCount;
        return this;
    }
    calculateMSE(shouldSetMSE, t60, goal) {
        let error = t60.map((t, i) => goal[i] - t);
        let mse = error.map(e => e * e).reduce((a, b) => a + b) / error.length;
        if (shouldSetMSE) this.MSE = mse;
        return mse;
    }
    calculateMSEQuiet(arr1, arr2) {
        let error = arr1.map((t, i) => arr2[i] - t);
        let mse = error.map(e => e * e).reduce((a, b) => a + b) / error.length;
        return mse;
    }
    calculateRT(shouldSetT60) {
        this.resolveSurfaceArea();
        let num = this.unitConstant * this.volume;
        if (this.frequency) {
            if (this.frequency instanceof Array) {
                let sum = Array(this.frequency.length).fill(0);
                this.surfaces.forEach(s => {
                    //s.resolveSabins();
                    s.materialCoefficients.forEach((m, i) => {
                        sum[i] += m * s.modifiedSurfaceArea;
                    });
                });
                this.absorption = sum;
                this.meanAlpha = sum.map(x => x / this.surfaceArea);
                let t60 = this.meanAlpha.map((x, i, a) => {
                    if (x < 0.2) {
                        return num / (this.surfaceArea * x + (4 * (this.AirAbsorption[i] || 0) * this.volume));
                    } else {
                        return num / (-this.surfaceArea * Math.log(1 - x) + (4 * (this.AirAbsorption[i] || 0) * this.volume));
                    }
                });
                if (shouldSetT60) {
                    this.T60 = t60
                    this.T60Prime = this.calculateRTPrime(this.T60);
                };
                return t60;
            }
        }
    }
    calculateRTPrime(rt) {
        let rtprime = [];
        for (let i = 0; i < rt.length - 1; i++) {
            rtprime.push(rt[i + 1] - rt[i]);
        }
        return rtprime;
    }
    optimize(N, timeout = 0) {
        Array(N).fill(0).forEach(x => {
            let mse = this.calculateMSE(true, this.T60, this.goal);

            let tempt60prime;
            let tempMSE;
            for (let i = 0; i < this.surfaces.length; i++) {
                if (this.surfaces[i].children.length > 0) {
                    for (let j = 0; j < this.surfaces[i].children.length; j++) {
                        this.surfaces[i].children[j].modifiedSurfaceArea = clamp(this.surfaces[i].children[j].modifiedSurfaceArea + this.stepSize, 0, this.surfaces[i].surfaceArea);
                        this.surfaces[i].modifiedSurfaceArea = clamp(this.surfaces[i].modifiedSurfaceArea - this.stepSize, 0, this.surfaces[i].surfaceArea);
                        tempt60prime = this.calculateRTPrime(this.calculateRT(false));
                        tempMSE = this.calculateMSEQuiet(tempt60prime, this.goalprime);

                        if (tempMSE > mse) {
                            this.surfaces[i].children[j].modifiedSurfaceArea = clamp(this.surfaces[i].children[j].modifiedSurfaceArea - 2 * this.stepSize, 0, this.surfaces[i].surfaceArea);
                            this.surfaces[i].modifiedSurfaceArea = clamp(this.surfaces[i].modifiedSurfaceArea + 2 * this.stepSize, 0, this.surfaces[i].surfaceArea);
                            tempt60prime = this.calculateRTPrime(this.calculateRT(false));
                            tempMSE = this.calculateMSEQuiet(tempt60prime, this.goalprime);
                            if (tempMSE > mse) {
                                this.surfaces[i].children[j].modifiedSurfaceArea = clamp(this.surfaces[i].children[j].modifiedSurfaceArea + this.stepSize, 0, this.surfaces[i].surfaceArea);
                                this.surfaces[i].modifiedSurfaceArea = clamp(this.surfaces[i].modifiedSurfaceArea - this.stepSize, 0, this.surfaces[i].surfaceArea);
                                tempt60prime = this.calculateRTPrime(this.calculateRT(false));
                                tempMSE = this.calculateMSEQuiet(tempt60prime, this.goalprime);
                            }
                        }
                        this.T60Prime = tempt60prime;
                        mse = tempMSE;

                    }
                }
            }
            console.log(this.surfaces[1].modifiedSurfaceArea, this.surfaces[7].modifiedSurfaceArea);


        });
        console.log(this.surfaces);
    }
    optimizePrime(N) {
        Array(N).fill(0).forEach(x => {

            let mse = this.calculateMSEQuiet(this.T60Prime, this.goalprime);

            let tempt60prime;
            let tempMSE;
            for (let i = 0; i < this.surfaces.length; i++) {
                if (this.surfaces[i].children.length > 0) {
                    for (let j = 0; j < this.surfaces[i].children.length; j++) {
                        var tempChildSA = clamp(this.surfaces[i].children[j].modifiedSurfaceArea + this.stepSize, 0, this.surfaces[i].surfaceArea);
                        var tempParentSA = clamp(this.surfaces[i].modifiedSurfaceArea - this.stepSize, 0, this.surfaces[i].surfaceArea);
                        if (tempChildSA + tempParentSA == this.surfaces[i].children[j].surfaceArea + this.surfaces[i].surfaceArea) {
                            this.surfaces[i].children[j].modifiedSurfaceArea = tempChildSA;
                            this.surfaces[i].modifiedSurfaceArea = tempParentSA;

                        }
                        tempt60prime = this.calculateRT(false);
                        tempMSE = this.calculateMSE(false, tempt60prime, this.goal);

                        if (tempMSE > mse) {
                            tempChildSA = clamp(this.surfaces[i].children[j].modifiedSurfaceArea - 2 * this.stepSize, 0, this.surfaces[i].surfaceArea);
                            tempParentSA = clamp(this.surfaces[i].modifiedSurfaceArea + 2 * this.stepSize, 0, this.surfaces[i].surfaceArea);
                            if (tempChildSA + tempParentSA == this.surfaces[i].children[j].surfaceArea + this.surfaces[i].surfaceArea) {
                                this.surfaces[i].children[j].modifiedSurfaceArea = tempChildSA;
                                this.surfaces[i].modifiedSurfaceArea = tempParentSA;

                            }
                            tempt60prime = this.calculateRT(false);
                            tempMSE = this.calculateMSE(false, tempt60prime, this.goal);
                            if (tempMSE > mse) {
                                var tempChildSA = clamp(this.surfaces[i].children[j].modifiedSurfaceArea + this.stepSize, 0, this.surfaces[i].surfaceArea);
                                var tempParentSA = clamp(this.surfaces[i].modifiedSurfaceArea - this.stepSize, 0, this.surfaces[i].surfaceArea);
                                if (tempChildSA + tempParentSA == this.surfaces[i].children[j].surfaceArea + this.surfaces[i].surfaceArea) {
                                    this.surfaces[i].children[j].modifiedSurfaceArea = tempChildSA;
                                    this.surfaces[i].modifiedSurfaceArea = tempParentSA;

                                }
                                tempt60prime = this.calculateRT(false);
                                tempMSE = this.calculateMSE(false, tempt60prime, this.goal);
                            }
                        }
                        this.T60 = tempt60prime;
                        mse = tempMSE;
                        this.surfaces[i].children[j].delta = this.surfaces[i].children[j].modifiedSurfaceArea - this.surfaces[i].children[j].surfaceArea;
                        this.surfaces[i].delta = this.surfaces[i].modifiedSurfaceArea - this.surfaces[i].surfaceArea;
                    }
                }
            }
            // console.log(this.surfaces[1].modifiedSurfaceArea+this.surfaces[7].modifiedSurfaceArea);
        });
        console.log(this.surfaces.map(x => x.delta).filter(x => typeof x !== "undefined"));

    }
}