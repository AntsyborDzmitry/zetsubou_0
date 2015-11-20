import './../../../services/nls-service';
import './../shipment-type/item-attributes/item-attributes-model';
import ewf from 'ewf';

ewf.service('enhancedInvoiceModel', EnhancedInvoiceModel);

EnhancedInvoiceModel.$inject = ['$filter', 'nlsService', 'shipmentService', 'itemAttributesModel'];

export default function EnhancedInvoiceModel($filter, nlsService, shipmentService, itemAttributesModel) {
    const NONE_ID = 'NONE';

    const exporterIdTypes = [{
        value: NONE_ID,
        key: 'shipment.shipment_type_enhanced_customs_invoice_involved_parties_none'
    }, {
        value: 'DUNS',
        key: 'shipment.shipment_type_enhanced_customs_invoice_involved_parties_duns_number'
    }, {
        value: 'SSN',
        key: 'shipment.shipment_type_enhanced_customs_invoice_involved_parties_social_security_number'
    }, {
        value: 'EIN',
        key: 'shipment.shipment_type_enhanced_customs_invoice_involved_parties_ein'
    }, {
        value: 'FEC',
        key: 'shipment.shipment_type_enhanced_customs_invoice_involved_parties_fec'
    }];

    const paymentOptions = [{
        value: '',
        nls: 'shipment.shipment_type_enhanced_customs_terms_select_one'
    }, {
        value: 'ALTERNATE',
        nls: 'shipment.shipment_type_enhanced_customs_terms_alternate_account'
    }, {
        value: 'CREDIT_CARD',
        nls: 'shipment.shipment_type_enhanced_customs_terms_credit_card'
    }, {
        value: 'CASH',
        nls: 'shipment.shipment_type_enhanced_customs_terms_cash'
    }];

    const requiresPedimentOptions = [{
        value: 'yes',
        nls: 'shipment.shipment_type_yes'
    }, {
        value: 'no',
        nls: 'shipment.shipment_type_no'
    }];

    const invoiceTypes = {
        COMMERCIAL: 'COMMERCIAL',
        PROFORMA: 'PROFORMA'
    };

    let initialized = false;

    Object.assign(this, {
        invoiceType: null,
        invoiceUserName: '',
        paymentAccount: '',
        exportIdType: '',
        invoiceTypes,
        paymentOptions,
        requiresPedimentOptions,
        country: {
            code2: '',
            name: ''
        },
        currentDate: '',
        requiresPediment: null,
        NONE_ID,
        logoParameters: null,

        contactDetails: {
            phone: {}
        },
        addressDifferent: false,

        init,
        setInvoiceData,
        toggleShowCountriesList,
        pickCountry,
        isCodeSelected,
        cacheModel,
        resetModel,

        setContactDetails,
        clearAddress
    });

    const cachedEnhancedInvoiceModel = {};
    const cachedItemAttributesModel = {};

    function init(params) {
        if (initialized) {
            return this;
        }

        this.currentDate = $filter('date')(new Date(), 'MM/dd/yyyy');
        this.setInvoiceData(params);
        this.exporterIdTypes = translateList(exporterIdTypes);
        this.contactDetails = shipmentService.getReceiverContactDetails();

        if (params && params.involvedPartiesData) {
            this.invoiceUserName = params.involvedPartiesData.shipper.name;
        }

        initialized = true;

        return this;
    }

    function setInvoiceData(params) {
        Object.assign(this, params);
    }

    function translateList(list) {
        return list.map((item) => {
            item.title = nlsService.getTranslationSync(item.key);
            return item;
        });
    }

    function toggleShowCountriesList(state) {
        this.isCountriesListVisible = state;
    }

    function pickCountry(country) {
        this.country = {
            code2: country.code2,
            name: country.name
        };

        this.toggleShowCountriesList(false);
    }

    function isCodeSelected() {
        return this.exportIdType !== this.NONE_ID && this.exportIdType !== '';
    }

    function cacheModel() {
        angular.copy(itemAttributesModel, cachedItemAttributesModel);
        if (angular.equals(cachedEnhancedInvoiceModel, {})) {
            angular.copy(this, cachedEnhancedInvoiceModel);
        }
    }

    function resetModel() {
        angular.copy(cachedEnhancedInvoiceModel, this);
        angular.copy(cachedItemAttributesModel, itemAttributesModel);
    }

    function setContactDetails(contact) {
        Object.assign(this.contactDetails, {
            name: contact.contactName,
            company: contact.companyName,
            email: contact.email,
            nickName: contact.nickName,
            vatTax: contact.toVatTax,
            phone: {
                phoneDetails: {
                    phoneCountryCode: contact.phoneCountryCode,
                    phoneExt: contact.phoneExt,
                    phone: contact.phoneNumber,
                    phoneType: contact.phoneType,
                    fax: contact.fax,
                    smsEnabled: contact.smsEnabled
                }
            },
            addressDetails: {
                addrLine1: contact.address,
                addrLine2: contact.address2,
                addrLine3: contact.address3,
                countryName: contact.country,
                countryCode: contact.countryCode,
                zipOrPostCode: contact.zipOrPostCode,
                city: contact.city,
                stateOrProvince: contact.stateOrProvince,
                residentialAddress: contact.residentialAddress,
                key: contact.key
            }
        });
    }

    function clearAddress() {
        this.contactDetails = {
            phone: {
                phoneDetails: {}
            }
        };
    }
}
