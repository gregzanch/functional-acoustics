class Barrier{
    constructor() {

    }
    setSource(x, y){
        this.source = {
            x: x,
            y: y
        }
        return this;
    }
    setReciever(x, y){
        this.reciever = {
            x: x,
            y: y
        }
        return this;
    }
    setBarrier(x, y){
        this.barrier = {
            x: x,
            y: y
        }
        return this;
    }
    setSpeed(c){
        this.speed = c;
        return this;
    }
    getInsertionLoss(freq){
        freq = typeof freq === "number" ? [freq] : freq;
    }
}

export default Barrier;