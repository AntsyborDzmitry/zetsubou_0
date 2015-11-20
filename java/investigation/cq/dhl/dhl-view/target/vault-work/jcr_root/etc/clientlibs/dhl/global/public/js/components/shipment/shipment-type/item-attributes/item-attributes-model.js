define(['exports', 'module', './../../ewf-shipment-service', 'ewf'], function (exports, module, _ewfShipmentService, _ewf) {
    'use strict';

    module.exports = ItemAttributesModel;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('itemAttributesModel', ItemAttributesModel);

    ItemAttributesModel.$inject = ['$filter', 'shipmentService'];

    function ItemAttributesModel($filter, shipmentService) {
        Object.assign(this, {
            productList: [],
            invoiceDescription: '',
            totalQuantity: 1,
            totalNetWeight: 0,
            totalGrossWeight: 0,
            totalDeclareValue: '',
            currenciesList: [],
            currentCurrency: { type: 'USD' },

            init: init,
            addItemAttributesRow: addItemAttributesRow,
            copyItemAttributesRow: copyItemAttributesRow,
            deleteItemAttributesRow: deleteItemAttributesRow,
            isDutiesCountable: isDutiesCountable,
            calculateTotalQuantity: calculateTotalQuantity,
            calculateTotalWeight: calculateTotalWeight,
            calculateTotalShipmentValue: calculateTotalShipmentValue,
            calculateTotalTax: calculateTotalTax
        });

        function init() {
            this.currenciesList = shipmentService.getCurrencies();
            this.currentCurrency = this.currenciesList.find(function (currency) {
                return currency['default'];
            }) || { type: 'USD' };

            if (!this.productList.length) {
                this.productList = [generateItemAttributesRow(this.currentCurrency.type)];
            }

            return this;
        }

        function addItemAttributesRow() {
            this.productList.push(generateItemAttributesRow(this.currentCurrency.type));
        }

        function copyItemAttributesRow(row) {
            var copiedRow = angular.copy(row);
            this.productList.splice(this.productList.indexOf(row) + 1, 0, copiedRow);
        }

        function deleteItemAttributesRow(row) {
            var position = this.productList.indexOf(row);
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
                currency: currency,
                netWeight: '',
                grossWeight: '',
                commodityCode: '',
                countryOfManufactureCode: '',
                groupId: undefined,
                isProductListVisible: false
            };
        }

        function isDutiesCountable(row) {
            var list = row ? [row] : this.productList;
            return !!list.length && list.some(function (item) {
                return item.commodityCode && item.value;
            });
        }

        function calculateTotalQuantity() {
            var sum = $filter('calculateTotal')(this.productList, 'quantity');
            this.totalQuantity = sum;
            return sum;
        }

        function calculateTotalWeight(field, fieldToSet) {
            var sum = $filter('calculateTotal')(this.productList, field, 'quantity');
            if (fieldToSet) {
                this[fieldToSet] = sum;
            }
            return sum;
        }

        function calculateTotalShipmentValue() {
            var sum = $filter('calculateTotal')(this.productList, 'value', 'quantity');
            var priceString = $filter('currency')(sum, this.currentCurrency.symbol, this.currentCurrency.fractionSize);

            return priceString + ' ' + this.currentCurrency.type;
        }

        function calculateTotalTax(taxType) {
            var _this = this;

            var taxes = angular.isArray(taxType) ? taxType : [taxType];
            var list = this.productList;

            var total = list.reduce(function (currentTotal, item) {
                if (!_this.isDutiesCountable(item)) {
                    return currentTotal;
                }

                var totalTaxes = taxes.reduce(function (currentTaxesTotal, tax) {
                    return currentTaxesTotal + item[tax];
                }, 0);
                var currentValue = item.value * totalTaxes / 100 * item.quantity;
                return currentTotal + (currentValue || 0);
            }, 0);

            return $filter('currency')(+total.toFixed(2), this.currentCurrency.symbol, this.currentCurrency.fractionSize);
        }
    }
});
//# sourceMappingURL=item-attributes-model.js.map
