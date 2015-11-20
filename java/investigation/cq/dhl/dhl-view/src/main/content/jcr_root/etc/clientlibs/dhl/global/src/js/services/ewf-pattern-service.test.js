import EwfPatternService from './ewf-pattern-service';
import 'angularMocks';

describe('EwfPatternService', () => {
    let sut;

    beforeEach(() => {
        sut = new EwfPatternService();
    });

    describe('#getPattern', () => {
        it('should exist', () => {
            expect(sut.getPattern).toBeDefined();
        });

        it('should return normal output for existing key', () => {
            const existingKey = 'EMAIL';

            expect(sut.getPattern(existingKey)).toBeTruthy();
        });

        it('should return normal output for existing key with modifier', () => {
            const existingKey = 'EMAIL';
            const modifier = true;

            expect(sut.getPattern(existingKey, modifier)).toBeTruthy();
        });

        it('should return non-existing key as is', () => {
            const nonExistingKey = 'nonExistingKey';

            expect(sut.getPattern(nonExistingKey)).toEqual(nonExistingKey);
        });
    });

    describe('#POSTITVE_NUMBER pattern', () => {
        it('should return regexp for positive number', () => {
            const regexp = new RegExp(sut.getPattern('POSITIVE_NUMBER'));
            expect(regexp.test('1.0')).toBeTruthy();
            expect(regexp.test('1,0')).toBeTruthy();
            expect(regexp.test('-1,0')).toBeFalsy();
        });
    });

    describe('#UNSIGNED_FLOAT', () => {
        it('should return regexp for unsigned (positive) float', () => {
            const regexp = sut.getPattern('UNSIGNED_FLOAT');

            expect(regexp.test('-1')).toEqual(false);
            expect(regexp.test('-1.5')).toEqual(false);
            expect(regexp.test('.42')).toEqual(false);
            expect(regexp.test('99,999')).toEqual(false);
            expect(regexp.test('0x89f')).toEqual(false);
            expect(regexp.test('#abcdef')).toEqual(false);
            expect(regexp.test('1.2.3')).toEqual(false);
            expect(regexp.test('')).toEqual(false);
            expect(regexp.test('blah')).toEqual(false);
            expect(regexp.test(' ')).toEqual(false);
            expect(regexp.test('\t\t')).toEqual(false);
            expect(regexp.test('\n\r')).toEqual(false);
            expect(regexp.test(-1)).toEqual(false);
            expect(regexp.test('-1.')).toEqual(false);
            expect(regexp.test('-.5')).toEqual(false);

            expect(regexp.test(8e5)).toEqual(true);
            expect(regexp.test('0')).toEqual(true);
            expect(regexp.test('0.42')).toEqual(true);
            expect(regexp.test(0)).toEqual(true);
            expect(regexp.test(1.1)).toEqual(true);
        });
    });

    describe('#NATURAL_NUMBER', () => {
        it('returns regexp to validate natural numbers', () => {
            const regexp = sut.getPattern('NATURAL_NUMBER');

            expect(regexp.test('1')).toBe(true);
            expect(regexp.test('10000001')).toBe(true);
            expect(regexp.test('0')).toBe(false);
            expect(regexp.test('asd')).toBe(false);
            expect(regexp.test('-1')).toBe(false);
            expect(regexp.test('1.3')).toBe(false);
            expect(regexp.test('-1500')).toBe(false);
        });
    });
});
