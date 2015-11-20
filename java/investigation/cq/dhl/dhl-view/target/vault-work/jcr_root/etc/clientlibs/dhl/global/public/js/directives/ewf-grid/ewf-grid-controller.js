define(['exports', 'module', './../../services/ewf-crud-service', './../../services/pagination-service', './../../services/modal/modal-service', './../../services/nls-service', 'angular'], function (exports, module, _servicesEwfCrudService, _servicesPaginationService, _servicesModalModalService, _servicesNlsService, _angular) {
    'use strict';

    module.exports = EwfGridController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    EwfGridController.$inject = ['$scope', '$attrs', '$timeout', '$q', 'nlsService', 'ewfCrudService', 'attrsService', 'paginationService', 'modalService', 'logService'];

    function EwfGridController($scope, $attrs, $timeout, $q, nlsService, ewfCrudService, attrsService, paginationService, modalService, logService) {
        var vm = this;

        vm.pages = [10, 25, 50, 100];

        var modalWindow = false;
        var onSortCallback = attrsService.trigger($scope, $attrs, 'onSort');

        vm.onSelectionHandlerSet = $attrs.onSelection !== undefined;
        vm.attributes = {};
        vm.selectedColumns = {};

        vm.showActions = false;

        vm.selectAll = false;

        vm.firstPage = 0;

        vm.pagination = {
            data: [],
            window: [],
            rowMin: 0, rowMax: 0,
            pageSize: 10, pageIndex: 0, pageCount: 0
        };

        vm.actionNotificationTypes = {
            created: false,
            updated: false,
            deleted: false,
            rejected: false
        };
        vm.gridInit = gridInit;
        vm.getSelectedKeysOnCurrentPage = getSelectedKeysOnCurrentPage;
        vm.getSelectedKeysOnAllPages = getSelectedKeysOnAllPages;
        vm.getSortOrderCssClasses = getSortOrderCssClasses;
        vm.sortedMoveToPage = sortedMoveToPage;
        vm.moveToPage = moveToPage;
        vm.setSortOrder = setSortOrder;
        vm.setPageSelection = setPageSelection;
        vm.deleteElements = deleteElements;
        vm.handleSearch = handleSearch;
        vm.triggerEvent = triggerEvent;
        vm.toggleSortOrder = toggleSortOrder;
        vm.addElement = addElement;
        vm.updateElement = updateElement;
        vm.getElement = getElement;
        vm.changeMarkersToFalse = changeMarkersToFalse;
        vm.showActionsToFalse = showActionsToFalse;
        vm.showActionsInvert = showActionsInvert;
        vm.bulkDeleteElements = bulkDeleteElements;
        vm.moveToPageIfExists = moveToPageIfExists;
        vm.rebuildGrid = rebuildGrid;
        vm.broadcastActionReport = broadcastActionReport;
        vm.updateVisibleColumns = updateVisibleColumns;
        vm.showColumnCustomizationDialog = showColumnCustomizationDialog;
        vm.hideColumnCustomizationDialog = hideColumnCustomizationDialog;
        vm.isCurrentPage = isCurrentPage;
        vm.updatePagination = updatePagination;
        vm.deleteParamName = $attrs.deleteParam;

        attrsService.track($scope, $attrs, 'gridData', vm.attributes);
        attrsService.track($scope, $attrs, 'pagination', vm.attributes);
        attrsService.track($scope, $attrs, 'visibleColumns', vm.attributes);
        attrsService.track($scope, $attrs, 'availableColumns', vm.attributes);
        attrsService.track($scope, $attrs, 'isPopup', vm.attributes);
        attrsService.track($scope, $attrs, 'listUrl', vm);
        attrsService.track($scope, $attrs, 'showCustomizationButton', vm);
        attrsService.track($scope, $attrs, 'disableSorting', vm.attributes);
        attrsService.track($scope, $attrs, 'sortColumn', vm.attributes);
        attrsService.track($scope, $attrs, 'paginationSize', vm.attributes, function () {
            if (vm.attributes.paginationSize) {
                vm.pagination.pageSize = vm.attributes.paginationSize;
            }
        });

        vm.sort = {
            column: vm.attributes.sortColumn,
            direction: 'ascending'
        };

        vm.simpleFirstColumn = $attrs.simpleFirstColumn;
        vm.isPopup = vm.attributes.isPopup;
        vm.updateUrl = $attrs.updateUrl;
        vm.addUrl = $attrs.addUrl;
        vm.deleteUrl = $attrs.deleteUrl;
        vm.getElementUrl = $attrs.getUrl;
        vm.useTrustedHtml = $attrs.useTrustedHtml;

        vm.ctrlToNotify = undefined;

        function gridInit() {
            rebuildGrid();
        }

        function rebuildGrid(data) {
            if (data) {
                vm.attributes.gridData = data;
            }

            if (_angular2['default'].isUndefined(vm.attributes.gridData) && _angular2['default'].isUndefined(vm.listUrl)) {
                return logService.error('Wrong configuration of ewf-grid, either gridData or listUrl should be defined');
            }

            var needServerData = (!vm.attributes.gridData || !vm.attributes.gridData.length) && vm.listUrl;
            if (needServerData) {
                ewfCrudService.getElementList(vm.listUrl).then(function (response) {
                    return sortedMoveToPage(response, 0);
                })['catch'](function (error) {
                    return broadcastActionReport('rejected', error);
                });
            } else {
                vm.sortedMoveToPage(vm.attributes.gridData, 0);
            }
        }

        function sortedMoveToPage(data, page) {
            vm.attributes.gridData = data;

            sortOutData(vm.sort.column);
            moveToPage(page || vm.pagination.pageIndex);
        }

        function sortOutData(column) {
            if (!vm.attributes.gridData || !column) {
                return;
            }

            var order = vm.sort.direction === 'ascending' ? 1 : -1;
            vm.attributes.gridData.sort(function (rowA, rowB) {
                if (_angular2['default'].isFunction(onSortCallback)) {
                    var sortResult = onSortCallback(column, rowA, rowB);
                    if (_angular2['default'].isDefined(sortResult)) {
                        return sortResult ? -order : order;
                    }
                }

                return sortByColumns(rowA, rowB, column, order);
            });
        }

        function sortByColumns(rowA, rowB, column, order) {
            var rowAColumnValue = rowA[column] || '';
            var rowBColumnValue = rowB[column] || '';
            var rowAColumnNumericValue = parseInt(rowAColumnValue, 10);
            var rowBColumnNumericValue = parseInt(rowBColumnValue, 10);
            if (isFinite(rowAColumnNumericValue) && isFinite(rowBColumnNumericValue)) {
                return rowAColumnNumericValue < rowBColumnNumericValue ? -order : order;
            }
            return rowAColumnValue.toLowerCase() < rowBColumnValue.toLowerCase() ? -order : order;
        }

        function handleSearch($data) {
            sortedMoveToPage($data, 0);

            if (!$data || !$data.length) {
                modalService.showMessageDialog({
                    message: 'There is no address matching your keyword'
                });
            }
        }

        function triggerEvent(attributeName, value) {
            attrsService.trigger($scope, $attrs, attributeName, value);
        }

        function moveToPageIfExists(pageIndex) {
            if (pageIndex !== undefined && pageIndex !== null && pageIndex >= 0 && vm.pagination.pageCount > pageIndex) {
                moveToPage(pageIndex);
            } else if (pageIndex < 0) {
                vm.pagination.pageIndex = 0;
            } else if (vm.pagination.pageCount < vm.pagination.pageIndex + 1) {
                vm.pagination.pageIndex = vm.pagination.pageCount;
            }
        }

        function moveToPage(pageIndex) {
            vm.pagination.pageSize = +vm.pagination.pageSize;
            vm.pagination = paginationService.paginate(vm.attributes.gridData, pageIndex, vm.pagination.pageSize);
            vm.attributes.pagination = vm.pagination;
            return vm.pagination;
        }

        function setSortOrder(column, direction) {
            if (vm.sort.column !== column || vm.sort.direction !== direction) {
                vm.sort.column = column;
                vm.sort.direction = direction;

                sortOutData(column);
                vm.moveToPage(0);
            }
        }

        function toggleSortOrder(column) {
            if (vm.attributes.disableSorting) {
                return;
            }

            var direction = undefined;
            if (vm.sort.column === column) {
                direction = vm.sort.direction === 'ascending' ? 'descending' : 'ascending';
            } else {
                direction = 'ascending';
            }

            setSortOrder(column, direction);
        }

        function setPageSelection(value) {
            vm.pagination.data.forEach(function (row) {
                return row.isSelected = value;
            });
        }

        function getSelectedKeysOnCurrentPage() {
            return vm.pagination.data.filter(function (row) {
                return row.isSelected;
            }).map(function (row) {
                return row.key;
            });
        }

        function getSelectedKeysOnAllPages() {
            return vm.attributes.gridData.filter(function (row) {
                return row.isSelected;
            }).map(function (row) {
                return row.key;
            });
        }

        function getSortOrderCssClasses(columnName) {
            return vm.sort.column === columnName && !vm.attributes.disableSorting ? 'current ' + vm.sort.direction : '';
        }

        function addElement(elementDetails) {
            return ewfCrudService.addElement(vm.addUrl, elementDetails).then(function (response) {
                vm.attributes.gridData.push(response);
                vm.rebuildGrid();
                return response;
            })['catch'](function (error) {
                vm.broadcastActionReport('rejected', error);
                return $q.reject(error);
            });
        }

        function updateElement(elementDetails) {
            return ewfCrudService.updateElement(vm.updateUrl, elementDetails).then(function (response) {
                var elementToUpdate = vm.attributes.gridData.find(function (singleElement) {
                    return singleElement.key === response.key;
                });
                Object.assign(elementToUpdate, response);
                return response;
            });
        }

        function getElement(key) {
            return ewfCrudService.getElementDetails(vm.getElementUrl, key).then(function (response) {
                return response;
            })['catch'](function (error) {
                return broadcastActionReport('rejected', error);
            });
        }

        function deleteElements(elementKeys, messageCode) {
            var count = _angular2['default'].isArray(elementKeys) ? elementKeys.length : 1;
            var modalMessageCode = messageCode || 'common.delete_one_item_confirmation_message';
            nlsService.getTranslation(modalMessageCode).then(function (modalMessage) {
                return modalService.showConfirmationDialog({
                    message: modalMessage.replace('{number}', count),
                    nlsTitle: 'common.confirm_deletion_title',
                    okButtonNlsLabel: 'common.confirm_deletion_button_yes',
                    cancelButtonNlsLabel: 'common.confirm_deletion_button_no'
                }).then(function () {
                    vm.selectAll = false;
                    setPageSelection(false);
                    ewfCrudService.deleteElements(elementKeys, vm.deleteUrl, vm.deleteParamName).then(function (keysOfElements) {
                        var keyArray = [].concat(keysOfElements);
                        vm.attributes.gridData = vm.attributes.gridData.filter(function (item) {
                            return !keyArray.includes(item.key);
                        });
                        rebuildGrid();
                        broadcastActionReport('deleted', keyArray.length);
                    })['catch'](function (error) {
                        return broadcastActionReport('rejected', error);
                    });
                });
            });
        }

        function bulkDeleteElements(messageCode) {

            /*
             DHLEWFCON-6164. customer requirement
             We should delete all selected elements no just on current shown page.
            */
            var elementsToDelete = vm.getSelectedKeysOnAllPages();

            vm.deleteElements(elementsToDelete, messageCode);
            vm.changeMarkersToFalse();
        }

        function changeMarkersToFalse() {
            vm.showActions = false;
            vm.selectAll = false;
        }

        function showActionsToFalse() {
            vm.showActions = false;
        }

        function showActionsInvert() {
            vm.showActions = !vm.showActions;
        }

        function broadcastActionReport(action, notificationData) {
            if (vm.ctrlToNotify) {
                var actionTypesInstance = Object.create(vm.actionNotificationTypes);
                actionTypesInstance[action] = true;
                gridStateChanged(actionTypesInstance, notificationData, vm.ctrlToNotify);
            }
        }

        function gridStateChanged(actionCases, sharedData, ctrl) {
            ctrl.gridActionStatus = actionCases;
            ctrl.notificationData = sharedData;
            $timeout(function () {
                ctrl.gridActionStatus = {};
            }, 4000);
        }

        function hideColumnCustomizationDialog() {
            modalWindow.close();
        }

        function showColumnCustomizationDialog() {
            vm.selectedColumns = {};
            vm.attributes.visibleColumns.forEach(function (column, index) {
                vm.selectedColumns['column' + (index + 1)] = {
                    alias: column.alias,
                    title: column.title
                };
            });

            modalWindow = modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ewf-modal_width_full',
                template: '<ewf-modal><div column-customization><div id=modal_customizeColumns class=\"modal full-width\" ng-class=\"{visible: ewfGridCtrl.getColumnCustomizationVisibility()}\"><table class=\"table table_zebra\"><tbody><tr><th nls=address-book.column_1_title></th><th nls=address-book.column_2_title></th><th nls=address-book.column_3_title></th><th nls=address-book.column_4_title></th><th nls=address-book.column_5_title></th></tr><tr><td><span class=select><select ng-model=ewfGridCtrl.selectedColumns.column1 ng-options=\"columns.translatedTitle for columns in ewfGridCtrl.attributes.availableColumns track by columns.alias\"></select></span></td><td><span class=select><select ng-model=ewfGridCtrl.selectedColumns.column2 ng-options=\"columns.translatedTitle for columns in ewfGridCtrl.attributes.availableColumns track by columns.alias\"></select></span></td><td><span class=select><select ng-model=ewfGridCtrl.selectedColumns.column3 ng-options=\"columns.translatedTitle for columns in ewfGridCtrl.attributes.availableColumns track by columns.alias\"></select></span></td><td><span class=select><select ng-model=ewfGridCtrl.selectedColumns.column4 ng-options=\"columns.translatedTitle for columns in ewfGridCtrl.attributes.availableColumns track by columns.alias\"></select></span></td><td><span class=select><select ng-model=ewfGridCtrl.selectedColumns.column5 ng-options=\"columns.translatedTitle for columns in ewfGridCtrl.attributes.availableColumns track by columns.alias\"></select></span></td></tr></tbody></table><a class=\"btn btn_right close-modal\" ng-click=ewfGridCtrl.updateVisibleColumns() nls=address-book.update_button_title></a> <a class=\"x-button close-modal\" ng-click=ewfGridCtrl.hideColumnCustomizationDialog()></a></div></div></ewf-modal>'
            });
        }

        function updateVisibleColumns() {
            attrsService.trigger($scope, $attrs, 'onColumnsChanged', { selectedColumns: vm.selectedColumns });
            var isStillSorted = Object.keys(vm.selectedColumns).some(function (key) {
                return vm.selectedColumns[key].alias === vm.sort.column;
            });

            if (!isStillSorted) {
                vm.setSortOrder(vm.selectedColumns.column1.alias, 'ascending');
            }
            vm.hideColumnCustomizationDialog();
        }

        function isCurrentPage(page) {
            if (page) {
                return vm.pagination.pageIndex === page.index;
            }
            return false;
        }

        function updatePagination(pagination) {
            vm.pagination = pagination;
        }
    }
});
//# sourceMappingURL=ewf-grid-controller.js.map
