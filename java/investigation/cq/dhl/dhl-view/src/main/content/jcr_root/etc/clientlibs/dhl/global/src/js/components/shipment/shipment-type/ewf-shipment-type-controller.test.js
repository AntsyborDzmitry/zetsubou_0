import EwfShipmentTypeController from './ewf-shipment-type-controller';
import UserService from './../../../services/user-service';
import ShipmentService from './../ewf-shipment-service';
import ShipmentTypeService from './shipment-type-service';
import 'angularMocks';

describe('EwfShipmentTypeController', () => {
    let sut, $q, $timeout;
    let shipmentTypeService, shipmentService, userService;
    let deferred, form, contactsKeys;
    let toContactRef, fromContactRef, userProfileRef, country;

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        toContactRef = {
            name: 'Food',
            group: 'TO_CONTACT',
            type: ''
        };
        fromContactRef = {
            name: 'Cat',
            group: 'FROM_CONTACT',
            type: 'MANDATORY'
        };
        userProfileRef = {
            name: 'Car',
            group: 'USER_PROFILE',
            type: 'DEFAULT'
        };

        contactsKeys = {
            fromContactKey: '007',
            toContactKey: '008'
        };

        country = 'US';

        userService = jasmine.mockComponent(new UserService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.getContactsKeys.and.returnValue(contactsKeys);
        shipmentService.getShipmentCountry.and.returnValue(country);
        shipmentTypeService = jasmine.mockComponent(new ShipmentTypeService());
        deferred = $q.defer();
        shipmentTypeService.getReferencesDetails.and.returnValue(deferred.promise);
        shipmentTypeService.getReferenceBehavior.and.returnValue(deferred.promise);
        shipmentTypeService.getShipmentParameters.and.returnValue(deferred.promise);

        sut = new EwfShipmentTypeController(userService, shipmentService, shipmentTypeService);
    }));

    it('should set primary reference type NEW on controller initializing', () => {
        expect(sut.primaryReference.type).toEqual('NEW');
    });

    describe('#init', () => {
        it('should get contact keys', () => {
            userService.isAuthorized.and.returnValue(true);
            sut.init();
            expect(shipmentService.getContactsKeys).toHaveBeenCalled();
        });

        it('should get shipment parameters', () => {
            sut.init();
            expect(shipmentTypeService.getShipmentParameters).toHaveBeenCalled();
        });

        it(`should call getReferencesDetails and getContactKeys service methods
                 to get available references if user regular`, () => {
            userService.isAuthorized.and.returnValue(true);
            sut.init();
            expect(shipmentTypeService.getReferencesDetails).toHaveBeenCalled();
        });

        it('should call loadReferenceBehavior service method to get available references if user regular', () => {
            userService.isAuthorized.and.returnValue(false);
            sut.init();
            expect(shipmentTypeService.getReferenceBehavior).toHaveBeenCalled();
        });

        it('should set title to reference caption if request success', () => {
            const response = {
                customReferenceCaption: 'custom title',
                lastShipmentReferenceList: [],
                referenceList: []
            };

            userService.isAuthorized.and.returnValue(true);
            sut.init();

            deferred.resolve(response);
            $timeout.flush();

            expect(sut.customReferenceCaption).toEqual('custom title');
        });

        it('should save references list from last shipment to vm in case of success request', () => {
            const response = {
                customReferenceCaption: 'custom title',
                lastShipmentReferenceList: [{
                        name: 'USER Shipping Reference 1',
                        group: 'USER_PROFILE',
                        type: 'DEFAULT'
                    }, {
                        name: 'USER Shipping Reference 2',
                        group: 'USER_PROFILE',
                        type: 'DEFAULT'
                    }],
                referenceList: [toContactRef, fromContactRef, userProfileRef]
            };

            sut.primaryReference = jasmine.createSpyObj('primaryReference', ['name', 'type']);
            const firstElement = () => response.lastShipmentReferenceList[0];
            spyOn(response.lastShipmentReferenceList, 'shift').and.callFake(firstElement);
            userService.isAuthorized.and.returnValue(true);
            sut.init();

            deferred.resolve(response);
            $timeout.flush();

            expect(sut.primaryReference.name).toEqual('USER Shipping Reference 1');
        });

        it('should set new primary reference if it was not passed in response', () => {
            sut.primaryReference = {name: 'some name'};

            userService.isAuthorized.and.returnValue(true);
            sut.init();
            deferred.resolve({
                customReferenceCaption: 'custom title',
                referenceList: [toContactRef, fromContactRef]
            });
            $timeout.flush();

            expect(sut.primaryReference).toEqual(jasmine.objectContaining({name: '', type: 'NEW'}));
        });

        it('should save references list to vm in case of success request', () => {
            const response = {
                customReferenceCaption: 'custom title',
                lastShipmentReferenceList: [],
                referenceList: [toContactRef, fromContactRef, userProfileRef]
            };

            userService.isAuthorized.and.returnValue(true);
            sut.init();

            deferred.resolve(response);
            $timeout.flush();

            const expectedResult = {
                toContactReferences: [toContactRef],
                fromContactReferences: [fromContactRef],
                userProfileReferences: [userProfileRef]
            };
            expect(sut).toEqual(jasmine.objectContaining(expectedResult));
        });

        it('should NOT duplicate references list in case of returning to the reference block second time', () => {
            const response = {
                customReferenceCaption: 'custom title',
                lastShipmentReferenceList: [],
                referenceList: [toContactRef, fromContactRef, userProfileRef]
            };

            userService.isAuthorized.and.returnValue(true);

            //init 2 times to imitate return back
            sut.init();
            sut.init();

            deferred.resolve(response);
            $timeout.flush();

            const expectedResult = {
                toContactReferences: [toContactRef],
                fromContactReferences: [fromContactRef],
                userProfileReferences: [userProfileRef]
            };
            expect(sut).toEqual(jasmine.objectContaining(expectedResult));
        });

        it('should set error if case of error', () => {
            const error = [{errors: 'Error message'}];

            sut.init();

            deferred.reject(error);
            $timeout.flush();

            expect(sut.error).toEqual(error);
        });
    });

    describe('#addReference', () => {
        it('should add reference to additionalReferences', () => {
            const ref = {
                name: ''
            };

            sut.additionalReferences.push = jasmine.createSpy('push');
            sut.addReference();

            expect(sut.additionalReferences.push).toHaveBeenCalledWith(ref);
        });
    });

    describe('#removeReference', () => {
        it('should remove reference from additionalReferences', () => {
            const ref = {
                name: ''
            };
            sut.additionalReferences = [ref];
            sut.additionalReferences.splice = jasmine.createSpy('splice');
            sut.removeReference(ref);

            expect(sut.additionalReferences.splice).toHaveBeenCalledWith(0, 1);
        });
    });

    describe('#pickReference', () => {
        it('should set value of picked reference to current row with input', () => {
            const row = {
                name: 'Food'
            };
            const ref = {
                name: 'Food'
            };
            sut.pickReference(row, ref);

            expect(row.name).toEqual(ref.name);
        });
    });

    describe('#referencesListVisible', () => {
        let row;

        beforeEach(() => {
            row = {
                isReferencesListVisible: undefined
            };
            sut.isReferencesListVisibleForPrimary = undefined;
            sut.userProfileReferences = [];
            sut.fromContactReferences = [];
            sut.toContactReferences = [];
        });

        it('should show references list for row', () => {
            sut.userProfileReferences.push({});
            sut.referencesListVisible(row);

            expect(row.isReferencesListVisible).toEqual(true);
        });

        it('should show references list for primary row if there is no row', () => {
            sut.userProfileReferences.push({});
            sut.referencesListVisible();

            expect(sut.isReferencesListVisibleForPrimary).toEqual(true);
        });

        it('should hide references list for row', () => {
            sut.referencesListVisible(row);

            expect(row.isReferencesListVisible).toEqual(false);
        });

        it('should hide references list for primary row if there is no row', () => {
            sut.referencesListVisible();

            expect(sut.isReferencesListVisibleForPrimary).toEqual(false);
        });
    });

    describe('#isNextButtonVisible', () => {
        it('should be falsy if shipment type is not chosen', () => {
            sut.shipmentType = null;
            expect(sut.isNextButtonVisible()).toEqual(false);
        });

        it('should be truthy if shipment type is document', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.DOCUMENT;
            expect(sut.isNextButtonVisible()).toEqual(true);
        });

        it('should be falsy if shipment type is package, but customs invoice type is not chosen', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            expect(sut.isNextButtonVisible()).toEqual(false);
        });

        it('should be truthy if shipment type is package and customs invoice type is use existing', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.USE;

            expect(sut.isNextButtonVisible()).toEqual(true);
        });
        it('should be truthy if shipment type is package and customs invoice type is create new', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.CREATE;

            expect(sut.isNextButtonVisible()).toEqual(true);
        });
    });

    describe('#isEnhancedCustomsInvoiceVisible', () => {
        it('should be falsy if shipment type is not defined', () => {
            expect(sut.isEnhancedCustomsInvoiceVisible()).toEqual(false);
        });

        it('should be falsy if shipment type is document', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.DOCUMENT;
            expect(sut.isEnhancedCustomsInvoiceVisible()).toEqual(false);
        });

        it('should be falsy if shipment type is package, but customs invoice type is not defined', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            expect(sut.isEnhancedCustomsInvoiceVisible()).toEqual(false);
        });

        it('should be falsy if shipment type is package, but customs invoice type is "use my own"', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.USE;

            expect(sut.isEnhancedCustomsInvoiceVisible()).toEqual(false);
        });

        it('should be true if shipment type is package and customs invoice is "create new"', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.CREATE;

            expect(sut.isEnhancedCustomsInvoiceVisible()).toEqual(true);
        });
    });

    describe('#onNextClick', () => {
        const referenceList = [{
            name: 'USER Shipping Reference 1',
            group: 'TO_CONTACT',
            type: 'DEFAULT'
        }, {
            name: 'USER Shipping Reference 2',
            group: 'FROM_CONTACT',
            type: 'DEFAULT'
        }, {
            name: 'USER Shipping Reference 3',
            group: 'USER_PROFILE',
            type: 'DEFAULT'
        }];
        const primaryReference = {
            name: 'USER Shipping Reference 1',
            group: 'USER_PROFILE',
            type: 'DEFAULT'
        };
        const additionalReferences = [{
            name: 'USER Shipping Reference 3',
            group: 'USER_PROFILE',
            type: 'DEFAULT'
        }, {
            name: 'USER Shipping Reference 2',
            group: 'FROM_CONTACT',
            type: 'DEFAULT'
        }, {
            name: 'New reference'
        }];
        const expectedPreparedReferences = [{
            name: 'USER Shipping Reference 1',
            group: 'USER_PROFILE',
            type: 'DEFAULT'
        }, {
            name: 'USER Shipping Reference 3',
            group: 'USER_PROFILE',
            type: 'DEFAULT'
        }, {
            name: 'USER Shipping Reference 2',
            group: 'FROM_CONTACT',
            type: 'DEFAULT'
        }, {
            name: 'New reference',
            group: 'USER_PROFILE',
            type: 'NEW'
        }];

        let nextCallback, ewfFormCtrl;

        beforeEach(() => {
            sut.init();

            ewfFormCtrl = {
                ewfValidation: jasmine.createSpy().and.returnValue(true)
            };

            nextCallback = jasmine.createSpy('nextCallback');
            sut.setNextCallback(nextCallback);
        });

        describe('when can pass shipment-type step', () => {
            beforeEach(() => {
                deferred.resolve({});
                $timeout.flush();

                Object.assign(sut, {
                    shipmentType: sut.SHIPMENT_TYPE.DOCUMENT,
                    referenceList,
                    primaryReference,
                    additionalReferences
                });
                form = {
                    $valid: true
                };
                sut.onNextClick(form, ewfFormCtrl);
            });

            it('should call next callback if checked DOCUMENT and form is valid', () => {
                expect(nextCallback).toHaveBeenCalledWith();
            });

            it('should set shipment type', () => {
                expect(shipmentService.setShipmentType).toHaveBeenCalledWith(sut.shipmentType);
            });

            it('should set shipment references', () => {
                expect(shipmentService.setShipmentReferences).toHaveBeenCalledWith(expectedPreparedReferences);
            });

            it('should unset customs invoice if user chosed documents', () => {
                expect(shipmentService.setCustomsInvoice).toHaveBeenCalledWith();
            });
        });

        describe('when can NOT pass shipment-type step', () => {
            beforeEach(() => {
                Object.assign(sut, {
                    shipmentType: sut.SHIPMENT_TYPE.DOCUMENT,
                    referenceList,
                    primaryReference,
                    additionalReferences
                });
                form = {
                    $invalid: false,
                    $error: {
                        ewfValid: []
                    }
                };
                sut.onNextClick(form, ewfFormCtrl);
            });

            it('should NOT call next callback if checked DOCUMENT and even form is valid', () => {
                expect(nextCallback).not.toHaveBeenCalled();
            });

            it('should NOT set shipment type using service', () => {
                expect(shipmentService.setShipmentType).not.toHaveBeenCalled();
            });

            it('should NOT set shipment references using service', () => {
                expect(shipmentService.setShipmentReferences).not.toHaveBeenCalled();
            });

            it('should NOT unset customs invoice if user chosed documents', () => {
                expect(shipmentService.setCustomsInvoice).not.toHaveBeenCalled();
            });
        });

        describe('when selected shipment type is PACKAGE', () => {
            const itemAttributesPreset = {
                customsInvoiceType: 'CREATE',
                itemAttrCtrl: {
                    itemAttrFormCtrl: {
                        itemAttributesModel: {
                            products: {
                                list: [],
                                total: 0
                            }
                        },
                        onNextClick: jasmine.createSpy('onNextClick')
                    },
                    onNextClick: jasmine.createSpy('onNextClick')
                }
            };
            let itar;

            beforeEach(() => {
                deferred.resolve({});
                $timeout.flush();

                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: true
                };
                form = {
                    $invalid: false
                };
                Object.assign(sut, {
                    shipmentType: sut.SHIPMENT_TYPE.PACKAGE,
                    itarCtrl: {
                        getItar: jasmine.createSpy('getItar').and.returnValue(itar)
                    }
                });
            });

            it('should call next callback if checked PACKAGE', () => {
                sut.onNextClick(form, ewfFormCtrl);
                expect(nextCallback).toHaveBeenCalled();
            });

            it('should set shipment type using service', () => {
                sut.onNextClick(form, ewfFormCtrl);
                expect(shipmentService.setShipmentType).toHaveBeenCalledWith(sut.shipmentType);
            });

            it('should set itar using service', () => {
                sut.onNextClick(form, ewfFormCtrl);
                expect(shipmentService.setItar).toHaveBeenCalledWith(itar);
            });

            it('should call item attributes form next callback', () => {
                Object.assign(sut, itemAttributesPreset);
                sut.onNextClick(form, ewfFormCtrl);

                expect(sut.itemAttrCtrl.onNextClick).toHaveBeenCalled();
            });

            it('should call item attributes next callback', () => {
                Object.assign(sut, itemAttributesPreset);
                sut.onNextClick(form, ewfFormCtrl);

                expect(sut.itemAttrCtrl.itemAttrFormCtrl.onNextClick).toHaveBeenCalled();
            });

            it('should unset customs invoice if user is not creating new customs invoice', () => {
                sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.USE;
                sut.onNextClick(form, ewfFormCtrl);

                expect(shipmentService.setCustomsInvoice).toHaveBeenCalledWith();
            });

            it('should NOT call Next callback if form is invalid', () => {
                form.$invalid = true;
                sut.onNextClick(form, ewfFormCtrl);

                expect(nextCallback).not.toHaveBeenCalled();
            });
        });

        describe('when selected shipment type is PACKAGE but shipment-type is not passable', () => {
            let itar;

            beforeEach(() => {
                itar = {
                    departmentOfState: false,
                    federalTradeRegulations: true
                };
                form = {
                    $invalid: false
                };
                Object.assign(sut, {
                    shipmentType: sut.SHIPMENT_TYPE.PACKAGE,
                    itarCtrl: {
                        getItar: jasmine.createSpy('getItar').and.returnValue(itar)
                    }
                });
            });

            it('should NOT call next callback if checked PACKAGE', () => {
                sut.onNextClick(form, ewfFormCtrl);
                expect(nextCallback).not.toHaveBeenCalled();
            });

            it('should NOT set shipment type using service', () => {
                sut.onNextClick(form, ewfFormCtrl);
                expect(shipmentService.setShipmentType).not.toHaveBeenCalled();
            });

            it('should NOT set ITAR using service', () => {
                sut.onNextClick(form, ewfFormCtrl);
                expect(shipmentService.setItar).not.toHaveBeenCalled();
            });

            it('should NOT call item attributes next callback if checked PACKAGE', () => {
                Object.assign(sut, {
                    customsInvoiceType: sut.CUSTOMS_INVOICE_TYPE.CREATE,
                    itemAttrCtrl: {
                        onNextClick: jasmine.createSpy('onNextClick')
                    }
                });
                sut.onNextClick(form, ewfFormCtrl);

                expect(sut.itemAttrCtrl.onNextClick).not.toHaveBeenCalled();
            });

            it('should NOT unset customs invoice if user is not creating new customs invoice', () => {
                sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.USE;
                sut.onNextClick(form, ewfFormCtrl);

                expect(shipmentService.setCustomsInvoice).not.toHaveBeenCalled();
            });
        });
    });

    describe('#updateShipmentType', () => {
        it('should call shipment service to set the type', () => {
            sut.updateShipmentType(sut.SHIPMENT_TYPE.PACKAGE);
            expect(shipmentService.setShipmentType).toHaveBeenCalledWith(sut.SHIPMENT_TYPE.PACKAGE);
        });

        it('should call service with controller\'s shipmentType if other was not passed', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.updateShipmentType();
            expect(shipmentService.setShipmentType).toHaveBeenCalledWith(sut.SHIPMENT_TYPE.PACKAGE);
        });
    });

    describe('#updateCustomsInvoiceType', () => {
        it('should update customs invoice type', () => {
            const type = 'test';
            sut.updateCustomsInvoiceType(type);

            expect(shipmentService.setCustomsInvoiceType).toHaveBeenCalledWith(type);
        });
    });

    describe('#onEdit', () => {
        it(`should call load of reference details
                if user is authorized and contacts on previous step was changed`, () => {
            userService.isAuthorized.and.returnValue(true);

            sut.onEdit();

            expect(shipmentService.getContactsKeys).toHaveBeenCalled();
            expect(shipmentTypeService.getReferencesDetails)
                .toHaveBeenCalledWith(contactsKeys.fromContactKey, contactsKeys.toContactKey);
        });

        it('should call load of reference behavior if user not authorized', () => {
            userService.isAuthorized.and.returnValue(false);

            sut.onEdit();

            expect(shipmentService.getContactsKeys).toHaveBeenCalled();
            expect(shipmentService.getShipmentCountry).toHaveBeenCalled();
            expect(shipmentTypeService.getReferenceBehavior).toHaveBeenCalledWith(country);
        });

        it('should set error in case of error', () => {
            const error = [{errors: 'Error message'}];

            sut.onEdit();

            deferred.reject(error);
            $timeout.flush();

            expect(sut.error).toEqual(error);
        });
    });

    describe('#isReferenceDisabled', () => {
        it('should be truthy if primary reference type is mandatory', () => {
            sut.primaryReference.type = 'MANDATORY';
            expect(sut.isReferenceDisabled()).toEqual(true);
        });

        it('should be falsy if primary reference type is not mandatory', () => {
            sut.primaryReference.type = 'DEFAULT';
            expect(sut.isReferenceDisabled()).toEqual(false);
        });

        it('should be falsy if there is no primary reference', () => {
            sut.primaryReference = null;
            expect(sut.isReferenceDisabled()).toEqual(false);
        });
    });

    describe('#isShippingPurposeEmpty', () => {
        beforeEach(() => {
            sut.itemAttrCtrl = {};
        });

        it('should return false if shipment type is not package', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.DOCUMENT;
            expect(sut.isShippingPurposeEmpty()).toEqual(false);
        });

        it('should return false if shipment type is package but customs invoice type is not CREATE NEW', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.USE;

            expect(sut.isShippingPurposeEmpty()).toEqual(false);
        });

        it('should return false if shipping purpose is defined', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.CREATE;
            sut.itemAttrCtrl.shippingPurpose = 'test';

            expect(sut.isShippingPurposeEmpty()).toEqual(false);
        });

        it('should return true if shipping purpose is empty', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;
            sut.customsInvoiceType = sut.CUSTOMS_INVOICE_TYPE.CREATE;
            sut.itemAttrCtrl.shippingPurpose = '';

            expect(sut.isShippingPurposeEmpty()).toEqual(true);
        });
    });

    describe('#getCurrentIncompleteData', () => {
        beforeEach(() => {
            sut.init();

            sut.referenceList = [{
                name: 'USER Shipping Reference 1',
                group: 'TO_CONTACT',
                type: 'DEFAULT'
            }, {
                name: 'USER Shipping Reference 2',
                group: 'FROM_CONTACT',
                type: 'DEFAULT'
            }, {
                name: 'USER Shipping Reference 3',
                group: 'USER_PROFILE',
                type: 'DEFAULT'
            }];

            sut.primaryReference = {
                name: 'USER Shipping Reference 1',
                group: 'USER_PROFILE',
                type: 'DEFAULT'
            };

            sut.additionalReferences = [{
                name: 'USER Shipping Reference 3',
                group: 'USER_PROFILE',
                type: 'DEFAULT'
            }, {
                name: 'USER Shipping Reference 2',
                group: 'FROM_CONTACT',
                type: 'DEFAULT'
            }, {
                name: 'New reference'
            }];
        });

        it('should get incomplete data without validation when type is DOCUMENT', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.DOCUMENT;

            const preparedReferences = [{
                name: 'USER Shipping Reference 1',
                group: 'USER_PROFILE',
                type: 'DEFAULT'
            }, {
                name: 'USER Shipping Reference 3',
                group: 'USER_PROFILE',
                type: 'DEFAULT'
            }, {
                name: 'USER Shipping Reference 2',
                group: 'FROM_CONTACT',
                type: 'DEFAULT'
            }, {
                name: 'New reference',
                group: 'USER_PROFILE',
                type: 'NEW'
            }];

            sut.getCurrentIncompleteData();

            expect(shipmentService.setShipmentType).toHaveBeenCalledWith(sut.shipmentType);
            expect(shipmentService.setShipmentReferences).toHaveBeenCalledWith(preparedReferences);
        });

        it('should get incomplete data without validation when type is PACKAGE', () => {
            sut.shipmentType = sut.SHIPMENT_TYPE.PACKAGE;

            sut.itarCtrl = {
                getItar: jasmine.createSpy('getItar').and.returnValue('itar')
            };

            sut.getCurrentIncompleteData();

            expect(shipmentService.setShipmentType).toHaveBeenCalledWith(sut.shipmentType);
            expect(shipmentService.setItar).toHaveBeenCalledWith('itar');
        });
    });

    describe('#loadShipmentData', () => {
        const shipmentData = {
            type: 'DOCUMENT',
            references: [
                {
                    name: 'Name 1',
                    group: 'Group 1',
                    type: 'Type 1'
                },
                {
                    name: 'Name 2',
                    group: 'Group 2',
                    type: 'Type 2'
                }
            ]
        };
        const shipmentTypeData = {
            shipmentType: 'DOCUMENT',
            primaryReference: {
                name: 'Name 1',
                group: 'Group 1',
                type: 'Type 1'
            },
            additionalReferences: [
                {
                    name: 'Name 2',
                    group: 'Group 2',
                    type: 'Type 2'
                }
            ]
        };

        beforeEach(() => {
            shipmentService.getShipmentTypeData.and.returnValue(shipmentTypeData);
            sut.loadShipmentData(shipmentData);
        });

        it('should populate controller with data', () => {
            expect(shipmentService.getShipmentTypeData).toHaveBeenCalledWith(shipmentData);
            expect(sut).toEqual(jasmine.objectContaining(shipmentTypeData));
        });
    });
});
