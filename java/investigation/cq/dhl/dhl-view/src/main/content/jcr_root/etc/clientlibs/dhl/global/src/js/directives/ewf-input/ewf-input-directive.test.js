import 'angularMocks';
import ewfInput from './ewf-input-directive';
import InputController from './ewf-input-controller';


describe('ewfInput', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let fieldName;
    let ewfInputCtrl;
    let ngModelCtrl;

    function callSutPreLink() {
        sut.link.pre(scope, element, attrs, [ngModelCtrl, ewfInputCtrl]);
    }

    function callSutPostLink() {
        sut.link.post(scope, element, attrs, [ngModelCtrl, ewfInputCtrl]);
    }

    beforeEach(inject((_$rootScope_, _$q_) => {
        fieldName = 'form_name.field_name';
        scope = _$rootScope_.$new();

        element = jasmine.createSpyObj('element', ['on', 'addClass']);
        attrs = {
            ewfInput: fieldName
        };
        ngModelCtrl = {};
        ewfInputCtrl = jasmine.mockComponent(new InputController(scope, _$q_));

        sut = new ewfInput();
    }));

    describe('#preLink', () => {
        it('should set field name from attribute value to the controller', () => {
            callSutPreLink();
            expect(ewfInputCtrl.fieldName).toBe(fieldName);
        });

        it('should set ngModel controller instance to the controller', () => {
            callSutPreLink();
            expect(ewfInputCtrl.ngModelCtrl).toBe(ngModelCtrl);
        });

        it('should run validation setup for the controller', () => {
            callSutPreLink();
            expect(ewfInputCtrl.setupValidation).toHaveBeenCalled();
        });
    });

    describe('#postLink', () => {
        it('should call inputController.init with fieldId, element, attrs, ngModelCtrl', () => {
            callSutPostLink();
            expect(ewfInputCtrl.init).toHaveBeenCalledWith(fieldName, element, attrs, ngModelCtrl);
        });

        it('add scope listener for ValidateForm', () => {
            spyOn(scope, '$on');

            callSutPostLink();
            expect(scope.$on).toHaveBeenCalledWith('ValidateForm', jasmine.any(Function));
        });

        it('add "ng-dirty ng-blur" class to element on ValidateForm scope event', () => {
            callSutPostLink();
            scope.$broadcast('ValidateForm');

            expect(element.addClass).toHaveBeenCalledWith('ng-dirty ng-blur');
        });

        it('add listener for ValidateForm event on listener', () => {
            callSutPostLink();
            expect(element.on).toHaveBeenCalledWith('blur', jasmine.any(Function));
        });
    });
});
