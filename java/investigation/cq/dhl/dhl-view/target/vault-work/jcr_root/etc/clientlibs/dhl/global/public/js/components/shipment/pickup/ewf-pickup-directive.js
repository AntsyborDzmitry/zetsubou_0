define(['exports', 'module', 'ewf', './ewf-pickup-controller', 'ionrangeslider'], function (exports, module, _ewf, _ewfPickupController, _ionrangeslider) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfPickup;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfPickupController = _interopRequireDefault(_ewfPickupController);

    var _ionrangeslider2 = _interopRequireDefault(_ionrangeslider);

    // eslint-disable-line

    _ewf2['default'].directive('ewfPickup', EwfPickup);

    function EwfPickup() {
        return {
            restrict: 'E',
            controller: _EwfPickupController['default'],
            controllerAs: 'pickupCtrl',
            require: ['^ewfShipment', 'ewfPickup'],
            link: {
                post: function post($scope, element, attrs, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    var shipmentCtrl = _controllers[0];
                    var pickupCtrl = _controllers[1];

                    shipmentCtrl.addStep(pickupCtrl);

                    pickupCtrl.setPickupWindowDisplayCallback(function (rangeSliderOptions) {
                        element.find('#range-slider').ionRangeSlider(rangeSliderOptions);
                        element.find('.irs-from').attr('data-content', element.find('#earliest-pickup').text());
                        element.find('.irs-to').attr('data-content', element.find('#latest-pickup').text());
                    });
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-pickup-directive.js.map
