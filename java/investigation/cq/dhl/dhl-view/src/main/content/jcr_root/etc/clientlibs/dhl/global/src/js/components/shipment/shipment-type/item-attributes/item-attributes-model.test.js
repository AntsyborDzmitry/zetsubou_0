import ItemAttributesModel from './item-attributes-model';
import ShipmentService from './../../ewf-shipment-service';

describe('ItemAttributesModel', () => {
    let sut;
    let $filter;
    let shipmentService;

    beforeEach(module('ewf'));
    beforeEach(inject((_$filter_) => {
        $filter = _$filter_;

        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.getCurrencies.and.returnValue([{
            type: 'USD',
            default: false
        }, {
            type: 'EUR',
            default: true
        }]);

        sut = new ItemAttributesModel($filter, shipmentService);
    }));

    describe('#init', () => {
        beforeEach(() => {
            sut.init();
        });

        it('should set total declared value as empty string to pass the validation', () => {
            expect(sut.totalDeclareValue).toEqual('');
        });

        it('should get currency from the shipment service', () => {
            expect(shipmentService.getCurrencies).toHaveBeenCalled();
        });

        it('should set current currency', () => {
            expect(sut.currentCurrency.type).toEqual('EUR');
        });

        it('should copy currencies list from response', () => {
            expect(sut.currenciesList.length).toEqual(2);
        });

        it('should initialize the product list', () => {
            expect(sut.productList.length).toEqual(1);
        });

        it('should not affect product list if it was initialized before', () => {
            const productList = ['test', 'other one'];
            sut.productList = productList;
            sut.init();

            expect(sut.productList).toEqual(productList);
        });
    });

    describe('#addItemAttributesRow', () => {
        const emptyRow = {
            id: '',
            name: '',
            description: '',
            quantity: 1,
            quantityUnits: '',
            value: '',
            netWeight: '',
            grossWeight: '',
            commodityCode: '',
            countryOfManufactureCode: '',
            groupId: undefined,
            isProductListVisible: false
        };

        beforeEach(() => {
            sut.init();
            sut.productList = [];

            sut.addItemAttributesRow();
        });

        it('should add item to customs invoice list', () => {
            expect(sut.productList.length).toEqual(1);
        });

        it('should add new empty item to customs invoice list', () => {
            expect(sut.productList[0]).toEqual(jasmine.objectContaining(emptyRow));
        });
    });

    describe('#copyItemAttributesRow', () => {
        it('should copy item attributes row', () => {
            const productListCopied = [{
                id: 0
            }, {
                id: 1
            }, {
                id: 1
            }, {
                id: 2
            }];
            sut.productList = [{
                id: 0
            }, {
                id: 1
            }, {
                id: 2
            }];

            sut.copyItemAttributesRow(sut.productList[1]);

            expect(sut.productList).toEqual(productListCopied);
        });
    });

    describe('#deleteItemAttributesRow', () => {
        it('should delete item attributes row', () => {
            const productListDeleted = [{
                id: 0
            }, {
                id: 2
            }];

            sut.productList = [{
                id: 0
            }, {
                id: 1
            }, {
                id: 2
            }];
            sut.deleteItemAttributesRow(sut.productList[1]);

            expect(sut.productList).toEqual(productListDeleted);
        });
    });

    describe('#isDutiesCountable', () => {
        it('should be truthy if every product has commodity code and item value', () => {
            const rows = [{
                commodityCode: '11',
                value: '11'
            }, {
                commodityCode: '22',
                value: '22'
            }];
            sut.productList = rows;

            expect(sut.isDutiesCountable()).toEqual(true);
        });

        it('should be truthy if any product has no item value', () => {
            const rows = [{
                commodityCode: '11',
                value: '11'
            }, {
                commodityCode: '22',
                value: ''
            }];
            sut.productList = rows;

            expect(sut.isDutiesCountable()).toEqual(true);
        });

        it('should be truthy if any product has commodity code', () => {
            const rows = [{
                commodityCode: '11',
                value: '11'
            }, {
                commodityCode: '',
                value: '22'
            }];
            sut.productList = rows;

            expect(sut.isDutiesCountable()).toEqual(true);
        });

        it('should be falsy if there are no products', () => {
            sut.productList = [];

            expect(sut.isDutiesCountable()).toEqual(false);
        });

        it('should check only one row if it is passed as argument', () => {
            const row = {
                commodityCode: '11',
                value: '11'
            };
            sut.productList = [];

            expect(sut.isDutiesCountable(row)).toEqual(true);
        });
    });

    describe('#calculateTotalQuantity', () => {
        const expectQuantity = 9;

        beforeEach(() => {
            sut.productList = [{
                quantity: 2
            }, {
                quantity: 3
            }, {
                quantity: 4
            }];
        });

        it('should calculate total quantity', () => {
            expect(sut.calculateTotalQuantity()).toEqual(expectQuantity);
        });

        it('should set calculated quantity to the totalQuantity', () => {
            sut.calculateTotalQuantity();
            expect(sut.totalQuantity).toEqual(expectQuantity);
        });
    });

    describe('#calculateTotalWeight', () => {
        const defaultList = [{
            netWeight: 5,
            grossWeight: 6,
            quantity: 2
        }, {
            netWeight: 7,
            grossWeight: 8,
            quantity: 4
        }];

        beforeEach(() => {
            sut.productList = defaultList;
        });

        it('should calculate shipment gross weight', () => {
            expect(sut.calculateTotalWeight('grossWeight')).toEqual(44);
        });

        it('should calculate shipment net weight', () => {
            expect(sut.calculateTotalWeight('netWeight')).toEqual(38);
        });

        it('should calculate shipment gross weight even when list is empty', () => {
            sut.productList = [];

            expect(sut.calculateTotalWeight()).toEqual(0);
        });

        it('should ignore invalid input weight and return calculated result', () => {
            const invalidList = [{
                netWeight: 'invalid input',
                quantity: 2
            }, {
                netWeight: 7,
                quantity: 4
            }];
            sut.productList = invalidList;

            expect(sut.calculateTotalWeight('netWeight')).toEqual(28);
        });

        it('should ignore invalid input quantity and return calculated result', () => {
            const invalidList = [{
                netWeight: 3,
                quantity: 'invalid input'
            }, {
                netWeight: 7,
                quantity: 4
            }];
            sut.productList = invalidList;

            expect(sut.calculateTotalWeight('netWeight')).toEqual(28);
        });

        it('should calculate right some specific values', () => {
            const specificList = [{
                netWeight: 0.1,
                quantity: 1
            }, {
                netWeight: 0.2,
                quantity: 1
            }];
            sut.productList = specificList;

            expect(sut.calculateTotalWeight('netWeight')).toEqual(0.3);
        });

        it('should set the sum to the field, if this parameter passed', () => {
            const fieldToSet = 'totalNetWeight';
            sut.calculateTotalWeight('netWeight', fieldToSet);

            expect(sut[fieldToSet]).toEqual(38);
        });
    });

    describe('#calculateTotalShipmentValue', () => {
        beforeEach(() => {
            sut.productList = [{
                value: 5,
                quantity: 2
            }, {
                value: 3,
                quantity: 4
            }];

            sut.currentCurrency = {
                type: 'USD',
                symbol: '$',
                fractionSize: 2
            };
        });

        it('should calculate shipment value and apply currency parameters to it', () => {
            expect(sut.calculateTotalShipmentValue()).toEqual('$22.00 USD');
        });

        it('should calculate shipment value even when list is empty', () => {
            sut.productList = [];
            expect(sut.calculateTotalShipmentValue()).toEqual('$0.00 USD');
        });

        it('should calculate shipment value and apply currency parameters to it even with long symbol', () => {
            sut.currentCurrency.symbol = 'Br';

            expect(sut.calculateTotalShipmentValue()).toEqual('Br22.00 USD');
        });

        it('should ignore invalid input values and return calculated result', () => {
            const invalidList = [{
                value: 5,
                quantity: 0
            }, {
                value: 'invalid value',
                quantity: 2
            }];
            sut.productList = invalidList;

            expect(sut.calculateTotalShipmentValue()).toEqual('$0.00 USD');
        });

        it('should ignore invalid input quantity and return calculated result', () => {
            const invalidList = [{
                value: 5,
                quantity: 0
            }, {
                value: 3,
                quantity: 'invalid value'
            }];
            sut.productList = invalidList;

            expect(sut.calculateTotalShipmentValue()).toEqual('$0.00 USD');
        });

        it('should calculate right some specific values', () => {
            const specificList = [{
                value: 0.1,
                quantity: 1
            }, {
                value: 0.2,
                quantity: 1
            }];
            sut.productList = specificList;

            expect(sut.calculateTotalShipmentValue()).toEqual('$0.30 USD');
        });
    });

    describe('#calculateTotalTax', () => {
        const dutySum = '$3.70';
        const taxSum = '$6.10';
        const dutyTaxesSum = '$9.80';

        beforeEach(() => {
            sut.currentCurrency = {
                symbol: '$',
                fractionSize: 2
            };

            sut.productList = [{
                commodityCode: 'any',
                quantity: 2,
                dutyPercent: 1.5,
                taxPercent: 2.5,
                value: 110
            }, {
                commodityCode: 'any',
                quantity: 1,
                dutyPercent: 2,
                taxPercent: 3,
                value: 20
            }];
        });

        it('should calculate duty percent total sum', () => {
            expect(sut.calculateTotalTax('dutyPercent')).toEqual(dutySum);
        });

        it('should calculate tax percent total sum', () => {
            expect(sut.calculateTotalTax('taxPercent')).toEqual(taxSum);
        });

        it('should calculate some specific percents', () => {
            sut.productList = [{
                commodityCode: 'any',
                quantity: 1,
                taxPercent: 100,
                value: 0.1
            }, {
                commodityCode: 'any',
                quantity: 1,
                taxPercent: 100,
                value: 0.2
            }];

            expect(sut.calculateTotalTax('taxPercent')).toEqual('$0.30');
        });

        it('should calculate sum of different tax types', () => {
            const taxes = ['dutyPercent', 'taxPercent'];
            expect(sut.calculateTotalTax(taxes)).toEqual(dutyTaxesSum);
        });

        it('should calculate sum of taxes only for countable rows', () => {
            const taxes = ['dutyPercent', 'taxPercent'];
            sut.productList.push({
                quantity: 1,
                dutyPercent: 2,
                taxPercent: 2,
                value: 100
            });

            expect(sut.calculateTotalTax(taxes)).toEqual(dutyTaxesSum);
        });
    });
});
