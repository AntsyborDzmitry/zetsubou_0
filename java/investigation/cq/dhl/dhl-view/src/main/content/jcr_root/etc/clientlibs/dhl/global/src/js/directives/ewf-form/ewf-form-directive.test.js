import EwfForm from './ewf-form-directive';
import EwfFormController from './ewf-form-controller';
import 'angularMocks';

describe('ewfForm', () => {
    let sut;

    let $scope;
    let $element;
    let $attrs;
    let ctrl;

    beforeEach(inject(($rootScope) => {
        $scope = $rootScope.$new();
        $element = {};
        $attrs = {};
        ctrl = jasmine.mockComponent(new EwfFormController());

        sut = new EwfForm();
    }));

    describe('#preLink', () => {
        it('calls controller\'s init method, passing formName', () => {
            let formName = 'someFormName';
            $attrs.ewfForm = formName;

            sut.link.pre($scope, $element, $attrs, [ctrl]);

            expect(ctrl.init).toHaveBeenCalledWith(formName);
        });

        it('attaches lets ng-form highlight validation errors and errors from ajax response', () => {
            const ngFormCtrl = {
                validate: null,
                setErrorsFromResponse: null
            };
            sut.link.pre($scope, $element, $attrs, [ctrl, ngFormCtrl]);

            expect(ngFormCtrl.validate).toBe(ctrl.ewfValidation);
            expect(ngFormCtrl.setErrorsFromResponse).toBe(ctrl.setErrorsFromResponse);
        });
    });
});
