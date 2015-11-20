import 'angularMocks';
import EwfModalResolver from './ewf-modal-resolver-directive';


describe('ewfModalResolver', () => {
    let sut;
    let scope, element, attrs;
    let ewfModalCtrl;

    function callSutLink() {
        sut.link(scope, element, attrs, ewfModalCtrl);
    }

    beforeEach(inject(($rootScope) => {
        scope = Object.assign($rootScope.$new(), {
            result: {}
        });
        element = jasmine.mockComponent(angular.element());
        attrs = {};

        ewfModalCtrl = jasmine.createSpyObj('ewfModalCtrl', ['close']);

        sut = new EwfModalResolver();
    }));

    describe('#link', () => {
        beforeEach(() => {
            element.click.and.callFake((fn) => {
                fn();
            });
            callSutLink();
        });

        it('should bind to element click event', () => {
            expect(element.click).toHaveBeenCalledWith(jasmine.any(Function));
        });

        it('should close modal on element click', () => {
            expect(ewfModalCtrl.close).toHaveBeenCalledWith(scope.result);
        });
    });
});
