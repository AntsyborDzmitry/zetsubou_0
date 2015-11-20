import 'angularMocks';
import EwfcValue from './ewfc-value-directive';
import EwfcValueCtrl from './ewfc-value-controller';

describe('ewfcValue', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let ewfcValueCtrl;

    beforeEach(() => {
        scope = {}; //jasmine.createSpyObj('scope', ['$watch']);
        element = {}; //jasmine.createSpyObj('element', ['controller']);
        attrs = {ewfcValue: 'some value'};
        ewfcValueCtrl = jasmine.mockComponent(new EwfcValueCtrl());

        sut = new EwfcValue();
    });

    describe('#prelink', () => {
        it('should set render function to controller', () => {
            sut.link.pre(scope, element, attrs, ewfcValueCtrl);
            expect(ewfcValueCtrl.setRenderFunction).toHaveBeenCalledWith(jasmine.any(Function));
        });
        it('should set desired value from controller', () => {
            sut.link.pre(scope, element, attrs, ewfcValueCtrl);
            expect(ewfcValueCtrl.setValue).toHaveBeenCalledWith(attrs.ewfcValue);
        });
    });
});
