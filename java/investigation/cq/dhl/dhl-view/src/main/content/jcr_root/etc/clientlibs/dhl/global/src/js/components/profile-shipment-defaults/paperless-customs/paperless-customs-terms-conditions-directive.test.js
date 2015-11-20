import 'angularMocks';
import PaperlessCustomsTermsConditions from './paperless-customs-terms-conditions-directive';

describe('paperlessCustomsTermsConditionsDirective', () => {
    let sut;

    beforeEach(() => {
        sut = PaperlessCustomsTermsConditions();
    });

    it('should have correct DDO', () => {
        expect(sut).toEqual({
            restrict: 'AE',
            template: jasmine.any(String) //templateUrl is inlined as template by gulp
        });
    });
});
