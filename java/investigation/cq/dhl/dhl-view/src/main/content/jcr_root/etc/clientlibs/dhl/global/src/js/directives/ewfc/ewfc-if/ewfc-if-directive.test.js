import 'angularMocks';
import EwfcIf from './ewfc-if-directive';
import EwfcIfCtrl from './ewfc-if-controller';

describe('ewfcIf', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let ewfcIfCtrl;
    let ngIfDirective;

    beforeEach(() => {
        scope = {};
        element = {};
        attrs = {ewfcIf: 'some value'};
        ewfcIfCtrl = jasmine.mockComponent(new EwfcIfCtrl());

        ngIfDirective = [{
            transclude: '',
            priority: '',
            terminal: '',
            restrict: '',
            link: {
                apply: jasmine.createSpy('ngIfLink')
            }
        }];

        sut = new EwfcIf(ngIfDirective);
    });

    describe('#link', () => {
        it('should set render function to controller', () => {
            sut.link(scope, element, attrs, ewfcIfCtrl);
            expect(ewfcIfCtrl.setRenderFunction).toHaveBeenCalledWith(jasmine.any(Function));
        });
        it('should set desired value from controller', () => {
            sut.link(scope, element, attrs, ewfcIfCtrl);
            expect(ewfcIfCtrl.setValue).toHaveBeenCalledWith(attrs.ewfcIf);
        });
    });
});
