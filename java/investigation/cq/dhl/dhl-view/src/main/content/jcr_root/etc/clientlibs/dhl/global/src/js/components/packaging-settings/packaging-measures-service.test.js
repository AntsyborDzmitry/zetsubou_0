import PackagingMeasuresService from './packaging-measures-service';
import EwfPatternService from './../../services/ewf-pattern-service';
import 'angularMocks';

describe('packagingMeasuresService', () => {
    let sut;
    let ewfPatternServiceMock;

    beforeEach(() => {
        ewfPatternServiceMock = jasmine.mockComponent(new EwfPatternService());
        ewfPatternServiceMock.getPattern.and.callThrough();

        sut = new PackagingMeasuresService(ewfPatternServiceMock);
    });

    describe('#init', () => {
        it('should get format pattern', () => {
            expect(ewfPatternServiceMock.getPattern).toHaveBeenCalledWith('UNSIGNED_FLOAT');
        });
    });

    describe('#convertValue', () => {
        it('should return converted value for valid input', () => {
            const fromUnit = sut.getUnitInfo('LB');
            const toUnit = sut.getUnitInfo('IN');
            const oldValue = '123.45';
            const newValue = 2204.57;

            expect(sut.convertValue(fromUnit.key, toUnit.key, oldValue)).toEqual(newValue);
        });

        it('should return input if it is not valid', () => {
            const oldValue = 'qwerty';

            expect(sut.convertValue(null, null, oldValue)).toBe(oldValue);
        });
    });

    describe('#getWeightUnits', () => {
        it('should return only weight-type units', () => {
            const units = sut.getWeightUnits();

            expect(units.every((item) => item.type === 'WEIGHT')).toEqual(true);
        });
    });

    describe('#getDimensionUnits', () => {
        it('should return only dimension-type units', () => {
            const units = sut.getDimensionUnits();

            expect(units.every((item) => item.type === 'DIMENSION')).toEqual(true);
        });
    });

    describe('#getDefaultWeightUnit', () => {
        it('should return object', () => {
            expect(sut.getDefaultWeightUnit()).toEqual(jasmine.any(Object));
        });

        it('should return weight-type unit of imperial system', () => {
            expect(sut.getDefaultWeightUnit().type).toEqual('WEIGHT');
            expect(sut.getDefaultWeightUnit().system).toEqual('IMPERIAL');
        });
    });

    describe('#getDefaultDimensionUnit', () => {
        it('should return object', () => {
            expect(sut.getDefaultDimensionUnit()).toEqual(jasmine.any(Object));
        });

        it('should return dimension-type unit of imperial system', () => {
            expect(sut.getDefaultDimensionUnit().type).toEqual('DIMENSION');
            expect(sut.getDefaultDimensionUnit().system).toEqual('IMPERIAL');
        });
    });

    describe('#getUnitInfo', () => {
        it('should return unit definition if it is found', () => {
            expect(sut.getUnitInfo('LB')).toEqual(jasmine.any(Object));
            expect(sut.getUnitInfo('BLAH')).toEqual(undefined);
        });
    });
});
