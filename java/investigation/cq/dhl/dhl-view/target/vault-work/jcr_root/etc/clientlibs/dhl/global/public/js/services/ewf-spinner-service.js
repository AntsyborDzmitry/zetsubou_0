define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfSpinnerService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('ewfSpinnerService', EwfSpinnerService);

    EwfSpinnerService.$inject = ['$q', '$timeout'];

    function EwfSpinnerService($q, $timeout) {

        var showSpinner = true;

        var publicAPI = {
            applySpinner: applySpinner,
            isSpinnerActive: isSpinnerActive
        };

        var delayTime = 300;

        function applySpinner(externalPromise) {
            showSpinner = true;

            var promise = externalPromise || $q.when('spinner timeout');

            return promise['finally'](function () {
                $timeout(function () {
                    showSpinner = false;
                }, delayTime);
            });
        }

        function isSpinnerActive() {
            return showSpinner;
        }

        return publicAPI;
    }
});
//# sourceMappingURL=ewf-spinner-service.js.map
