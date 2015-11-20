define(['exports', 'module', 'ewf', './package-details-controller', '../../../directives/ewf-validate/ewf-validate-max-directive', './field-name-dynamic-directive', '../../../filters/calculate-total-filter', '../../../filters/convert-uom-filter'], function (exports, module, _ewf, _packageDetailsController, _directivesEwfValidateEwfValidateMaxDirective, _fieldNameDynamicDirective, _filtersCalculateTotalFilter, _filtersConvertUomFilter) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ewfPackageDetails;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PackageDetailsController = _interopRequireDefault(_packageDetailsController);

    _ewf2['default'].directive('ewfPackageDetails', ewfPackageDetails);

    function ewfPackageDetails() {
        return {
            restrict: 'E',
            controller: _PackageDetailsController['default'],
            controllerAs: 'packageDetailsCtrl',
            require: ['^ewfShipment', 'ewfPackageDetails'],
            link: {
                post: function post($scope, elem, attrs, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    var shipmentCtrl = _controllers[0];
                    var packageDetailsCtrl = _controllers[1];

                    shipmentCtrl.addStep(packageDetailsCtrl);
                }
            }
        };
    }
});
//# sourceMappingURL=package-details-directive.js.map
