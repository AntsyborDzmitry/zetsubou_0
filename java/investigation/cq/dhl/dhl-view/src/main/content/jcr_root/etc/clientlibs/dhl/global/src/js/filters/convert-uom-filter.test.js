import './convert-uom-filter';
import 'angularMocks';

describe('convertUomToOpposite', () => {
    let $filter;
    const defaultPrecision = 2;
    const uomConvertionFactor = {
        cm: 0.3937,
        kg: 2.2046,
        in: 2.54,
        lb: 0.4535
    };

    function precize(value) {
        return +value.toFixed(defaultPrecision);
    }

    beforeEach(() => {
        module('ewf');

        inject((_$filter_) => {
            $filter = _$filter_;
        });
    });

    it('should return 0 if value to convert can not be parsed', () => {
        const result = $filter('convertUomToOpposite')('', uomConvertionFactor.kg);
        expect(result).toEqual(precize(0));
    });

    it('should apply convertion factor 1 in case of unrecognized uom to convert', () => {
        const result = $filter('convertUomToOpposite')('10', 'unrecognized_uom');
        expect(result).toEqual(precize(10));
    });

    it('should convert cm to in using correct factor', () => {
        const result = $filter('convertUomToOpposite')('1', uomConvertionFactor.cm);
        expect(result).toEqual(precize(1 * uomConvertionFactor.cm));
    });

    it('should convert in to cm using correct factor', () => {
        const result = $filter('convertUomToOpposite')('2', uomConvertionFactor.in);
        expect(result).toEqual(precize(2 * uomConvertionFactor.in));
    });

    it('should convert kg to lb using correct factor', () => {
        const result = $filter('convertUomToOpposite')('3', uomConvertionFactor.kg);
        expect(result).toEqual(precize(3 * uomConvertionFactor.kg));
    });

    it('should convert lb to kg using correct factor', () => {
        const result = $filter('convertUomToOpposite')('4', uomConvertionFactor.lb);
        expect(result).toEqual(precize(4 * uomConvertionFactor.lb));
    });

    it('should convert uom using precision from parameters', () => {
        const precision = 1;
        const result = $filter('convertUomToOpposite')('1', uomConvertionFactor.lb, precision);
        expect(result).toEqual(1 * uomConvertionFactor.lb.toFixed(precision));
    });

    it('should convert uom using default precision in case there is no such in parameters', () => {
        const result = $filter('convertUomToOpposite')('1', uomConvertionFactor.lb);
        expect(result).toEqual(precize(1 * uomConvertionFactor.lb));
    });
});
