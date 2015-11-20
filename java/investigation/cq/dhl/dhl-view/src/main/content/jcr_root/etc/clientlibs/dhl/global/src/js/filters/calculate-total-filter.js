import ewf from 'ewf';

ewf.filter('calculateTotal', calculateTotal);

export default function calculateTotal() {

    return function(data, key, quantity) {
        if (!data) {
            return 0;
        }

        const total = data.reduce((currentTotal, item) => {
            let currentValue = parseFloat(item[key]);
            if (quantity) {
                currentValue *= parseFloat(item[quantity]);
            }
            return currentTotal + (currentValue || 0);
        }, 0);

        return +total.toFixed(3);
    };
}
