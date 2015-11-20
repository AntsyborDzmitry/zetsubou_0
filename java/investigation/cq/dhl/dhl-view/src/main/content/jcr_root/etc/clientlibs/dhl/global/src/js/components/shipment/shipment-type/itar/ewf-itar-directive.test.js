import ewfItar from './ewf-itar-directive';
import ItarController from './ewf-itar-controller';
import ItarEeiController from './eei/ewf-itar-eei-controller';
import EwfContainerController from './../../../../directives/ewf-container/ewf-container-controller';

describe('ewfItar', () => {
    let sut;
    let itarCtrl, itarEeiCtrl, ewfContainerCtrl;
    let $scope, elem, attrs;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        itarCtrl = jasmine.mockComponent(new ItarController());
        itarEeiCtrl = jasmine.mockComponent(new ItarEeiController());
        ewfContainerCtrl = jasmine.mockComponent(new EwfContainerController());

        ewfContainerCtrl.getRegisteredControllerInstance.and.returnValue(itarEeiCtrl);

        sut = new ewfItar();
    }));

    function callPreLink() {
        const controllers = [itarCtrl, ewfContainerCtrl];
        sut.link.pre($scope, elem, attrs, controllers);
    }

    describe('preLink', () => {
        beforeEach(() => {
            callPreLink();
        });

        it('should itar controller using ewf container', () => {
            expect(ewfContainerCtrl.registerControllerInstance).toHaveBeenCalledWith('itarCtrl', itarCtrl);
        });

        it('should register callback for itar-eei-ctrl creation', () => {
            expect(ewfContainerCtrl.registerCallback).toHaveBeenCalledWith('itarEeiCtrl', jasmine.any(Function));
        });

        it('should init itar controller', () => {
            expect(itarCtrl.init).toHaveBeenCalledWith();
        });
    });

    describe('ewf-container callback', () => {
        let ewfContainerCallback;

        beforeEach(() => {
            ewfContainerCtrl.registerCallback = function(str, callback) {
                ewfContainerCallback = callback;
            };

            callPreLink();
            ewfContainerCallback();
        });

        it('should set itarEeiCtrl to itarCtrl', () => {
            expect(itarCtrl.itarEeiCtrl).toEqual(itarEeiCtrl);
        });
    });
});
