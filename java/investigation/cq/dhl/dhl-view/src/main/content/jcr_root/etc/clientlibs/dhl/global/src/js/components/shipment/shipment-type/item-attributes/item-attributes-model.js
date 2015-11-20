import './../../ewf-shipment-service';
import ewf from 'ewf';

ewf.service('itemAttributesModel', ItemAttributesModel);

ItemAttributesModel.$inject = ['$filter', 'shipmentService'];

export default function ItemAttributesModel($filter, shipmentService) {
    Object.assign(this, {
        productList: [],
        invoiceDescription: '',
        totalQuantity: 1,
        totalNetWeight: 0,
        totalGrossWeight: 0,
        totalDeclareValue: '',
        currenciesList: [],
        currentCurrency: {type: 'USD'},

        init,
        addItemAttributesRow,
        copyItemAttributesRow,
        deleteItemAttributesRow,
        isDutiesCountable,
        calculateTotalQuantity,
        calculateTotalWeight,
        calculateTotalShipmentValue,
        calculateTotalTax
    });

    function init() {
        this.currenciesList = shipmentService.getCurrencies();
        this.currentCurrency = this.currenciesList.find((currency) => currency.default) || {type: 'USD'};

        if (!this.productList.length) {
            this.productList = [generateItemAttributesRow(this.currentCurrency.type)];
        }

        return this;
    }

    function addItemAttributesRow() {
        this.productList.push(generateItemAttributesRow(this.currentCurrency.type));
    }

    function copyItemAttributesRow(row) {
        const copiedRow = angular.copy(row);
        this.productList.splice(this.productList.indexOf(row) + 1, 0, copiedRow);
    }

    function deleteItemAttributesRow(row) {
        const position = this.productList.indexOf(row);
        this.productList.splice(position, 1);
    }

    function generateItemAttributesRow(currency) {
        return {
            id: '',
            name: '',
            description: '',
            quantity: 1,
            quantityUnits: '',
            value: '',
            currency,
            netWeight: '',
            grossWeight: '',
            commodityCode: '',
            countryOfManufactureCode: '',
            groupId: undefined,
            isProductListVisible: false
        };
    }

    function isDutiesCountable(row) {
        const list = row ? [row] : this.productList;
        return !!list.length && list.some((item) => item.commodityCode && item.value);
    }

    function calculateTotalQuantity() {
        const sum = $filter('calculateTotal')(this.productList, 'quantity');
        this.totalQuantity = sum;
        return sum;
    }

    function calculateTotalWeight(field, fieldToSet) {
        const sum = $filter('calculateTotal')(this.productList, field, 'quantity');
        if (fieldToSet) {
            this[fieldToSet] = sum;
        }
        return sum;
    }

    function calculateTotalShipmentValue() {
        const sum = $filter('calculateTotal')(this.productList, 'value', 'quantity');
        const priceString = $filter('currency')(sum, this.currentCurrency.symbol, this.currentCurrency.fractionSize);

        return `${priceString} ${this.currentCurrency.type}`;
    }

    function calculateTotalTax(taxType) {
        const taxes = angular.isArray(taxType) ? taxType : [taxType];
        const list = this.productList;

        const total = list.reduce((currentTotal, item) => {
            if (!this.isDutiesCountable(item)) {
                return currentTotal;
            }

            const totalTaxes = taxes.reduce((currentTaxesTotal, tax) => currentTaxesTotal + item[tax], 0);
            const currentValue = item.value * totalTaxes / 100 * item.quantity;
            return currentTotal + (currentValue || 0);
        }, 0);

        return $filter('currency')(+total.toFixed(2), this.currentCurrency.symbol, this.currentCurrency.fractionSize);
    }
}
