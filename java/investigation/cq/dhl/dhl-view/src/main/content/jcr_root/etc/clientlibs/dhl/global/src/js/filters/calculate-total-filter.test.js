import './calculate-total-filter';
import 'angularMocks';

describe('calculateTotal', () => {
    let $filter;
    let data, value1, value2, quantity1, quantity2, total, roundedTotal, totalWithQuantity;

    beforeEach(() => {
        module('ewf');

        inject((_$filter_) => $filter = _$filter_);

        value1 = 2;
        quantity1 = 5;
        value2 = 2;
        quantity2 = 5;
        total = value1 + value2;
        roundedTotal = 2.4;
        totalWithQuantity = value1 * quantity1 + value2 * quantity2;
        data = [{
            value: value1
        }, {
            value: value2
        }];
    });

    it('should calculate total', () => {
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(total);
    });

    it('should add 0 if value is null', () => {
        data.push({
            value: null
        });
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(total);
    });

    it('should add 0 if value is undefined', () => {
        data.push({
            value: undefined
        });
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(total);
    });

    it('should return 0 if data array is empty', () => {
        data = [];
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(0);
    });

    it('should return 0 if data is null', () => {
        data = null;
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(0);
    });

    it('should return 0 if data is undefined', () => {
        data = undefined;
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(0);
    });

    it('should calculate Total with quantity if quantity is passed', () => {
        data = [{
            value: value1,
            quantity: quantity1
        }, {
            value: value2,
            quantity: quantity2
        }];
        const result = $filter('calculateTotal')(data, 'value', 'quantity');
        expect(result).toEqual(totalWithQuantity);
    });

    it('should return 0 if null passed as quantity', () => {
        data = [{
            value: value1,
            quantity: null
        }];
        const result = $filter('calculateTotal')(data, 'value', 'quantity');
        expect(result).toEqual(0);
    });

    it('should return 0 if undefined passed as quantity', () => {
        data = [{
            value: value1,
            quantity: undefined
        }];
        const result = $filter('calculateTotal')(data, 'value', 'quantity');
        expect(result).toEqual(0);
    });

    it('should return 0 if wrong string passed as quantity', () => {
        data = [{
            value: value1,
            quantity: 'string'
        }];
        const result = $filter('calculateTotal')(data, 'value', 'quantity');
        expect(result).toEqual(0);
    });

    it('should return 0 if wrong string passed as quantity and not affect another right values', () => {
        data = [{
            value: 3,
            quantity: 4
        }, {
            value: value1,
            quantity: 'string'
        }, {
            value: 5,
            quantity: 6
        }];
        const result = $filter('calculateTotal')(data, 'value', 'quantity');
        expect(result).toEqual(42);
    });

    it('should round total with correct precision', () => {
        data[0].value = 1.1;
        data[1].value = 1.3;
        const result = $filter('calculateTotal')(data, 'value');
        expect(result).toEqual(roundedTotal);
    });
});
