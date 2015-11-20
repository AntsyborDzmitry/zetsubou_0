import 'angularMocks';
import ewfField from './ewf-field-directive';


describe('ewfField', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let name;
    let ewfFieldCtrl;
    let ewfFormCtrl;

    function callSutPreLink() {
        sut.link.pre(scope, element, attrs, [ewfFormCtrl, ewfFieldCtrl]);
    }

    beforeEach(() => {
        name = 'form_name.field_name';
        scope = {};
        element = {};
        attrs = {
            ewfField: name
        };
        ewfFieldCtrl = {
            name: null
        };
        ewfFormCtrl = {};

        sut = new ewfField();
    });

    describe('#preLink', () => {
        it('should set field name to the controller', () => {
            callSutPreLink();
            expect(ewfFieldCtrl.name).toBe(name);
        });

        it('should set ewf-form controller instance to the controller', () => {
            callSutPreLink();
            expect(ewfFieldCtrl.ewfFormCtrl).toBe(ewfFormCtrl);
        });
    });
});
