import EwfAddress from './ewf-address-cq-directive';
import EwfAddressController from './ewf-address-controller';
import 'angularMocks';

describe('EwfAddress', () => {
    let sut;
    let EwfAddressControllerMock;
    let $scope, elem, attrs;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {
            setResidentialFlagFromProfile: 'false'
        };

        EwfAddressControllerMock = jasmine.mockComponent(new EwfAddressController());

        sut = new EwfAddress();
    }));

    function postLinkInit() {
        const ctrl = EwfAddressControllerMock;
        sut.link.post($scope, elem, attrs, ctrl);
    }

    describe('postLink function', () => {
        beforeEach(() => {
            postLinkInit();
        });

        it('should call to init function of controller', () => {
            const settings = {
                setResidentialFlagFromProfile: false
            };
            expect(EwfAddressControllerMock.init).toHaveBeenCalledWith(settings);
        });
    });
});
