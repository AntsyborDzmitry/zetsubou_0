define(['exports', 'module', 'ewf', './printer-settings-controller'], function (exports, module, _ewf, _printerSettingsController) {
    'use strict';

    module.exports = PrinterSettings;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PrinterSettingsController = _interopRequireDefault(_printerSettingsController);

    _ewf2['default'].directive('printerSettings', PrinterSettings);

    function PrinterSettings() {
        return {
            restrict: 'AE',
            controller: _PrinterSettingsController['default'],
            controllerAs: 'printerSettingsCtrl',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            controller.preloadPrinterSettings();
        }
    }
});
//# sourceMappingURL=printer-settings-directive.js.map
