define(['exports', 'module', 'ewf', './address-entry-controller'], function (exports, module, _ewf, _addressEntryController) {
    'use strict';

    module.exports = AddressEntry;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _AddressEntryController = _interopRequireDefault(_addressEntryController);

    _ewf2['default'].directive('addressEntry', AddressEntry);

    function AddressEntry() {
        return {
            restrict: 'AE',
            controller: _AddressEntryController['default'],
            controllerAs: 'addressEntryCtrl',
            link: {
                post: postLink
            }
        };

        function postLink(scope, elem, attrs, controller) {
            controller.init();
            controller.preloadSectionFromUrl();
        }
    }
});
//# sourceMappingURL=address-entry-directive.js.map
