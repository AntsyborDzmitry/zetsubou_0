import ewfProfileShipmentDefault from './som-currency-directive';
import SomCurrencyController from './som-currency-controller';
import 'angularMocks';

describe('ewfSomCurrency', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();

        ctrl = jasmine.mockComponent(new SomCurrencyController());

        sut = new ewfProfileShipmentDefault();
    }));

    it('should call controller to pre-load default UOM and currency settings', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadDefaultSomAndCurrency).toHaveBeenCalledWith();
    });

    it('should check current tab', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadSectionFromUrl).toHaveBeenCalledWith();
    });
});
