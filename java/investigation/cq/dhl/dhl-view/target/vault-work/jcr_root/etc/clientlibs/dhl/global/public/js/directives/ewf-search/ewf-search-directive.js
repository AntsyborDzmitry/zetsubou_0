define(['exports', 'ewf', './ewf-search-controller'], function (exports, _ewf, _ewfSearchController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfSearchController = _interopRequireDefault(_ewfSearchController);

    _ewf2['default'].directive('ewfSearch', ewfSearch);

    function ewfSearch() {
        return {
            restrict: 'AE',
            controller: _EwfSearchController['default'],
            controllerAs: 'ewfSearchCtrl'
        };
    }
});
//# sourceMappingURL=ewf-search-directive.js.map
