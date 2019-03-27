var assert = require('chai').assert;
const AC = require('../functional-acoustics');

const AC_TEST = require('./functional-acoustics.test.json');

describe('AC', function() {
    describe('#dBsum()', function () {
        it('should return 93 when given [90,90]', function () {
            assert.equal(AC.dBsum([90, 90]), 93);
        });
        it('should return [93,93] when given [[90,90],[90,90]]', function () {
            assert.deepEqual(AC.dBsum([
                [90, 90],
                [90, 90]
            ]), [93, 93]);
        });
        it('should return 93 when given ["90",90]', function () {
            assert.equal(AC.dBsum(["90", 90]), 93);
        });
        it('should return [93,93] when given [["90",90],[90,"90"]]', function () {
            assert.deepEqual(AC.dBsum([
                ["90", 90],
                [90, "90"]
            ]), [93, 93]);
        });
    });
    describe('#Properties', function () {
        describe('#Air', function () {
            describe('#Absorption()', function () {
                it('should equal equivalent data in json', function () {
                    assert.deepEqual(
                        AC.Properties.Air.Absorption({ frequency: AC.Bands.Octave.Nominal }),
                        AC_TEST.AirAbsorptionOctave_Default)
                });

                it('should equal equivalent data in json', function () {
                    assert.deepEqual(
                        AC.Properties.Air.Absorption({frequency: AC.Bands.ThirdOctave.Nominal}),
                        AC_TEST.AirAbsorptionThirdOctave_Default)
                })
            });
        });
    });
})