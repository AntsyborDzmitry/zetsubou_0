import PackagingDefaults from './packaging-defaults-directive';
import 'angularMocks';

describe('PackagingDefaults', () => {
    let sut;
    let packagingDefaultsCtrlMock;

    beforeEach(() => {
        packagingDefaultsCtrlMock = jasmine.createSpyObj('PackagingDefaultsController', ['init']);

        sut = new PackagingDefaults();

        sut.link.pre({}, {}, {}, packagingDefaultsCtrlMock);
    });

    it('should call controller to load init data', () => {
        expect(packagingDefaultsCtrlMock.init).toHaveBeenCalledWith();
    });
});
