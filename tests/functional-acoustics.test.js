var assert = require('chai').assert;
const AC = require('../functional-acoustics');


describe('AC', function() {
    describe('#dBsum()', function () {
        it('should return 93.01029995663981 when given [90,90]', function () {
            assert.equal(AC.dBsum([90, 90]), 93.01029995663981);
        });
        it('should return [93.01029995663981,93.01029995663981] when given [[90,90],[90,90]]', function () {
            assert.deepEqual(AC.dBsum([
                [90, 90],
                [90, 90]
            ]), [93.01029995663981, 93.01029995663981]);
        });
        it('should return 93.01029995663981 when given ["90",90]', function () {
            assert.equal(AC.dBsum(["90", 90]), 93.01029995663981);
        });
        it('should return [93.01029995663981,93.01029995663981] when given [["90",90],[90,"90"]]', function () {
            assert.deepEqual(AC.dBsum([
                ["90", 90],
                [90, "90"]
            ]), [93.01029995663981, 93.01029995663981]);
        });
    })
})