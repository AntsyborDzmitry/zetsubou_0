import CatalystCountryCodeConverter from './temp-catalyst-country-code-converter';
import 'angularMocks';

describe('#CatalystCountryCodeConverter', () => {

    let sut;

    const countries = [
        {code2: 'BR', code3: 'BRA'},
        {code2: 'CN', code3: 'CHN'}
    ];

    beforeEach(() => {
        sut = new CatalystCountryCodeConverter();
    });

    it('should call converter mock on known countries', () => {
        const knownThreeCountryCodes = ['usa', 'ukr', 'deu'];
        const knownTwoCountryCodes = ['US', 'UA', 'DE'];
        for (let eachCountryId of knownThreeCountryCodes) {
            const twoCountryCode = sut.fromThreeLetterToCatalystFormat(eachCountryId);
            expect(knownTwoCountryCodes.includes(twoCountryCode)).toBe(true);
        }
    });

    it('should return correct country ID', () => {
        for (let eachCountry of countries) {
            const twoCountryCode = sut.fromThreeLetterToCatalystFormat(eachCountry.code3, countries);
            expect(eachCountry.code2).toBe(twoCountryCode);
        }
    });

    it('should return undefined on unknown country by mock', () => {
        const unknownCountry = sut.fromThreeLetterToCatalystFormat('wrongCountryId');
        expect(unknownCountry).toBe(undefined);
    });

    it('should return undefined on unknown country', () => {
        const unknownCountry = sut.fromThreeLetterToCatalystFormat('wrongCountryId', countries);
        expect(unknownCountry).toBe(undefined);
    });
});
