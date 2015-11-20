import langselectorService from './langselector-service';
import 'angularMocks';

describe('langselectorService', () => {
    let sut;
    let logService;
    let $httpBackend;

    beforeEach(inject(($http, $q, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;
        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new langselectorService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#loadAvailableLanguages', () => {
        it('should make API call to proper URL', () => {
            const pagePath = 'some-path';
            const countryCode = 'US';

            $httpBackend.whenGET(`/services/dhl/nls/pagelangs?pagepath=${pagePath}&country=${countryCode}`)
                            .respond(401, 'some error');
            sut.loadAvailableLanguages(pagePath, countryCode);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(`LangSelector failed to get langs! some error`);
        });

        it('should remove html extension if it is available', () => {
            const pagePath = 'some-path.html';
            const cleanedPath = 'some-path';
            const countryCode = 'US';

            $httpBackend.whenGET(`/services/dhl/nls/pagelangs?pagepath=${cleanedPath}&country=${countryCode}`)
                            .respond(401, 'some error');
            sut.loadAvailableLanguages(pagePath, countryCode);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(`LangSelector failed to get langs! some error`);
        });
    });
});
