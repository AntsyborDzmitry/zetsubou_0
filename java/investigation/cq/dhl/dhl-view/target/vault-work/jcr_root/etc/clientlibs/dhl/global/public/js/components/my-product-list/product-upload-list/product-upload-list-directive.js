define(['exports', 'module', 'ewf', './product-upload-list-controller'], function (exports, module, _ewf, _productUploadListController) {
    'use strict';

    module.exports = ProductUploadList;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProductUploadListController = _interopRequireDefault(_productUploadListController);

    _ewf2['default'].directive('productUploadList', ProductUploadList);

    function ProductUploadList() {
        return {
            restrict: 'E',
            controller: _ProductUploadListController['default'],
            controllerAs: 'productUploadListCtrl'
        };
    }
});
//# sourceMappingURL=product-upload-list-directive.js.map
