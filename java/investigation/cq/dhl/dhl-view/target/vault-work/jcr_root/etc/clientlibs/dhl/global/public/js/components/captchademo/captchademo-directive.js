define(['exports', 'ewf', './captchademo-controller'], function (exports, _ewf, _captchademoController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _CaptchademoController = _interopRequireDefault(_captchademoController);

    _ewf2['default'].directive('ewfCaptchademo', function () {
        return {
            restrict: 'E',
            controller: _CaptchademoController['default'],
            controllerAs: 'captchademo',
            template: '<form novalidate name=regForm ng-submit=captchademo.sendCaptchaSelection() id=captchademo><div><h3>For security purposes, please verify that you\'re a human being</h3><div captcha options=captchaOptions></div></div><button style=\"float: right\" class=\"btn btn_success\" type=submit>Submit</button><div><h3 ng-show=captchaResult>Your selection was {{captchaResult}}</h3></div></form>'
        };
    });
});
//# sourceMappingURL=captchademo-directive.js.map
