import 'angularMocks';
import nlsBind from './nls-bind-directive';


describe('nlsBind', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let nlsCtrl;

    beforeEach(() => {
        scope = jasmine.createSpyObj('scope', ['$watch']);
        element = jasmine.createSpyObj('element', ['controller']);
        attrs = jasmine.createSpyObj('attrs', ['$observe']);
        nlsCtrl = jasmine.createSpyObj('nlsCtrl', ['translate']);

        sut = new nlsBind();
    });

    describe('#link', () => {
        it('should observe nls attribute changes', () => {
            sut.link(scope, element, attrs, nlsCtrl);
            expect(attrs.$observe).toHaveBeenCalledWith('nls', jasmine.any(Function));
        });
    });
});
