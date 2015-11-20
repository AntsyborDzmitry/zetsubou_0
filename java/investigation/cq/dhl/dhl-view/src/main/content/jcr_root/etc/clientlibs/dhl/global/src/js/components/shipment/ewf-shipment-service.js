import ewf from 'ewf';
import './../../services/date-time-service';
import './payment-type/payment-type-service';

ShipmentService.$inject = ['$http', '$q', 'logService', 'dateTimeService', 'paymentTypeService'];
ewf.service('shipmentService', ShipmentService);

export default function ShipmentService($http, $q, logService, dateTimeService, paymentTypeService) {
    // private
    let countriesNames = {
        from: '',
        to: ''
    };
    let shipmentType = '';
    let customsInvoiceType = null;
    let currenciesList = [];

    let totalWeight = {
        value: '',
        unit: ''
    };

    const SHIPMENT_TYPES = {
        DOCUMENT: 'DOCUMENT',
        PACKAGE: 'PACKAGE'
    };

    function Address(data = {}) {
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
            addressLine1: data.addressDetails.addrLine1 ?
                                                    data.addressDetails.addrLine1.fullAddress ||
                                                    data.addressDetails.addrLine1 : undefined,
            addressLine2: data.addressDetails.addrLine2,
            addressLine3: data.addressDetails.addrLine3,
            addressType: '',
            geoPositionLatitude: '',
            geoPositionLongitude: '',
            geoPositionAltitude: '',
            resAttrOpts: ''
        };
    }

    function Phone(data = {}) {
        const {phoneDetails = {}} = data;
        return {
            phoneType: phoneDetails.phoneType,
            phoneCountryCode: phoneDetails.phoneCountryCode,
            phone: phoneDetails.phone ? (phoneDetails.phone).replace(/\s/g, '') : null,
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

    const shipmentData = {
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
        optionalServices: [
            {
                //private Boolean holdShipmentForRecipient;
                //private Boolean neutralDeliveryService;
                //private Boolean dangerousGoods;
            }
        ],
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

    const publicAPI = {
        getCountrySomParameters,
        setCountrySomParameters,
        getCurrencies,
        setCurrencies,
        setAddressDetails,
        setPhoneDetails,
        getCustomsInvoice,
        setCustomsInvoice,
        setCustomsInvoicePurpose,
        getCustomsInvoiceType,
        setCustomsInvoiceType,
        setItar,
        setPackageDetails,
        setShipmentReferences,
        getShipmentCountry,
        getShipmentPostCode,
        setShipmentProduct,
        getShipmentCityName,
        getShipmentProduct,
        setShipmentDate,
        getShipmentDate,
        setContactsKeys,
        getContactsKeys,
        setShipmentType,
        getShipmentType,
        getShipmentData,
        getDestinationCountry,
        setAssociateWithContactId,
        setPaymentInfo,
        getPaymentInfo,
        setIncoterm,
        getIncoterm,
        setTotalWeight,
        getTotalWeight,
        setPickupData,
        getPickupData,
        saveShipment,
        getQuotesRequestData,
        isPackage,
        isShipmentWithInvoice,
        chargeShipment,
        saveShipmentForLater,
        setPaymentProductInfo,
        completeShipmentPayment,
        getSavedShipmentData,
        getAddressDetails,
        getFromContactFields,
        getToContactFields,
        getReceiverContactDetails,
        getInvolvedPartiesAddressDetails,
        getShipmentTypeData,
        getPickupModelData,
        getPaymentTypeModelData,
        getPackageDetailsModelData,
        getShipmentProductsModelData,
        setRewardCard,
        getRewardCard,
        setCreditCardPaymentInfo,
        getCreditCardPaymentInfo,
        getFormattedShipperAddress,
        getShipperAddress
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

    function setCountrySomParameters(shipperCountrySom, userProfileCountrySom,
                                     weightConvertionRate = 1, dimensionConvertionRate = 1,
                                     shipperCountryConversionPrecision = 2, userProfileCountryConversionPrecision = 2) {
        Object.assign(shipmentData, {
            shipperCountrySom,
            userProfileCountrySom,
            weightConvertionRate,
            dimensionConvertionRate,
            shipperCountryConversionPrecision,
            userProfileCountryConversionPrecision
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
        shipmentData.pieces = packagesRows.map((row) => new Piece(row));
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
        const {fromContactKey, toContactKey} = shipmentData;
        return {
            fromContactKey,
            toContactKey
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
        return $http.post('/api/shipment', shipmentData)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('ShipmentService#saveShipment: response error', response);
                return $q.reject(response);
            });
    }

    function getAddress(currentShipmentData, fromOrTo) {
        let address = currentShipmentData[fromOrTo + 'Address'];
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

    function getFormattedShipperAddress(currentShipmentData = shipmentData) {
        return getAddress(currentShipmentData, 'from');
    }

    function getFormattedReceiverAddress(currentShipmentData) {
        return getAddress(currentShipmentData, 'to');
    }

    function getShipperAddress() {
        const addressDetails = shipmentData.fromAddress;
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
        const data = {
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
        return $http.post(`/api/shipment/payment/register`, shipmentData)
            .then((response) => response.data.callbackUrl || $q.reject());
    }

    function saveShipmentForLater(shipmentName) {
        const incompleteShipmentData = angular.copy(shipmentData);
        incompleteShipmentData.name = shipmentName;
        return $http.post('/api/shipment/partial', incompleteShipmentData)
            .catch((response) => {
                logService.error(response);
                return $q.reject(response.data);
            });
    }

    function completeShipmentPayment(shipmentId, hostedCheckoutId) {
        const url = '/api/shipment/payment/complete';
        return $http
            .post(url, {shipmentId, hostedCheckoutId})
            .then((response) => response.data);
    }

    function setPaymentProductInfo(paymentProduct) {
        Object.assign(shipmentData.paymentInfo, {paymentProduct});
    }

    function getSavedShipmentData(shipmentId) {
        return $http.get(`/api/shipment/${shipmentId}`)
            .then((response) => response.data)
            .catch((error) => {
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
        let [primaryReference, ...additionalReferences] = data.references;
        return {
            shipmentType: data.type,
            documentDescription: data.documentDescription,
            extendedLiability: data.extendedLiability,
            primaryReference,
            additionalReferences
        };
    }

    function getPickupModelData(data) {
        const {pickupDetails} = data.pickup;
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

    function getPaymentTypeModelData({paymentInfo}) {
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
        const {name, company, email, addressDifferent, paymentProduct} = billingInfo;
        const address = billingInfo.addressDetails || {};

        shipmentData.creditCardPaymentInfo = {
            name,
            company,
            email,
            addressDifferent,
            paymentProduct,
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
            const {
                phoneCountryCode,
                phoneNumber
            } = billingInfo.phone.phoneDetails || {phoneCountryCode: '', phoneNumber: ''};

            Object.assign(shipmentData.creditCardPaymentInfo, {phoneCountryCode, phoneNumber});
        }
    }

    function getPackageDetailsModelData(data) {
        let rowId = 0;
        const packagesRows = data.pieces.map((item) => {
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
            packagesRows
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
