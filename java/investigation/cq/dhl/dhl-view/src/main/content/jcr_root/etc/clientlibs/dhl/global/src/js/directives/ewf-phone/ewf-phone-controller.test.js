import EwfPhoneController from './ewf-phone-controller';

describe('EwfPhoneController', () => {
    let sut;
    let mockAttrService;

    const $scope = {name: 'some $scope object'};
    const $attrs = {name: 'some $attrs object'};
    const mockWrongPhoneType = 'some wrong phone type';

    beforeEach(() => {
        mockAttrService = jasmine.createSpyObj('attrsService', ['track']);
        sut = new EwfPhoneController($scope, $attrs, mockAttrService);

        sut.attributes.phone = sut.attributes.phone || {};
        sut.attributes.phone.phoneDetails = sut.attributes.phone.phoneDetails || {};
    });

    describe('initialization', () => {
        it('should create phoneTypes map', () => {
            expect(sut.phoneTypesMap).toEqual(jasmine.any(Object));
        });

        it('should track changes of "phone" attribute', () => {
           expect(mockAttrService.track).toHaveBeenCalledWith(
               $scope, $attrs, 'phone', sut.attributes, jasmine.any(Function)
           );
        });

        describe('when "phone" attribute changed', () => {
            let onChangeHandler;

            beforeEach(() => {
                onChangeHandler = mockAttrService.track.calls.mostRecent().args[4];
            });

            it('should create phoneDetails object and set phoneDetails.phoneType to Other if no phoneDetails', () => {
                let phone = {};
                onChangeHandler(phone);
                expect(phone.phoneDetails).toBeDefined();
                expect(phone.phoneDetails.phoneType).toBe(sut.phoneTypesMap.OTHER);
            });

            it('should set phoneDetails.phoneType to Other if none other set', () => {
                let phone = {
                    phoneDetails: {}
                };
                onChangeHandler(phone);
                expect(phone.phoneDetails.phoneType).toBe(sut.phoneTypesMap.OTHER);
            });

            it('should not override phoneDetails.phoneType if it is already set', () => {
                let phone = {
                    phoneDetails: {
                        phoneType: sut.phoneTypesMap.MOBILE
                    }
                };
                onChangeHandler(phone);
                expect(phone.phoneDetails.phoneType).toBe(sut.phoneTypesMap.MOBILE);
            });

        });
    });

    describe('#isOfficePhone', () => {
        it('should return true if stored phone type is "office" type', () => {
            sut.attributes.phone.phoneDetails.phoneType = sut.phoneTypesMap.OFFICE;

            expect(sut.isOfficePhone()).toEqual(true);
        });

        it('should return false if stored phone type is not "office" type', () => {
            sut.attributes.phone.phoneDetails.phoneType = mockWrongPhoneType;

            expect(sut.isOfficePhone()).toEqual(false);
        });
    });

    describe('#isMobilePhone', () => {
        it('should return true if stored phone type is "mobile" type', () => {
            sut.attributes.phone.phoneDetails.phoneType = sut.phoneTypesMap.MOBILE;

            expect(sut.isMobilePhone()).toEqual(true);
        });

        it('should return false if stored phone type is not "mobile" type', () => {
            sut.attributes.phone.phoneDetails.phoneType = mockWrongPhoneType;

            expect(sut.isMobilePhone()).toEqual(false);
        });
    });
});
