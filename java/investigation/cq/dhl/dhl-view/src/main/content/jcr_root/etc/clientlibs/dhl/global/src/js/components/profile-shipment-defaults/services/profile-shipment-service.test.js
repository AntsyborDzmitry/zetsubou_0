import profileShipmentService from './profile-shipment-service';
import ewfCrudService from './../../../services/ewf-crud-service';

import 'angularMocks';

describe('profileShipmentService', () => {
    let sut;

    let $timeout;

    let ewfCrudServiceMock;
    let logServiceMock;
    let deferred;

    const INSURANCE_ENDPOINT = '/api/myprofile/shipment/defaults/insurance';
    const RETURN_SHIPMENTS_ENDPOINT = '/api/myprofile/shipment/defaults/return';
    const PICKUPS_ENDPOINT = '/api/myprofile/shipment/defaults/pickup';
    const SAVING_SHIPMENTS_ENDPOINT = '/api/myprofile/shipment/defaults/saving';
    const SOM_CURRENCY_ENDPOINT = '/api/myprofile/shipment/defaults/uomac';
    const PACKAGES_ENDPOINT = '/api/myprofile/shipment/defaults/packages';

    beforeEach(inject((_$q_, _$timeout_) => {
        $timeout = _$timeout_;

        deferred = _$q_.defer();

        const $http = {
            get: jasmine.createSpy('get').and.returnValue(deferred.promise),
            post: jasmine.createSpy('post').and.returnValue(deferred.promise)
        };

        logServiceMock = jasmine.createSpyObj('logService', ['error', 'log']);

        ewfCrudServiceMock = jasmine.mockComponent(new ewfCrudService($http, _$q_, logServiceMock));

        ewfCrudServiceMock.getElementList.and.callThrough();
        ewfCrudServiceMock.updateElement.and.callThrough();

        sut = new profileShipmentService(ewfCrudServiceMock);
    }));


    describe('#getProfileShipmentInsurance', () => {
        it('should make a call to API to get shipment insurance data', () => {
            sut.getShipmentInsurance();

            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(INSURANCE_ENDPOINT);
        });

        it('should load insurance details ', () => {
            const successResponse = {
                status: 200,
                data: {
                    insureShipments: false,
                    insureShipmentType: 0,
                    insuranceValue: 0,
                    insuranceCurrency: 'EUR'
                }
            };

            sut.getShipmentInsurance()
                .then((response) => {
                    expect(response).toBe(successResponse.data);

                    expect(logServiceMock.error).not.toHaveBeenCalled();
                });

           deferred.resolve(successResponse);

           $timeout.flush();
        });

        it('should log error when insurance data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail'
                }
            };

            sut.getShipmentInsurance()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#updateProfileShipmentInsurance', () => {
        it('should make a call to API to update shipment insurance data', () => {
            const insuranceDetails = {
                insureShipments: false,
                insureShipmentType: 0,
                insuranceValue: 0,
                insuranceCurrency: 'EUR'
            };

            sut.updateShipmentInsurance(insuranceDetails);

            expect(ewfCrudServiceMock.updateElement).toHaveBeenCalledWith(INSURANCE_ENDPOINT, insuranceDetails);
        });
    });

    describe('#getReturnShipments', () => {
        it('should make a call to API to get return shipment data', () => {
            sut.getReturnShipments();

            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(RETURN_SHIPMENTS_ENDPOINT);
        });

        it('should load insurance details ', () => {
            const successResponse = {
                status: 200,
                data: {
                    returnLabelType: 2,
                    returnLabelSendType: 0,
                    instructions: 'Go left and then forward. Ask John.'
                }
            };

            sut.getReturnShipments()
                .then((response) => {
                    expect(response).toBe(successResponse.data);

                    expect(logServiceMock.error).not.toHaveBeenCalled();
                });

            deferred.resolve(successResponse);

            $timeout.flush();
        });

        it('should log error when insurance data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail'
                }
            };

            sut.getReturnShipments()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#updateReturnShipments', () => {
        it('should make a call to API to update return shipment data', () => {
            const shipmentData = {
                returnLabelType: 2,
                returnLabelSendType: 0,
                instructions: 'Go left and then forward. Ask John.'
            };

            sut.updateReturnShipments(shipmentData);

            expect(ewfCrudServiceMock.updateElement).toHaveBeenCalledWith(RETURN_SHIPMENTS_ENDPOINT, shipmentData);
        });
    });

    describe('#getPickupsData', () => {
        it('should make a call to API to get pickups data', () => {
            sut.getPickupsData();

            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(PICKUPS_ENDPOINT);
        });

        it('should load pickup details ', () => {
            const successResponse = {
                status: 200,
                data: {}
            };

            sut.getPickupsData()
                .then((response) => {
                    expect(response).toBe(successResponse.data);

                    expect(logServiceMock.error).not.toHaveBeenCalled();
                });

            deferred.resolve(successResponse);

            $timeout.flush();
        });

        it('should log error when pickup data failed', () => {
            const errorResponse = {
                status: 403,
                data: {}
            };

            sut.getPickupsData()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#savePickupsData', () => {
        it('should make a call to API to update pickups data', () => {
            const data = {};

            sut.savePickupsData(data);

            expect(ewfCrudServiceMock.updateElement).toHaveBeenCalledWith(PICKUPS_ENDPOINT, data);
        });
    });

    describe('#getDefaultSavingShipments', () => {
        it('should make a call to API to get default savings data', () => {
            sut.getDefaultSavingShipment();

            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(SAVING_SHIPMENTS_ENDPOINT);
        });

        it('should load default saving shipments', () => {
            const successResponse = {
                status: 200,
                data: {
                    saveIncompleteShipments: false
                }
            };

            sut.getDefaultSavingShipment()
                .then((response) => {
                    expect(response).toBe(successResponse.data);

                    expect(logServiceMock.error).not.toHaveBeenCalled();
                });

            deferred.resolve(successResponse);

            $timeout.flush();
        });

        it('should log error when saving shipment data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'failed to load'
                }
            };

            sut.getDefaultSavingShipment()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#updateDefaultSavingShipment', () => {
        it('should make a call to API to update default savings data', () => {
            const savingShipment = {
                saveIncompleteShipments: true
            };

            sut.updateDefaultSavingShipment(savingShipment);

            expect(ewfCrudServiceMock.updateElement).toHaveBeenCalledWith(SAVING_SHIPMENTS_ENDPOINT, savingShipment);
        });
    });

    describe('#getDefaultSomAndCurrency', () => {
        it('should make a call to API to get som and currency data', () => {
            sut.getDefaultSomAndCurrency();

            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(SOM_CURRENCY_ENDPOINT);
        });

        it('should load default saving shipments', () => {
            const successResponse = {
                status: 200,
                data: {
                    som: 'imperial',
                    defaultCurrencyList: [
                        {
                            key: 'USD',
                            value: 'USD',
                            isTranslated: true
                        },
                        {
                            key: 'EUR',
                            value: 'EUR',
                            isTranslated: true
                        },
                        {
                            key: 'UAH',
                            value: 'UAH',
                            isTranslated: true
                        }
                    ],
                    defaultCurrency: 'USD'
                }
            };

            sut.getDefaultSomAndCurrency()
                .then((response) => {
                    expect(response).toBe(successResponse.data);

                    expect(logServiceMock.error).not.toHaveBeenCalled();
                });

            deferred.resolve(successResponse);

            $timeout.flush();
        });

        it('should log error when som and currency request failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'failed to load'
                }
            };

            sut.getDefaultSomAndCurrency()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#updateDefaultSomAndCurrency', () => {
        it('should make a call to API to update som and currency data', () => {
            const somAndCurrency = {
                som: 'IMPERIAL',
                defaultCurrencyList: [
                    {
                        key: 'USD',
                        value: 'USD'
                    },
                    {
                        key: 'EUR',
                        value: 'EUR'
                    },
                    {
                        key: 'UAH',
                        value: 'UAH'
                    }
                ],
                defaultCurrency: 'USD'
            };

            sut.updateDefaultSomAndCurrency(somAndCurrency);

            expect(ewfCrudServiceMock.updateElement).toHaveBeenCalledWith(SOM_CURRENCY_ENDPOINT, somAndCurrency);
        });

        it('should log error when update som and currency failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'failed to load'
                }
            };

            sut.updateDefaultSomAndCurrency()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#getPackagesData', () => {
        it('should make a call to API to get packages data', () => {
            sut.getPackagesData();

            expect(ewfCrudServiceMock.getElementList).toHaveBeenCalledWith(PACKAGES_ENDPOINT);
        });

        it('should load packages details ', () => {
            const successResponse = {
                status: 200,
                data: {}
            };

            sut.getPackagesData()
                .then((response) => {
                    expect(response).toBe(successResponse.data);

                    expect(logServiceMock.error).not.toHaveBeenCalled();
                });

            deferred.resolve(successResponse);

            $timeout.flush();
        });

        it('should log error when pickup data failed', () => {
            const errorResponse = {
                status: 403,
                data: {}
            };

            sut.getPackagesData()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);

                    expect(logServiceMock.error).toHaveBeenCalled();
                });

            deferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#updatePackagesData', () => {
        it('should make a call to API to update packages data', () => {
            const data = {};

            sut.updatePackagesData(data);

            expect(ewfCrudServiceMock.updateElement).toHaveBeenCalledWith(PACKAGES_ENDPOINT, data);
        });
    });
});
