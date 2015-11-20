import '../../services/search-service';
import '../../services/attrs-service';
import '../../services/nls-service';
import angular from 'angular';

EwfSearchController.$inject = [
    '$scope',
    '$attrs',
    '$q',
    'ewfSearchService',
    'attrsService',
    'nlsService'
];

export default function EwfSearchController(
    $scope,
    $attrs,
    $q,
    ewfSearchService,
    attrsService,
    nlsService
) {
    const vm = this;
    const ewfSearch = $attrs.ewfSearch ? $scope.$eval($attrs.ewfSearch) : {};
    //uses for define empty typeahead search
    const testKeyForOnFocusSearch = 'D5B5E5F4-923E-4FD7-AC06-65EA2A7DDED5';
    const excludedFromUIFieldList = ['eoriNumber', 'cnpjOrCPFTaxID'];


    Object.assign(vm, {
        fields: generateFields([
            ['name', 'address-book.contact_name_title'],
            ['company', 'address-book.company_title'],
            ['address1', 'address-book.address_title'],
            ['city', 'address-book.city_title'],
            ['postalCode', 'address-book.zip_title'],
            ['suburb', 'address-book.paidBy_title'],
            ['stateProvince', 'address-book.state_or_province'],
            ['country', 'address-book.country_title'],
            ['emailAddress', 'address-book.email_title'],
            ['phone', 'address-book.work_phone_title'],
            ['nickname', 'address-book.nickName_title'],
            ['matchCode', 'address-book.matchCode_title'],
            ['vatTaxId', 'address-book.vat_title'],
            ['deliveryNote', 'address-book.deliveryNote_title'],
            ['eoriNumber', 'address-book.eoriNumber_title'],
            ['cnpjOrCPFTaxID', 'address-book.cnpjOrCPFTaxID_title']
        ]),
        plainSearchQuery: '',

        getTestKeyForOnFocusSearch,
        plainSearch,
        typeAheadSearch
    });

    setQueryParamsString();

    const translationPromise = translateFields();
    const translationGroupNamesPromise = translateGroupNames();

    function plainSearch(query, category) {
        return ewfSearchService.plainSearch(getQuery(query), getFieldName(category), ewfSearch.searchType)
            .then((data) => attrsService.trigger($scope, $attrs, 'onSearch', {$data: data}));
    }

    function typeAheadSearch(query, category) {
        const searchQuery = getQuery(query);
        const typeAheadSearchPromise = ewfSearchService.typeAheadSearch(
            searchQuery,
            getFieldName(category),
            ewfSearch.queryParamsString,
            ewfSearch.searchType
        );

        return $q.all([typeAheadSearchPromise, translationGroupNamesPromise, translationPromise])
            .then((results) => {
                const [searchData, [fromAddressBookTranslation, fromFavoritesTranslation]] = results;
                if (!searchData.results.length) {
                    return [];
                }
                const responseList = searchData.results.map((item) => {
                    let subSearchResultTitle = '';
                    let subSearchResult = item.matchedParameter && Object.keys(item.matchedParameter)[0];

                    if (subSearchResult) {
                        vm.fields.forEach((translation) => {
                            if (translation.name === subSearchResult) {
                                subSearchResultTitle = `${translation.caption} : `;
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

    function getFieldConfig(name, caption, type = 'numerical') {
        const showInUI = !excludedFromUIFieldList.includes(name);
        return {
            name,
            caption,
            type,
            showInUI
        };
    }

    function generateFields(fieldParametersList) {
        return fieldParametersList.map((fieldParameters) => getFieldConfig.apply(vm, fieldParameters));
    }

    function translateFields() {
        const translateDeferred = $q.defer();
        const translationPromises = vm.fields.map((field) => nlsService.getTranslation(field.caption));

        $q.all(translationPromises)
            .then((translations) => {
                translations.forEach((translation, index) => vm.fields[index].caption = translation);
                translateDeferred.resolve(true);
            })
            //even if we can't get translation, show search results any way
            .catch(() => translateDeferred.resolve(false));
        return translateDeferred.promise;
    }

    function translateGroupNames() {
        const translateDeferred = $q.defer();
        const translationPromises = [
            nlsService.getTranslation('address-book.from_address_book_group_name'),
            nlsService.getTranslation('address-book.from_favorites_group_name')
        ];

        $q.all(translationPromises)
            .then((translations) => translateDeferred.resolve(translations))
            //even if we can't get translation, show search results any way
            .catch(() => translateDeferred.resolve([]));
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
        ewfSearch.queryParamsString = angular.element.param(ewfSearch.queryParams || {});
    }
}
