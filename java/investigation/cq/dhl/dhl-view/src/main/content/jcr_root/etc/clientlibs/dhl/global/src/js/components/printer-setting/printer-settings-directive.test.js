import PrinterSettings from './printer-settings-directive';
import 'angularMocks';

describe('PrinterSettings', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();

        ctrl = jasmine.createSpyObj('PrinterSettingsController', ['preloadPrinterSettings']);

        sut = new PrinterSettings();
    }));

    it('Should call controller to pre-load tab from url', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadPrinterSettings).toHaveBeenCalled();
    });

});
