import ewf from 'ewf';

ewf.filter('convertUomToOpposite', convertUomToOpposite);

export default function convertUomToOpposite() {
    const defaultConvertPrecision = 2;

    return function(value, uomCoefficient, convertPrecision = defaultConvertPrecision) {
        let convertedValue = 0;
        const valueToConvert = parseFloat(value);

        if (valueToConvert) {
            convertedValue = valueToConvert * (+uomCoefficient || 1);
        }
        return +convertedValue.toFixed(convertPrecision);
    };
}
