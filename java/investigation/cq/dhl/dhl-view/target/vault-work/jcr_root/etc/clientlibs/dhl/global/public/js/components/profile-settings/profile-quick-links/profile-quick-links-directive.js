define(['exports', 'ewf', './profile-quick-links-controller', './../../../directives/ewf-grid/ewf-grid-directive', './../../../directives/ewf-grid/ewf-grid-pagination-directive'], function (exports, _ewf, _profileQuickLinksController, _directivesEwfGridEwfGridDirective, _directivesEwfGridEwfGridPaginationDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProfileQuickLinksController = _interopRequireDefault(_profileQuickLinksController);

    _ewf2['default'].directive('ewfProfileQuickLinks', ewfProfileQuickLinks);

    function ewfProfileQuickLinks() {
        return {
            restrict: 'AE',
            controller: _ProfileQuickLinksController['default'],
            controllerAs: 'profileQuickLinksCtrl',
            require: ['ewfProfileQuickLinks', 'ewfContainer'],
            link: {
                post: function post(scope, element, attributes, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    var ewfProfileQuickLinksCtrl = _controllers[0];
                    var ewfContainerCtrl = _controllers[1];

                    var gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
                    gridCtrl.ctrlToNotify = ewfProfileQuickLinksCtrl;

                    ewfProfileQuickLinksCtrl.gridCtrl = gridCtrl;
                    ewfProfileQuickLinksCtrl.init();
                }
            }
        };
    }
});
//# sourceMappingURL=profile-quick-links-directive.js.map
