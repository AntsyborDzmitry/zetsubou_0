import ewf from 'ewf';
import angular from 'angular';

ewf.service('countryCodeConverter', countryCodeConverter);

export default function countryCodeConverter() {
    return {
        fromThreeLetterToCatalystFormat,
        fromTwoCapsToThreeLow
    };

    //TODO: move to normal service without mock routine
    function fromThreeLetterToCatalystFormat(threeLetters, countryList) {
        if (angular.isUndefined(countryList)) {
            return fromThreeLetterToCatalystFormatMock(threeLetters);
        }

        const country = countryList
            .find((eachCountry) => eachCountry.code3.toLowerCase() === threeLetters.toLowerCase());
        return country && country.code2;
    }

    function fromThreeLetterToCatalystFormatMock(threeLetters) {
        if (threeLetters === 'usa') {
            return 'US';
        }
        if (threeLetters === 'ukr') {
            return 'UA';
        }
        if (threeLetters === 'deu') {
            return 'DE';
        }
    }

    function fromTwoCapsToThreeLow(twoLetters) {
        if (twoLetters === 'US') {
            return 'usa';
        }
        if (twoLetters === 'UA') {
            return 'ukr';
        }
        if (twoLetters === 'DE') {
            return 'deu';
        }
    }
}
