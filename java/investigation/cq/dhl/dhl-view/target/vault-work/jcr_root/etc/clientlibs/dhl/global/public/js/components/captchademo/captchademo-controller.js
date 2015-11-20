define(['exports', 'module'], function (exports, module) {
    'use strict';

    module.exports = CaptchademoController;
    CaptchademoController.$inject = ['$http', '$scope', 'logService'];

    var SUBMIT_ENDPOINT = '/api/visualcaptcha/attempt';

    function CaptchademoController($http, $scope, logService) {
        var vm = this;
        vm.sendCaptchaSelection = sendCaptchaSelection;

        $scope.captchaOptions = {
            imgPath: '/etc/clientlibs/dhl/global/public/img/',
            captcha: {
                numberOfImages: 5,
                url: '/api/visualcaptcha'
            },
            // use init callback to get captcha object
            init: function init(captcha) {
                $scope.captcha = captcha;
            }
        };

        function sendCaptchaSelection() {
            logService.log('Getting captcha data to include in form submission');

            var captchaData = $scope.captcha.getCaptchaData();
            var request = {
                name: 'ExampleName',
                captchaData: captchaData
            };

            logService.log('Sending form submission...');
            var promise = $http.post(SUBMIT_ENDPOINT, request);

            promise.then(function (data) {
                logService.log('Promise resolved, got ' + data.data);
                $scope.captchaResult = data.data === 'true' ? 'valid' : 'invalid';
            })['catch'](function () {
                logService.log('Promise error');
            });
        }
    }
});
//# sourceMappingURL=captchademo-controller.js.map
