define(['exports', 'module', '../../services/search-service', '../../services/attrs-service', '../../services/nls-service', 'angular'], function (exports, module, _servicesSearchService, _servicesAttrsService, _servicesNlsService, _angular) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfSearchController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    EwfSearchController.$inject = ['$scope', '$attrs', '$q', 'ewfSearchService', 'attrsService', 'nlsService'];

    function EwfSearchController($scope, $attrs, $q, ewfSearchService, attrsService, nlsService) {
        var vm = this;
        var ewfSearch = $attrs.ewfSearch ? $scope.$eval($attrs.ewfSearch) : {};
        //uses for define empty typeahead search
        var testKeyForOnFocusSearch = 'D5B5E5F4-923E-4FD7-AC06-65EA2A7DDED5';
        var excludedFromUIFieldList = ['eoriNumber', 'cnpjOrCPFTaxID'];

        Object.assign(vm, {
            fields: generateFields([['name', 'address-book.contact_name_title'], ['company', 'address-book.company_title'], ['address1', 'address-book.address_title'], ['city', 'address-book.city_title'], ['postalCode', 'address-book.zip_title'], ['suburb', 'address-book.paidBy_title'], ['stateProvince', 'address-book.state_or_province'], ['country', 'address-book.country_title'], ['emailAddress', 'address-book.email_title'], ['phone', 'address-book.work_phone_title'], ['nickname', 'address-book.nickName_title'], ['matchCode', 'address-book.matchCode_title'], ['vatTaxId', 'address-book.vat_title'], ['deliveryNote', 'address-book.deliveryNote_title'], ['eoriNumber', 'address-book.eoriNumber_title'], ['cnpjOrCPFTaxID', 'address-book.cnpjOrCPFTaxID_title']]),
            plainSearchQuery: '',

            getTestKeyForOnFocusSearch: getTestKeyForOnFocusSearch,
            plainSearch: plainSearch,
            typeAheadSearch: typeAheadSearch
        });

        setQueryParamsString();

        var translationPromise = translateFields();
        var translationGroupNamesPromise = translateGroupNames();

        function plainSearch(query, category) {
            return ewfSearchService.plainSearch(getQuery(query), getFieldName(category), ewfSearch.searchType).then(function (data) {
                return attrsService.trigger($scope, $attrs, 'onSearch', { $data: data });
            });
        }

        function typeAheadSearch(query, category) {
            var searchQuery = getQuery(query);
            var typeAheadSearchPromise = ewfSearchService.typeAheadSearch(searchQuery, getFieldName(category), ewfSearch.queryParamsString, ewfSearch.searchType);

            return $q.all([typeAheadSearchPromise, translationGroupNamesPromise, translationPromise]).then(function (results) {
                var _results = _slicedToArray(results, 2);

                var searchData = _results[0];

                var _results$1 = _slicedToArray(_results[1], 2);

                var fromAddressBookTranslation = _results$1[0];
                var fromFavoritesTranslation = _results$1[1];

                if (!searchData.results.length) {
                    return [];
                }
                var responseList = searchData.results.map(function (item) {
                    var subSearchResultTitle = '';
                    var subSearchResult = item.matchedParameter && Object.keys(item.matchedParameter)[0];

                    if (subSearchResult) {
                        vm.fields.forEach(function (translation) {
                            if (translation.name === subSearchResult) {
                                subSearchResultTitle = translation.caption + ' : ';
                            }
                        });
                    }

                    subSearchResult = item.matchedParameter && item.matchedParameter[subSearchResult] || '';

                    return {
                        name: item.line1,
                        line1: item.line1,
                        line2: item.line2,
                        line3: item.line3,
                        line4: subSearchResultTitle,
                        line5: subSearchResult,
                        group: searchQuery ? fromAddressBookTranslation : fromFavoritesTranslation,
                        key: item.data.key,
                        data: item.data
                    };
                });

                responseList[0].firstInGroup = true;
                return responseList;
            });
        }

        function getFieldConfig(name, caption) {
            var type = arguments.length <= 2 || arguments[2] === undefined ? 'numerical' : arguments[2];

            var showInUI = !excludedFromUIFieldList.includes(name);
            return {
                name: name,
                caption: caption,
                type: type,
                showInUI: showInUI
            };
        }

        function generateFields(fieldParametersList) {
            return fieldParametersList.map(function (fieldParameters) {
                return getFieldConfig.apply(vm, fieldParameters);
            });
        }

        function translateFields() {
            var translateDeferred = $q.defer();
            var translationPromises = vm.fields.map(function (field) {
                return nlsService.getTranslation(field.caption);
            });

            $q.all(translationPromises).then(function (translations) {
                translations.forEach(function (translation, index) {
                    return vm.fields[index].caption = translation;
                });
                translateDeferred.resolve(true);
            })
            //even if we can't get translation, show search results any way
            ['catch'](function () {
                return translateDeferred.resolve(false);
            });
            return translateDeferred.promise;
        }

        function translateGroupNames() {
            var translateDeferred = $q.defer();
            var translationPromises = [nlsService.getTranslation('address-book.from_address_book_group_name'), nlsService.getTranslation('address-book.from_favorites_group_name')];

            $q.all(translationPromises).then(function (translations) {
                return translateDeferred.resolve(translations);
            })
            //even if we can't get translation, show search results any way
            ['catch'](function () {
                return translateDeferred.resolve([]);
            });
            return translateDeferred.promise;
        }

        function getFieldName(fieldName) {
            return fieldName || ewfSearch.fieldName;
        }

        function getQuery(query) {
            return encodeURIComponent(query === testKeyForOnFocusSearch ? '' : query);
        }

        function getTestKeyForOnFocusSearch() {
            return testKeyForOnFocusSearch;
        }

        function setQueryParamsString() {
            ewfSearch.queryParamsString = _angular2['default'].element.param(ewfSearch.queryParams || {});
        }
    }
});
//# sourceMappingURL=ewf-search-controller.js.map
