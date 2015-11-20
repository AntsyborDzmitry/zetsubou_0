import EwfSearchController from './ewf-search-controller';
import AttrsService from './../../services/attrs-service';
import NlsService from './../../services/nls-service';

describe('EwfSearchController', () => {
    let sut, $q, $timeout, $scope, $attrs;
    let searchServiceMock, nlsService, attrsService;
    let deferedPlainSearch, defferedTypeahead;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_;
        $attrs = {
            onSelection: `addr as addr.name for addr in ewfSearchCtrl.typeAheadSearch($viewValue,
            ewfSearchCtrl.searchCategory)`,
            typeaheadTemplateUrl: 'ewf-search-item.html'
        };

        deferedPlainSearch = $q.defer();
        defferedTypeahead = $q.defer();

        attrsService = jasmine.mockComponent(new AttrsService());
        searchServiceMock = jasmine.createSpyObj('ewfSearchService', ['plainSearch', 'typeAheadSearch']);
        nlsService = jasmine.mockComponent(new NlsService());

        attrsService.trigger.and.returnValue($q.when([]));
        nlsService.getTranslation.and.returnValues($q.when([]));
        searchServiceMock.plainSearch.and.returnValue(deferedPlainSearch.promise);
        searchServiceMock.typeAheadSearch.and.returnValue(defferedTypeahead.promise);

    }));

    it('should initialize plainSearchQuery as empty string', () => {
        sut = new EwfSearchController($scope, $attrs, $q, searchServiceMock, attrsService, nlsService);

        expect(sut.plainSearchQuery).toBe('');
    });

    it('should check that plain search is called', () => {
        sut = new EwfSearchController($scope, $attrs, $q, searchServiceMock, attrsService, nlsService);

        const mockData = {
            query: 'a',
            results: [{
                data: {
                    key: '003'
                },
                line1: 'CONTACT_NAME COMPANY_NAME',
                line2: 'ADDR_LINE1 CITY_NAME',
                line3: 'ZIP_OR_POST CITY_SUBURB_NAME STATE_OR_PROVINCE COUNTRY_DHL_NAME',
                matchedParameter: {}
            }]
        };
        sut.plainSearch();
        deferedPlainSearch.resolve(mockData);
        $timeout.flush();

        expect(searchServiceMock.plainSearch).toHaveBeenCalled();
    });

    it('should call error when plain search is called', () => {
        sut = new EwfSearchController($scope, $attrs, $q, searchServiceMock, attrsService, nlsService);

        const mockDataError = {
            query: 'a',
            results: [{
                data: {
                    key: '003'
                },
                line1: 'CONTACT_NAME COMPANY_NAME',
                line2: 'ADDR_LINE1 CITY_NAME',
                line3: 'ZIP_OR_POST CITY_SUBURB_NAME STATE_OR_PROVINCE COUNTRY_DHL_NAME',
                matchedParameter: {}
            }]
        };
        sut.plainSearch();
        deferedPlainSearch.reject(mockDataError);
        $timeout.flush();

        expect(searchServiceMock.plainSearch).toHaveBeenCalled();
    });

    it('should check that typeahead is called', () => {
        sut = new EwfSearchController($scope, $attrs, $q, searchServiceMock, attrsService, nlsService);

        const mockDataTypeAhead = {
            query: 'a',
            results: [{
                data: {
                    key: '003'
                },
                line1: 'CONTACT_NAME COMPANY_NAME',
                line2: 'ADDR_LINE1 CITY_NAME',
                line3: 'ZIP_OR_POST CITY_SUBURB_NAME STATE_OR_PROVINCE COUNTRY_DHL_NAME',
                matchedParameter: {}
            }]
        };

        sut.typeAheadSearch();
        defferedTypeahead.resolve(mockDataTypeAhead);
        $timeout.flush();

        expect(searchServiceMock.typeAheadSearch).toHaveBeenCalled();
    });

    it('should display error when typeahead is called', () => {
        sut = new EwfSearchController($scope, $attrs, $q, searchServiceMock, attrsService, nlsService);

        const mockDataTypeAheadError = {
            query: 'a',
            results: [{
                data: {
                    key: '003'
                },
                line1: 'CONTACT_NAME COMPANY_NAME',
                line2: 'ADDR_LINE1 CITY_NAME',
                line3: 'ZIP_OR_POST CITY_SUBURB_NAME STATE_OR_PROVINCE COUNTRY_DHL_NAME',
                matchedParameter: {}
            }]
        };

        sut.typeAheadSearch();
        defferedTypeahead.reject(mockDataTypeAheadError);
        $timeout.flush();

        expect(searchServiceMock.typeAheadSearch).toHaveBeenCalled();
    });
});
