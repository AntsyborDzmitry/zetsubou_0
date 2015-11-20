define(['exports', 'ewf', './ewf-password-controller', './../ewf-input-password/ewf-input-password-directive', './ewf-validate-password-equality-directive'], function (exports, _ewf, _ewfPasswordController, _ewfInputPasswordEwfInputPasswordDirective, _ewfValidatePasswordEqualityDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfPasswordController = _interopRequireDefault(_ewfPasswordController);

    _ewf2['default'].directive('ewfPassword', function () {
        return {

            /**
             * Using "AE" here because of IE8. ewf-password directive is used
             * in another directive in a ng-if conditional block - in this case
             * we need to use directive as an attribute.
             */
            restrict: 'AE',
            require: ['ewfPassword', 'ngModel', '^form'],
            controller: _EwfPasswordController['default'],
            controllerAs: 'ewfPasswordCtrl',
            template: '<div ewf-field=password class=\"field-wrapper ewf-passwd-ver-info\"><label class=label for=pswd nls=registration.password_input_title></label> <input id=pswd name=pswd class=\"input input_width_full\" type=password autocomplete=off ng-model=ewfPasswordCtrl.password ewf-input-password={{ewfPasswordCtrl.formName}}.password ewf-input={{ewfPasswordCtrl.formName}}.password ng-blur=\"ewfPasswordCtrl.parentForm.pswd.$dirty = true\" ewf-validate-required exclude-from-local-storage> <span class=validation-mark></span> <span class=msg-error ng-if=ewfPasswordCtrl.showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl) nls=errors.required_field_error_password_is_empty></span><div class=ewf-require-ver-info ng-if=ewfInputPasswordCtrl.validationIsVisible><p nls=common.your_password_must></p><ul><li class=ewf-not-complete-ver-info ng-repeat=\"errorMessage in ewfInputPasswordCtrl.validationErrorMessage.password.password\" ewf-show-validation-info><i ng-bind=errorMessage.translation></i></li></ul></div></div><div ewf-field=pswd_repeat class=field-wrapper><label class=label for=pswd_repeat nls=registration.re_enter_password_field_label></label> <input id=pswd_repeat name=pswd_repeat class=\"input input_width_full\" autocomplete=off type=password ng-disabled=\"ewfPasswordCtrl.parentForm.pswd.$invalid || !ewfPasswordCtrl.parentForm.pswd.$dirty\" ng-model=ewfPasswordCtrl.repeatPassword ewf-validate-password-equality=\"{passwordField: \'ewfPasswordCtrl.password\', operation: \'matches\', errorMessage: \'errors.provided_passwords_do_not_match\'}\" ewf-validate-required ng-model-options=\"{ updateOn: \'blur\'}\" ng-trim=false ewf-input={{ewfPasswordCtrl.formName}}.pswd_repeat exclude-from-local-storage> <span class=validation-mark></span> <span class=msg-error ng-if=\"ewfPasswordCtrl.password !== ewfPasswordCtrl.repeatPassword\" nls=errors.provided_passwords_do_not_match></span><div ewf-field-errors></div></div>',
            link: {
                pre: preLink,
                post: postLink
            }
        };

        function preLink(scope, elm, attrs, ctrl) {
            var ewfPasswordCtrl = ctrl[0];
            ewfPasswordCtrl.formName = attrs.ewfFormName;
        }

        function postLink(scope, elm, attrs, ctrl) {
            var _ctrl = _slicedToArray(ctrl, 3);

            var ewfPasswordCtrl = _ctrl[0];
            var modelCtrl = _ctrl[1];
            var formCtrl = _ctrl[2];

            ewfPasswordCtrl.parentForm = formCtrl;

            scope.$watch(function () {
                return ewfPasswordCtrl.password;
            }, function (newValue) {
                modelCtrl.$setViewValue(newValue);
            });
        }
    });
});
//# sourceMappingURL=ewf-password-directive.js.map
