define(['exports', 'module', 'ewf', './../../services/date-time-service', './payment-type/payment-type-service'], function (exports, module, _ewf, _servicesDateTimeService, _paymentTypePaymentTypeService) {
    'use strict';

    module.exports = ShipmentService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

    var _ewf2 = _interopRequireDefault(_ewf);

    ShipmentService.$inject = ['$http', '$q', 'logService', 'dateTimeService', 'paymentTypeService'];
    _ewf2['default'].service('shipmentService', ShipmentService);

    function ShipmentService($http, $q, logService, dateTimeService, paymentTypeService) {
        // private
        var countriesNames = {
            from: '',
            to: ''
        };
        var shipmentType = '';
        var customsInvoiceType = null;
        var currenciesList = [];

        var totalWeight = {
            value: '',
            unit: ''
        };

        var SHIPMENT_TYPES = {
            DOCUMENT: 'DOCUMENT',
            PACKAGE: 'PACKAGE'
        };

        function Address() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            data.addressDetails = data.addressDetails || {};
            data.addressDetails.countryCode = data.addressDetails.countryCode || null;
            return {
                countryCode: data.addressDetails.countryCode || '', // US, UA
                countryDivisionName: '',
                countryDHLName: '',
                stateOrProvince: data.addressDetails.stateOrProvince,
                cityName: data.addressDetails.city,
                citySuburbName: '',
                postCode: data.addressDetails.zipOrPostCode,
                addressLine1: data.addressDetails.addrLine1 ? data.addressDetails.addrLine1.fullAddress || data.addressDetails.addrLine1 : undefined,
                addressLine2: data.addressDetails.addrLine2,
                addressLine3: data.addressDetails.addrLine3,
                addressType: '',
                geoPositionLatitude: '',
                geoPositionLongitude: '',
                geoPositionAltitude: '',
                resAttrOpts: ''
            };
        }

        function Phone() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var _data$phoneDetails = data.phoneDetails;
            var phoneDetails = _data$phoneDetails === undefined ? {} : _data$phoneDetails;

            return {
                phoneType: phoneDetails.phoneType,
                phoneCountryCode: phoneDetails.phoneCountryCode,
                phone: phoneDetails.phone ? phoneDetails.phone.replace(/\s/g, '') : null,
                phoneExt: phoneDetails.phoneExt,
                smsEnabled: phoneDetails.smsEnabled
            };
        }

        function Piece(packageRow) {
            this.height = packageRow.height;
            this.width = packageRow.width;
            this.length = packageRow.length;
            this.weight = packageRow.weight;
            this.unit = packageRow.unit;
            this.quantity = packageRow.quantity;
            this.packageId = packageRow.packageId;
            this.refNum = packageRow.reference;
        }

        var shipmentData = {
            // Address Details - START
            fromAddress: new Address(),
            toAddress: new Address(),
            fromName: '',
            toName: '',
            fromEmail: '',
            toEmail: '',
            fromCompany: '',
            toCompany: '',
            fromVatTax: '',
            toVatTax: '',
            // Address Details - END

            // Shipment Type - START
            type: 'DOCUMENT',
            documentDescription: 'document description', // required
            references: [],
            extendedLiability: false, // Boolean
            // Shipment Type - END

            // Customs Invoice - START
            customsInvoice: null,
            itar: null,
            // Customs Invoice - END

            // Packaging Details - START
            pieces: [],
            // Packaging Details - END

            // Payment Info - START
            paymentInfo: {
                dutiesPaymentType: '',
                dutiesPaymentAccountNumber: '',
                taxesPaymentType: '',
                taxesPaymentAccountNumber: '',
                transportationPaymentType: '',
                transportationPaymentAccountNumber: '',
                quotationType: '',
                quotationAccountNumber: '',
                splitDutyAndTaxPayment: false // Boolean
            },
            // Payment Info - END

            // Shipment Product - START
            product: {},
            // Shipment Product - END

            // Shipment Date - START
            date: null,
            // Shipment Date - END

            // Optional Services - START
            optionalServices: [{
                //private Boolean holdShipmentForRecipient;
                //private Boolean neutralDeliveryService;
                //private Boolean dangerousGoods;
            }],
            digitalCustomsInvoice: {
                document: null,
                additionalDocuments: []
            },
            // Optional Services - END

            // Pick Up - START
            pickup: {
                pickupDetails: {
                    pickupLocation: {
                        name: '',
                        company: '',
                        pickupAddress: {
                            countryCode: '',
                            addressLine1: '',
                            postCode: '',
                            cityName: '',
                            stateOrProvince: ''
                        }
                    },
                    pickupLocationType: '',
                    pickupLocationOtherDescription: '',
                    instructions: '',
                    pickupDate: '',
                    pickupWindow: {
                        earliestTime: '',
                        latestTime: ''
                    }
                },
                totalWeight: {
                    unit: '',
                    value: ''
                }
            },
            // Pick Up - END

            // Associate with contact id - START
            associateWithContactId: '',
            // Associate with contact id - END

            //Incoterm - START
            incoterm: '',
            //Incoterm - END

            // Reward Card - START
            promotionCode: '',
            rewardCode: '',
            rewardCard: '',
            // Reward Card - END
            creditCardPaymentInfo: {}
        };

        var publicAPI = {
            getCountrySomParameters: getCountrySomParameters,
            setCountrySomParameters: setCountrySomParameters,
            getCurrencies: getCurrencies,
            setCurrencies: setCurrencies,
            setAddressDetails: setAddressDetails,
            setPhoneDetails: setPhoneDetails,
            getCustomsInvoice: getCustomsInvoice,
            setCustomsInvoice: setCustomsInvoice,
            setCustomsInvoicePurpose: setCustomsInvoicePurpose,
            getCustomsInvoiceType: getCustomsInvoiceType,
            setCustomsInvoiceType: setCustomsInvoiceType,
            setItar: setItar,
            setPackageDetails: setPackageDetails,
            setShipmentReferences: setShipmentReferences,
            getShipmentCountry: getShipmentCountry,
            getShipmentPostCode: getShipmentPostCode,
            setShipmentProduct: setShipmentProduct,
            getShipmentCityName: getShipmentCityName,
            getShipmentProduct: getShipmentProduct,
            setShipmentDate: setShipmentDate,
            getShipmentDate: getShipmentDate,
            setContactsKeys: setContactsKeys,
            getContactsKeys: getContactsKeys,
            setShipmentType: setShipmentType,
            getShipmentType: getShipmentType,
            getShipmentData: getShipmentData,
            getDestinationCountry: getDestinationCountry,
            setAssociateWithContactId: setAssociateWithContactId,
            setPaymentInfo: setPaymentInfo,
            getPaymentInfo: getPaymentInfo,
            setIncoterm: setIncoterm,
            getIncoterm: getIncoterm,
            setTotalWeight: setTotalWeight,
            getTotalWeight: getTotalWeight,
            setPickupData: setPickupData,
            getPickupData: getPickupData,
            saveShipment: saveShipment,
            getQuotesRequestData: getQuotesRequestData,
            isPackage: isPackage,
            isShipmentWithInvoice: isShipmentWithInvoice,
            chargeShipment: chargeShipment,
            saveShipmentForLater: saveShipmentForLater,
            setPaymentProductInfo: setPaymentProductInfo,
            completeShipmentPayment: completeShipmentPayment,
            getSavedShipmentData: getSavedShipmentData,
            getAddressDetails: getAddressDetails,
            getFromContactFields: getFromContactFields,
            getToContactFields: getToContactFields,
            getReceiverContactDetails: getReceiverContactDetails,
            getInvolvedPartiesAddressDetails: getInvolvedPartiesAddressDetails,
            getShipmentTypeData: getShipmentTypeData,
            getPickupModelData: getPickupModelData,
            getPaymentTypeModelData: getPaymentTypeModelData,
            getPackageDetailsModelData: getPackageDetailsModelData,
            getShipmentProductsModelData: getShipmentProductsModelData,
            setRewardCard: setRewardCard,
            getRewardCard: getRewardCard,
            setCreditCardPaymentInfo: setCreditCardPaymentInfo,
            getCreditCardPaymentInfo: getCreditCardPaymentInfo,
            getFormattedShipperAddress: getFormattedShipperAddress,
            getShipperAddress: getShipperAddress
        };

        function getCountrySomParameters() {
            return {
                shipperCountrySom: shipmentData.shipperCountrySom,
                userProfileCountrySom: shipmentData.userProfileCountrySom,
                weightConvertionRate: shipmentData.weightConvertionRate,
                dimensionConvertionRate: shipmentData.dimensionConvertionRate,
                shipperCountryConversionPrecision: shipmentData.shipperCountryConversionPrecision,
                userProfileCountryConversionPrecision: shipmentData.userProfileCountryConversionPrecision
            };
        }

        function setCountrySomParameters(shipperCountrySom, userProfileCountrySom) {
            var weightConvertionRate = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
            var dimensionConvertionRate = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
            var shipperCountryConversionPrecision = arguments.length <= 4 || arguments[4] === undefined ? 2 : arguments[4];
            var userProfileCountryConversionPrecision = arguments.length <= 5 || arguments[5] === undefined ? 2 : arguments[5];

            Object.assign(shipmentData, {
                shipperCountrySom: shipperCountrySom,
                userProfileCountrySom: userProfileCountrySom,
                weightConvertionRate: weightConvertionRate,
                dimensionConvertionRate: dimensionConvertionRate,
                shipperCountryConversionPrecision: shipperCountryConversionPrecision,
                userProfileCountryConversionPrecision: userProfileCountryConversionPrecision
            });
        }

        function getCurrencies() {
            return currenciesList;
        }

        function setCurrencies(currencies) {
            currenciesList = currencies;
        }

        function setAddressDetails(fromData, toData) {
            shipmentData.fromAddress = new Address(fromData);
            shipmentData.toAddress = new Address(toData);
            shipmentData.fromName = fromData.name;
            shipmentData.toName = toData.name;
            shipmentData.fromEmail = fromData.email;
            shipmentData.toEmail = toData.email;
            shipmentData.fromCompany = fromData.company || '';
            shipmentData.toCompany = toData.company || '';
            shipmentData.fromVatTax = fromData.vatTax || '';
            shipmentData.toVatTax = toData.vatTax || '';
            shipmentData.toResidentialAddress = toData.addressDetails.residentialAddress;
            shipmentData.toNickname = toData.nickname;
            countriesNames.from = fromData.addressDetails.countryName;
            countriesNames.to = toData.addressDetails.countryName;
        }

        function setPhoneDetails(fromData, toData) {
            Object.assign(shipmentData, {
                fromPhone: new Phone(fromData),
                toPhone: new Phone(toData)
            });
        }

        function getCustomsInvoice() {
            return shipmentData.customsInvoice;
        }

        function setCustomsInvoice(customsInvoiceModel) {
            if (!customsInvoiceModel) {
                shipmentData.customsInvoice = null;
                return;
            }

            shipmentData.customsInvoice = {
                description: customsInvoiceModel.invoiceDescription,
                totalPiece: customsInvoiceModel.totalQuantity,
                totalWeight: customsInvoiceModel.totalNetWeight,
                totalGrossWeight: customsInvoiceModel.totalGrossWeight,
                totalDeclareValue: customsInvoiceModel.totalDeclareValue,
                currencyCode: customsInvoiceModel.currentCurrency.type,
                items: customsInvoiceModel.productList
            };
        }

        function setCustomsInvoicePurpose(purpose) {
            shipmentData.customsInvoice = shipmentData.customsInvoice || {};
            shipmentData.customsInvoice.reasonForExport = purpose;
        }

        function getCustomsInvoiceType() {
            return customsInvoiceType;
        }

        function setCustomsInvoiceType(type) {
            customsInvoiceType = type;
        }

        function setItar(itar) {
            shipmentData.itar = itar || null;
        }

        function setPackageDetails(packagesRows) {
            shipmentData.pieces = packagesRows.map(function (row) {
                return new Piece(row);
            });
        }

        function setShipmentReferences(references) {
            shipmentData.references = references;
        }

        function getShipmentCountry() {
            if (!shipmentData.fromAddress || !shipmentData.fromAddress.countryCode) {
                return null;
            }
            return shipmentData.fromAddress.countryCode;
        }

        function getDestinationCountry() {
            if (!shipmentData.toAddress || !shipmentData.toAddress.countryCode) {
                return null;
            }
            return shipmentData.toAddress.countryCode;
        }

        function getShipmentPostCode() {
            if (!shipmentData.fromAddress || !shipmentData.fromAddress.postCode) {
                return null;
            }
            return shipmentData.fromAddress.postCode;
        }

        function getShipmentCityName() {
            if (!shipmentData.fromAddress || !shipmentData.fromAddress.cityName) {
                return null;
            }
            return shipmentData.fromAddress.cityName;
        }

        function setShipmentProduct(product) {
            shipmentData.product = product;
        }

        function getShipmentProduct() {
            return shipmentData.product;
        }

        function setContactsKeys(keys) {
            Object.assign(shipmentData, keys);
        }

        function getContactsKeys() {
            var fromContactKey = shipmentData.fromContactKey;
            var toContactKey = shipmentData.toContactKey;

            return {
                fromContactKey: fromContactKey,
                toContactKey: toContactKey
            };
        }

        function setShipmentType(type) {
            shipmentData.type = shipmentType = type;
        }

        function getShipmentType() {
            return shipmentType;
        }

        function setShipmentDate(date) {
            shipmentData.date = date;
        }

        function getShipmentDate() {
            return shipmentData.date;
        }

        function getShipmentData() {
            return shipmentData;
        }

        function setAssociateWithContactId(id) {
            shipmentData.asociateWithContactId = id;
        }

        function setPaymentInfo(data) {
            angular.extend(shipmentData.paymentInfo, {
                splitDutyAndTaxPayment: data.splitDutyAndTaxPayment,
                dutiesPaymentType: data.dutiesPaymentType,
                dutiesPaymentAccountNumber: data.dutiesPaymentAccountNumber,
                taxesPaymentType: data.taxesPaymentType,
                taxesPaymentAccountNumber: data.taxesPaymentAccountNumber,
                transportationPaymentType: data.transportationPaymentType,
                transportationPaymentAccountNumber: data.transportationPaymentAccountNumber,
                quotationType: data.quotationType,
                quotationAccountNumber: data.quotationAccountNumber
            });
        }

        function getPaymentInfo() {
            return shipmentData.paymentInfo;
        }

        function setIncoterm(data) {
            shipmentData.incoterm = data;
        }

        function getIncoterm() {
            return shipmentData.incoterm;
        }

        function setTotalWeight(weight, uom) {
            totalWeight = {
                value: weight,
                unit: uom
            };
        }

        function getTotalWeight() {
            return totalWeight;
        }

        function setPickupData(data) {
            Object.assign(shipmentData.pickup, data);
        }

        function getPickupData() {
            return shipmentData.pickup;
        }

        function setRewardCard(data) {
            Object.assign(shipmentData, data);
        }

        function getRewardCard() {
            return {
                promotionCode: shipmentData.promotionCode,
                rewardCode: shipmentData.rewardCode,
                rewardCard: shipmentData.rewardCard
            };
        }

        function saveShipment() {
            return $http.post('/api/shipment', shipmentData).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('ShipmentService#saveShipment: response error', response);
                return $q.reject(response);
            });
        }

        function getAddress(currentShipmentData, fromOrTo) {
            var address = currentShipmentData[fromOrTo + 'Address'];
            return {
                countryCode: address.countryCode,
                zipOrPostCode: address.postCode,
                stateOrProvince: address.stateOrProvince,
                city: address.cityName,
                addrLine1: address.addressLine1,
                addrLine2: address.addressLine2,
                addrLine3: address.addressLine3,
                contactName: currentShipmentData[fromOrTo + 'Name'],
                companyName: currentShipmentData[fromOrTo + 'Company']
            };
        }

        function getFormattedShipperAddress() {
            var currentShipmentData = arguments.length <= 0 || arguments[0] === undefined ? shipmentData : arguments[0];

            return getAddress(currentShipmentData, 'from');
        }

        function getFormattedReceiverAddress(currentShipmentData) {
            return getAddress(currentShipmentData, 'to');
        }

        function getShipperAddress() {
            var addressDetails = shipmentData.fromAddress;
            return {
                addressDetails: {
                    addrLine1: addressDetails.addressLine1,
                    city: addressDetails.cityName,
                    countryCode: addressDetails.countryCode,
                    countryName: countriesNames.from,
                    stateOrProvince: addressDetails.stateOrProvince,
                    zipOrPostCode: addressDetails.postCode
                },
                company: shipmentData.fromCompany,
                name: shipmentData.fromName
            };
        }

        function getQuotesRequestData(date) {
            var data = {
                //readyTime: date, // @todo: find out from where this date is coming
                pickupDate: date ? date.getTime() : 0,
                accountNumber: '',
                pieces: shipmentData.pieces,
                shipperAddress: getFormattedShipperAddress(shipmentData),
                payerAddress: getFormattedShipperAddress(shipmentData),
                receiverAddress: getFormattedReceiverAddress(shipmentData),

                /**
                 * Comes from Shipment Type -> Packages -> Use My Own Customs Invoice ->
                 *  -> What is the value of your shipment?
                 *
                 * Should has special money amount format {"val": 10, "currency": "USD"}
                 *
                 * @required
                 */
                declaredValue: {
                    val: 20,
                    currency: 'USD'
                },

                /**
                 * Comes from Shipment Type -> Packages -> Use My Own Customs Invoice ->
                 *  -> Protect Your Shipment -> I would like to insure my shipment ->
                 *  -> What is the value you would like to insure?
                 *
                 * Should has special money amount format {"val": 10, "currency": "USD"}
                 *
                 * @required
                 */
                insuranceValue: { //
                    val: 10,
                    currency: 'USD'
                },

                genericCriteria: {}, // optional
                products: [] // optional
            };
            if (shipmentData.paymentInfo.quotationType === paymentTypeService.PAYMENT_TYPES.DHL_ACCOUNT) {
                data.accountId = shipmentData.paymentInfo.quotationAccountNumber;
            } else {
                data.accountNumber = shipmentData.paymentInfo.quotationAccountNumber;
            }
            return data;
        }

        function isPackage() {
            return shipmentType === SHIPMENT_TYPES.PACKAGE;
        }

        function isShipmentWithInvoice() {
            return !!shipmentData.customsInvoice;
        }

        function chargeShipment() {
            return $http.post('/api/shipment/payment/register', shipmentData).then(function (response) {
                return response.data.callbackUrl || $q.reject();
            });
        }

        function saveShipmentForLater(shipmentName) {
            var incompleteShipmentData = angular.copy(shipmentData);
            incompleteShipmentData.name = shipmentName;
            return $http.post('/api/shipment/partial', incompleteShipmentData)['catch'](function (response) {
                logService.error(response);
                return $q.reject(response.data);
            });
        }

        function completeShipmentPayment(shipmentId, hostedCheckoutId) {
            var url = '/api/shipment/payment/complete';
            return $http.post(url, { shipmentId: shipmentId, hostedCheckoutId: hostedCheckoutId }).then(function (response) {
                return response.data;
            });
        }

        function setPaymentProductInfo(paymentProduct) {
            Object.assign(shipmentData.paymentInfo, { paymentProduct: paymentProduct });
        }

        function getSavedShipmentData(shipmentId) {
            return $http.get('/api/shipment/' + shipmentId).then(function (response) {
                return response.data;
            })['catch'](function (error) {
                logService.error(error);
                return $q.reject(error);
            });
        }

        function getAddressDetails(data) {
            return {
                countryCode: data.countryCode,
                city: data.cityName,
                stateOrProvince: data.stateOrProvince,
                zipOrPostCode: data.postCode,
                addrLine1: data.addressLine1,
                addrLine2: data.addressLine2,
                addrLine3: data.addressLine3
            };
        }

        function getFromContactFields(data) {
            return {
                name: data.fromName,
                email: data.fromEmail,
                company: data.fromCompany,
                vatTax: data.fromVatTax,
                addressDetails: Object.assign(publicAPI.getAddressDetails(data.fromAddress), {
                    key: data.fromContactKey
                }),
                phoneDetails: data.fromPhone
            };
        }

        function getToContactFields(data) {
            return {
                name: data.toName,
                email: data.toEmail,
                company: data.toCompany,
                vatTax: data.toVatTax,
                addressDetails: Object.assign(publicAPI.getAddressDetails(data.toAddress), {
                    key: data.toContactKey
                }),
                phoneDetails: data.toPhone
            };
        }

        function getReceiverContactDetails() {
            return {
                name: shipmentData.toName,
                email: shipmentData.toEmail,
                company: shipmentData.toCompany,
                vatTax: shipmentData.toVatTax,
                addressDetails: Object.assign(publicAPI.getAddressDetails(shipmentData.toAddress), {
                    key: shipmentData.toContactKey,
                    countryName: countriesNames.to,
                    residentialAddress: shipmentData.toResidentialAddress
                }),
                phone: {
                    phoneDetails: shipmentData.toPhone
                },
                nickName: shipmentData.toNickname
            };
        }

        function getInvolvedPartiesAddressDetails() {
            return {
                shipper: {
                    name: shipmentData.fromName,
                    company: shipmentData.fromCompany,
                    address: shipmentData.fromAddress.cityName + ' ' + shipmentData.fromAddress.addressLine1,
                    country: countriesNames.from,
                    email: shipmentData.fromEmail,
                    vat: shipmentData.fromVatTax
                },
                receiver: {
                    name: shipmentData.toName,
                    company: shipmentData.toCompany,
                    address: shipmentData.toAddress.cityName + ' ' + shipmentData.toAddress.addressLine1,
                    country: countriesNames.to,
                    email: shipmentData.toEmail,
                    vat: shipmentData.toVatTax
                }
            };
        }

        function getShipmentTypeData(data) {
            var _data$references = _toArray(data.references);

            var primaryReference = _data$references[0];

            var additionalReferences = _data$references.slice(1);

            return {
                shipmentType: data.type,
                documentDescription: data.documentDescription,
                extendedLiability: data.extendedLiability,
                primaryReference: primaryReference,
                additionalReferences: additionalReferences
            };
        }

        function getPickupModelData(data) {
            var pickupDetails = data.pickup.pickupDetails;

            return {
                pickupLocation: {
                    name: pickupDetails.pickupLocationType
                },
                pickupLocationOtherDescription: pickupDetails.pickupLocationOtherDescription,
                pickupSpecialInstructions: pickupDetails.instructions,
                pickupTime: {
                    readyTime: dateTimeService.msToMin(pickupDetails.pickupWindow.earliestTime),
                    closeTime: dateTimeService.msToMin(pickupDetails.pickupWindow.latestTime)
                },
                totalPickupWeight: data.pickup.totalWeight
            };
        }

        function getPaymentTypeModelData(_ref) {
            var paymentInfo = _ref.paymentInfo;

            return {
                transportationPaymentType: {
                    paymentType: paymentInfo.transportationPaymentType,
                    accountId: paymentInfo.transportationPaymentAccountNumber
                },
                quotationType: {
                    paymentType: paymentInfo.quotationType,
                    accountId: paymentInfo.quotationAccountNumber
                },
                splitDutyAndTaxPayment: paymentInfo.splitDutyAndTaxPayment,
                dutiesPaymentType: {
                    paymentType: paymentInfo.dutiesPaymentType,
                    accountId: paymentInfo.dutiesPaymentAccountNumber
                },
                taxesPaymentType: {
                    paymentType: paymentInfo.taxesPaymentType,
                    accountId: paymentInfo.taxesPaymentAccountNumber
                }
            };
        }

        function setCreditCardPaymentInfo(billingInfo) {
            var name = billingInfo.name;
            var company = billingInfo.company;
            var email = billingInfo.email;
            var addressDifferent = billingInfo.addressDifferent;
            var paymentProduct = billingInfo.paymentProduct;

            var address = billingInfo.addressDetails || {};

            shipmentData.creditCardPaymentInfo = {
                name: name,
                company: company,
                email: email,
                addressDifferent: addressDifferent,
                paymentProduct: paymentProduct,
                billingAddress: {
                    countryCode: address.countryCode,
                    cityName: address.city,
                    stateOrProvince: address.stateOrProvince,
                    postCode: address.zipOrPostCode,
                    addressLine1: address.addrLine1,
                    addressLine2: address.addrLine2
                }
            };

            if (billingInfo.phone) {
                var _ref2 = billingInfo.phone.phoneDetails || { phoneCountryCode: '', phoneNumber: '' };

                var phoneCountryCode = _ref2.phoneCountryCode;
                var phoneNumber = _ref2.phoneNumber;

                Object.assign(shipmentData.creditCardPaymentInfo, { phoneCountryCode: phoneCountryCode, phoneNumber: phoneNumber });
            }
        }

        function getPackageDetailsModelData(data) {
            var rowId = 0;
            var packagesRows = data.pieces.map(function (item) {
                return {
                    rowId: ++rowId,
                    height: item.height,
                    width: item.width,
                    length: item.length,
                    weight: item.weight,
                    unit: item.unit,
                    quantity: item.quantity,
                    packageId: item.packageId,
                    reference: item.refNum
                };
            });
            return {
                shipmentCountry: data.fromAddress.countryCode,
                shipmentType: data.type,
                packagesRows: packagesRows
            };
        }

        function getShipmentProductsModelData(data) {
            return {
                activeDate: new Date(data.date)
            };
        }

        function getCreditCardPaymentInfo() {
            return shipmentData.creditCardPaymentInfo;
        }

        return publicAPI;
    }
});
//# sourceMappingURL=ewf-shipment-service.js.map
