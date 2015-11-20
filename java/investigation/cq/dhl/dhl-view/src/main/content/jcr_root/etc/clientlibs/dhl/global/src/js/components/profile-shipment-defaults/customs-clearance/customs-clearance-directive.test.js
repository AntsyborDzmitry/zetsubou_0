import CustomsClearanceDirective from './customs-clearance-directive';
import CustomClearanceController from './customs-clearance-controller';
import 'angularMocks';

describe('CustomsClearanceDirective', () => {
    let sut;
    let CustomsClearanceDirectiveCtrl;
    let $scope, elem, attrs;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        CustomsClearanceDirectiveCtrl = jasmine.mockComponent(new CustomClearanceController());
        sut = new CustomsClearanceDirective();
    }));

    function postLinkInit() {
        sut.link.post($scope, elem, attrs, CustomsClearanceDirectiveCtrl);
    }

    describe('postLink function', () => {
        beforeEach(() => {
            postLinkInit();
        });

        it('should call to init function of controller', () => {
            expect(CustomsClearanceDirectiveCtrl.init).toHaveBeenCalled();
        });
    });
});
