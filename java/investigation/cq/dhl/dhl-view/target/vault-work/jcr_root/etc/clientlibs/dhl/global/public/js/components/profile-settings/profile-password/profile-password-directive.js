define(['exports', 'ewf', './profile-password-controller', './../../../directives/ewf-password/ewf-password-directive', './../../../directives/ewf-form/ewf-form-directive', './../../../directives/ewf-input/ewf-input-directive'], function (exports, _ewf, _profilePasswordController, _directivesEwfPasswordEwfPasswordDirective, _directivesEwfFormEwfFormDirective, _directivesEwfInputEwfInputDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProfilePasswordController = _interopRequireDefault(_profilePasswordController);

    _ewf2['default'].directive('profilePassword', ProfilePassword);

    function ProfilePassword() {
        return {
            restrict: 'E',
            controller: _ProfilePasswordController['default'],
            controllerAs: 'profilePasswordCtrl',
            require: ['profilePassword', 'ewfForm'],
            link: postLink
        };
    }

    function postLink(scope, element, attrs, controllers) {
        var _controllers = _slicedToArray(controllers, 2);

        var profilePasswordCtrl = _controllers[0];
        var ewfFormCtrl = _controllers[1];

        profilePasswordCtrl.ewfFormCtrl = ewfFormCtrl;
    }
});
//# sourceMappingURL=profile-password-directive.js.map
