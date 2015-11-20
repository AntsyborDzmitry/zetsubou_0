define(['exports', 'module', '../../../../services/attrs-service'], function (exports, module, _servicesAttrsService) {
    'use strict';

    module.exports = ContactShareInfoController;

    ContactShareInfoController.$inject = ['$scope', '$attrs', 'attrsService'];

    function ContactShareInfoController($scope, $attrs, attrsService) {
        var vm = this;
        attrsService.track($scope, $attrs, 'shareSettings', vm);
    }
});
//# sourceMappingURL=contact-share-info-controller.js.map
