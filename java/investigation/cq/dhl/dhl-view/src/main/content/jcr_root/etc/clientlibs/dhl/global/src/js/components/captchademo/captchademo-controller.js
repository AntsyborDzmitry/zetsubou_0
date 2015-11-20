CaptchademoController.$inject = ['$http', '$scope', 'logService'];

const SUBMIT_ENDPOINT = '/api/visualcaptcha/attempt';

export default function CaptchademoController($http, $scope, logService) {
    const vm = this;
    vm.sendCaptchaSelection = sendCaptchaSelection;

    $scope.captchaOptions = {
        imgPath: '/etc/clientlibs/dhl/global/public/img/',
        captcha: {
            numberOfImages: 5,
            url: '/api/visualcaptcha'
        },
        // use init callback to get captcha object
        init: function(captcha) {
            $scope.captcha = captcha;
        }
    };


    function sendCaptchaSelection() {
        logService.log('Getting captcha data to include in form submission');

        const captchaData = $scope.captcha.getCaptchaData();
        const request = {
            name: 'ExampleName',
            captchaData
        };

        logService.log('Sending form submission...');
        const promise = $http.post(SUBMIT_ENDPOINT, request);

        promise
            .then((data) => {
                logService.log('Promise resolved, got ' + data.data);
                $scope.captchaResult = data.data === 'true' ? 'valid' : 'invalid';
            })
            .catch(() => {
                logService.log('Promise error');
            });

    }
}
