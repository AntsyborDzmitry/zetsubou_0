define(['exports', 'ewf', './../../directives/ewf-form/ewf-form-directive', './../../directives/ewf-grid/ewf-grid-directive', './../../directives/ewf-container/ewf-container-directive', './address-book-controller'], function (exports, _ewf, _directivesEwfFormEwfFormDirective, _directivesEwfGridEwfGridDirective, _directivesEwfContainerEwfContainerDirective, _addressBookController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _AddressBookController = _interopRequireDefault(_addressBookController);

    _ewf2['default'].directive('ewfAddressBook', ewfAddressBook);

    function ewfAddressBook() {
        return {
            restrict: 'E',
            controller: _AddressBookController['default'],
            controllerAs: 'addressBookCtrl',
            require: ['ewfAddressBook', 'ewfContainer'],
            link: {
                post: postLink
            }
        };

        function postLink(scope, element, attrs, ctrls) {
            var _ctrls = _slicedToArray(ctrls, 2);

            var addressBookCtrl = _ctrls[0];
            var ewfContainerCtrl = _ctrls[1];

            var gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
            gridCtrl.ctrlToNotify = addressBookCtrl;

            addressBookCtrl.gridCtrl = gridCtrl;
        }
    }
});
//# sourceMappingURL=address-book-directive.js.map
