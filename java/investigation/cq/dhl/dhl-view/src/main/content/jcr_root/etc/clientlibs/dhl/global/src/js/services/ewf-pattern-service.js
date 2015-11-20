import ewf from 'ewf';

ewf.service('ewfPatternService', EwfPatternService);

export default function EwfPatternService() {
    const patternMap = {
        EMAIL: (allowUppercase) => {
            const modification = allowUppercase ? 'A-Z' : '';

            return `^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z${modification}]{2,6}(?:\\.
                [a-z${modification}]{2})?)$`;
        },

        UNSIGNED_FLOAT: /^(\d+(\.\d+)?)$/,

        NUMERIC: (signedFloat) => signedFloat ? '^$|^[+-]?(?:\\d+\\.?\\d*|\\d*\\.\\d+)$' : '^(\\s*|\\d+)$',

        ALPHA_NUMERIC: (allowEmpty) => {
            const modification = allowEmpty ? '^$|' : '';

            return `${modification}^[a-z\\d\\-_\\s]+$`;
        },

        PHONE_NUMBER: (allowEmpty) => {
            const modification = allowEmpty ? '^$|' : '';

            return `${modification}^([\\d]+)|(\\(\\d{3}\\) \\d{3}-\\d{4})$`;
        },

        PHONE_COUNTRY_CODE: /^$|^[0-9]{1,2}[-]?[0-9]{0,4}$/,

        NUMERIC_AND_SPECIAL_CHARS: '^[0-9\\+]*$',

        TAX_ID: '^[a-zA-Z\\d]*$',

        CNPJ_OR_CPF_TAX_ID: /^0([0-9]{10,14})$/,

        ITN: '[x,X]\\d{14}$',

        EXPORT_LICENSE_NUMBER: /^[a-zA-Z0-9]{1,23}$/,

        ULTIMATE_CONSIGNEE: /^[a-zA-Z0-9]{1,35}$/,

        FORMATTED: '^([\\s\\d\\-\\(\\)]+)$',

        QUANTITY: /(^[1-9][0-9]*$)|(?:^$)/,

        COMMODITY_CODE: '^\\d(?:[\\d\\-\\.]{1,6}\\d)?$',

        DIMENSION: '^(?:0\\.\\d*[1-9]$)|^(?:[1-9]\\d*\\.\\d*[1-9]$)|^(?:[1-9]\\d*$)|(?:^$)',

        WORD: '^[\\w\\s]+$',

        POSITIVE_NUMBER: /^[\+]?\d+([,\.]\d+)?$/,

        NATURAL_NUMBER: /^[1-9]\d*$/,

        POSITIVE_NUMBER_TWO_DECIMALS: /^[+]?[1-9]\d*(\.\d{1,2})?\s*$/,

        POSITIVE_NUMBER_ONE_DECIMAL: /^[+]?[1-9]\d*(\.\d{1})?\s*$/
    };

    this.getPattern = getPattern;

    function getPattern(key, modifier) {
        const pattern = patternMap[key];

        if (pattern) {
            if (angular.isFunction(pattern)) {
                return pattern(modifier);
            }

            return pattern;
        }

        return key;
    }
}
