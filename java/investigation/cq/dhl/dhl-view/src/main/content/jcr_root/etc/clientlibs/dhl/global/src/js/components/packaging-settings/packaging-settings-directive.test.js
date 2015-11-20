import PackagingSettings from './packaging-settings-directive';
import 'angularMocks';

xdescribe('PackagingSettings', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();

        ctrl = jasmine.createSpyObj('PackagingSettingsController', ['init']);

        sut = new PackagingSettings();
    }));

    it('Should call controller to pre-load init data', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.init).toHaveBeenCalled();
    });

});
