EwfPhoneController.$inject = ['$scope', '$attrs', 'attrsService'];

export default function EwfPhoneController($scope, $attrs, attrsService) {
    const PHONE_TYPES_MAP = {
        OFFICE: 'OFFICE',
        MOBILE: 'MOBILE',
        OTHER: 'OTHER'
    };

    //TODO make a single instance of patterns in one place
    const patterns = {
        emailRegExp: '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$',
        numeric: '^(\\s*|\\d+)$',
        formatted: '^([\\s\\d\\-\\(\\)]+)$',
        alphaNumeric: '^[a-z\\d\\-_\\s]+$',
        numericSpecialChars: '^[0-9\\+]*$'
    };

    const vm = this;

    Object.assign(vm, {
        patterns,
        phoneTypesMap: PHONE_TYPES_MAP,
        attributes: {},

        isOfficePhone,
        isMobilePhone
    });

    // call `untrack()` on this function's return value when no tracking is further required
    attrsService.track($scope, $attrs, 'phone', vm.attributes, onPhoneAttrsChange);

    // This will replace whole addressDetailsCtrl.fromContactFields and make shipment not usable
    //vm.attributes.phone = {
    //    phoneDetails: {
    //        phoneType: vm.phoneTypesMap.OTHER
    //    }
    //};

    function phoneTypeIs(phoneType) {
        return vm.attributes.phone.phoneDetails.phoneType === phoneType;
    }

    function isOfficePhone() {
        return phoneTypeIs(PHONE_TYPES_MAP.OFFICE);
    }

    function isMobilePhone() {
        return phoneTypeIs(PHONE_TYPES_MAP.MOBILE);
    }

    function onPhoneAttrsChange(phone) {
        phone.phoneDetails = phone.phoneDetails || {};
        phone.phoneDetails.phoneType = phone.phoneDetails.phoneType || PHONE_TYPES_MAP.OTHER;
    }
}
