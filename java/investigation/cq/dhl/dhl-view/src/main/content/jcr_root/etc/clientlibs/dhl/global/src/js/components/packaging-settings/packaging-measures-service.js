import './../../services/ewf-pattern-service';
import ewf from 'ewf';

ewf.service('packagingMeasuresService', PackagingMeasuresService);

PackagingMeasuresService.$inject = ['ewfPatternService'];

export default function PackagingMeasuresService(ewfPatternService) {
    const IMPERIAL = 'IMPERIAL';
    const METRIC = 'METRIC';

    const WEIGHT = 'WEIGHT';
    const DIMENSION = 'DIMENSION';

    const defaultSystem = IMPERIAL;

    const units = [
        {
            key: 'KG',
            title: 'kg',
            system: METRIC,
            type: WEIGHT,
            factor: 1
        },
        {
            key: 'LB',
            title: 'lb',
            system: IMPERIAL,
            type: WEIGHT,
            factor: 0.45359237
        },
        {
            key: 'CM',
            title: 'cm',
            system: METRIC,
            type: DIMENSION,
            factor: 0.01
        },
        {
            key: 'IN',
            title: 'in',
            system: IMPERIAL,
            type: DIMENSION,
            factor: 0.0254
        }
    ];

    const unitsMap = {};

    const UNSIGNED_FLOAT = ewfPatternService.getPattern('UNSIGNED_FLOAT');

    units.forEach((item) => {
        unitsMap[item.key] = item;
    });

    function convertValue(fromUnit, toUnit, value) {
        if (!UNSIGNED_FLOAT.test(value)) {
            return value;
        }

        const convertedValue = Number.parseFloat(value) * unitsMap[fromUnit].factor / unitsMap[toUnit].factor;

        return Math.round(convertedValue * 100) / 100;
    }

    function getWeightUnits() {
        return units.filter((item) => item.type === WEIGHT);
    }

    function getDimensionUnits() {
        return units.filter((item) => item.type === DIMENSION);
    }

    function getDefaultWeightUnit() {
        return units.find((item) => item.type === WEIGHT && item.system === defaultSystem);
    }

    function getDefaultDimensionUnit() {
        return units.find((item) => item.type === DIMENSION && item.system === defaultSystem);
    }

    function getUnitInfo(unitKey) {
        return unitsMap[unitKey];
    }

    return {
        convertValue,

        getWeightUnits,
        getDimensionUnits,

        getDefaultWeightUnit,
        getDefaultDimensionUnit,

        getUnitInfo
    };
}
