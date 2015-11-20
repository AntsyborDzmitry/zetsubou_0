define(['exports', 'module', 'ewf', './result-controller'], function (exports, module, _ewf, _resultController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = RegistrationResult;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _RegistrationSuccessController = _interopRequireDefault(_resultController);

    _ewf2['default'].directive('registrationResult', RegistrationResult);

    function RegistrationResult() {
        return {
            restrict: 'E',
            controller: _RegistrationSuccessController['default'],
            controllerAs: 'regSuccess',
            require: ['^ewfRegistration', 'registrationResult'],
            template: '<div class=main ng-if=regSuccess.isAccountHolder><div class=container><form id=verification method=POST action=#><article class=\"layout full-width\"><h2 nls=registration.registration_check_status></h2><section class=area><div class=\"overlay-grey a-center\" id=login><div class=half-width><i class=\"dhlicon-email-secure icon-large icon-round bg-blue\"></i><h3 nls=registration.registration_account_holder_success_title></h3><p><span nls=registration.registration_account_holder_success_message_part1></span> <b>1</b> <span nls=registration.registration_account_holder_success_message_part2></span></p><a href=auth/login.html class=\"btn btn_action gray\" nls=registration.registration_check_btn_text></a></div></div></section></article></form></div></div><div class=main ng-if=!regSuccess.isAccountHolder><div class=container><form id=verification method=POST action=#><article class=\"layout full-width\"><h2 nls=registration.registration_success_status></h2><section class=area><div class=\"overlay-grey a-center\" id=login><div class=half-width><i class=\"dhlicon-email-secure icon-large icon-round bg-blue\"></i><h3 nls=registration.registration_success_title></h3><p nls=registration.registration_success_message></p><a href=auth/login.html class=\"btn btn_action gray\" nls=registration.registration_success_btn_text></a></div></div></section></article></form></div></div>',
            link: {
                pre: preLink
            }
        };
    }

    function preLink(scope, element, attrs, controllers) {
        var _controllers = _slicedToArray(controllers, 2);

        var registrationController = _controllers[0];
        var resultController = _controllers[1];

        resultController.setRegistrationController(registrationController);
    }
});
//# sourceMappingURL=result-directive.js.map
