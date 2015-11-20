define(['exports', 'module', 'ewf', './../ewf-container/ewf-container-directive', './../../directives/ewf-modal/ewf-modal-directive', './ewf-grid-controller'], function (exports, module, _ewf, _ewfContainerEwfContainerDirective, _directivesEwfModalEwfModalDirective, _ewfGridController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ewfGrid;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfGridController = _interopRequireDefault(_ewfGridController);

    _ewf2['default'].directive('ewfGrid', ewfGrid);

    function ewfGrid() {
        return {
            restrict: 'AE',
            controller: _EwfGridController['default'],
            controllerAs: 'ewfGridCtrl',
            template: '<div class=\"tableController data-table__container\"><div ng-if=ewfGridCtrl.showCustomizationButton class=data-table__settings-btn><a ng-click=ewfGridCtrl.showColumnCustomizationDialog()><i class=dhlicon-gear></i></a></div><table class=data-table><thead><tr class=data-table__header><th class=\"data-table__header-cell checkbox-cell\"><label class=\"checkbox checkbox_inline\"><input id=checkbox_shipment_{{$index}} class=checkbox__input type=checkbox data-aqa-id=checkbox_shipment_{{$index}} ng-model=ewfGridCtrl.selectAll ng-change=ewfGridCtrl.setPageSelection(ewfGridCtrl.selectAll)> <span class=label></span></label></th><th ng-repeat=\"column in ewfGridCtrl.attributes.visibleColumns track by $id(column)\" class=data-table__header-cell><a class=data-table__sort ng-class=ewfGridCtrl.getSortOrderCssClasses(column.alias) ng-click=ewfGridCtrl.toggleSortOrder(column.alias)><span nls={{column.title}} nls-bind></span> <i class=data-table__sort-arrow ng-class=\"{\'dhlicon-arrow-up\': !ewfGridCtrl.attributes.disableSorting}\"></i> <i class=data-table__sort-arrow ng-class=\"{\'dhlicon-arrow-down\': !ewfGridCtrl.attributes.disableSorting}\"></i></a></th></tr></thead><tbody><tr class=data-table__item ng-repeat=\"row in ewfGridCtrl.pagination.data track by $index\" ng-class=\"{\'selected\': row.isSelected }\"><td class=\"data-table__cell checkbox-cell\"><label class=checkbox><input type=checkbox class=checkbox__input id=checkbox_shipment_{{$index}} data-aqa-id=checkbox_shipment_{{$index}} ng-model=row.isSelected> <span class=label></span></label></td><td class=data-table__cell><a ng-show=\"!ewfGridCtrl.isPopup && !ewfGridCtrl.simpleFirstColumn\" ng-href=\"./new-contact.html?key={{row.key}}\">{{ row[ewfGridCtrl.attributes.visibleColumns[0].alias] }}</a> <span ng-show=ewfGridCtrl.simpleFirstColumn>{{ row[ewfGridCtrl.attributes.visibleColumns[0].alias] }}</span> <a ng-show=ewfGridCtrl.isPopup ng-click=\"ewfGridCtrl.triggerEvent(\'onSelection\', { $selection: row, $index: ewfGridCtrl.pagination.rowMin + $index - 1 })\">{{ row[ewfGridCtrl.attributes.visibleColumns[0].alias] }}</a><ul class=individual-options><li class=individual-options__item><a class=\"btn btn_small\" ng-href=\"./new-contact.html?key={{row.key}}\" data-id={{row.key}}><i class=dhlicon-pencil></i><span nls=address-book.edit_btn></span></a></li><li class=individual-options__item><a class=\"btn btn_small\" ng-href=\"./new-contact.html?key={{row.key}}&mode=copy\" data-id={{row.key}} ng-click><i class=dhlicon-copy></i><span nls=address-book.copy_btn></span></a></li><li class=individual-options__item><a class=\"btn btn_small\" data-id={{row.key}} ng-click=ewfGridCtrl.deleteElements(row.key)><i class=dhlicon-remove></i><span>{{ \'address-book.delete_btn\' | translate }}</span></a></li><li class=individual-options__item><a class=\"btn btn_action\" ng-click data-id=0048><span nls=address-book.pickup_btn></span></a></li><li class=individual-options__item><a class=\"btn btn_action\" ng-click data-id=0048><span nls=address-book.get_quote_btn></span></a></li><li class=individual-options__item><a class=\"btn btn_action\" ng-click data-id=0048><span nls=address-book.create_shipment_btn></span></a></li></ul></td><td class=data-table__cell ng-if=ewfGridCtrl.useTrustedHtml ng-repeat=\"column in ewfGridCtrl.attributes.visibleColumns.slice(1) track by $id(column)\"><span ng-bind-html=row[column.alias]></span></td><td class=data-table__cell ng-if=!ewfGridCtrl.useTrustedHtml ng-repeat=\"column in ewfGridCtrl.attributes.visibleColumns.slice(1) track by $id(column)\"><span ng-bind=row[column.alias]></span></td><td class=\"data-table__cell edit-delete-case\"><div><a ng-click=ewfGridCtrl.editCallback(row.key) class=\"btn btn_action btn_small\"><i class=dhlicon-pencil></i>Edit</a></div><div><small><a ng-click=ewfGridCtrl.deleteElements(row.key)>Delete</a></small></div></td></tr></tbody></table></div>',
            require: ['ewfGrid', '?^ewfContainer'],
            link: {
                pre: preLink,
                post: postLink
            }
        };

        function preLink(scope, element, attrs, ctrls) {
            var _ctrls = _slicedToArray(ctrls, 2);

            var ewfGridController = _ctrls[0];
            var ewfContainerController = _ctrls[1];

            if (ewfContainerController) {
                ewfContainerController.registerControllerInstance('grid', ewfGridController);
            } else {
                var error = new Error('Grid could not exists separately from parent directive');
                throw error;
            }
        }

        function postLink(scope, element, attrs, ctrls) {
            var ewfGridController = ctrls[0];
            ewfGridController.gridInit();
        }
    }
});
//# sourceMappingURL=ewf-grid-directive.js.map
