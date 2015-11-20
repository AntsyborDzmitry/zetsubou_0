import ContactShippingInfoController from './contact-shipping-info-controller';
import 'angularMocks';

describe('ContactShippingInfoController', () => {
    let sut;
    let $scope;

    const mockAttrService = {
        track: () => {}
    };

    const references = {
        shipping:
            {
                referencesForShipments: [
                    {
                        referenceName: 'CONTACT Shipping Reference 0',
                        referenceType: 'DEFAULT'
                    },
                    {
                        referenceName: 'CONTACT Shipping Reference 1',
                        referenceType: 'OPTIONAL'
                    }
                ]
            }
    };

    beforeEach(() => {
         sut = new ContactShippingInfoController($scope, {}, mockAttrService);
         sut.attributes = references;
    });

    describe('#should init controller', () => {
        it('should init controller', () => {
            expect(sut.attributes.shipping.referencesForShipments.length).toEqual(2);
        });
    });

    describe('should check references array modification', () => {
        it('add new reference element', () => {
            sut.addAnotherReference();
            expect(sut.attributes.shipping.referencesForShipments.length).toEqual(3);
        });

        it('remove reference element', () => {
            expect(sut.attributes.shipping.referencesForShipments.length).toEqual(3);
            sut.removeReference(sut.attributes.shipping.referencesForShipments[0]);
        });

        it('element should be removed', () => {
            expect(sut.attributes.shipping.referencesForShipments.length).toEqual(2);
        });
    });

    describe('#toggleLayout', () => {
        it('should init to false', () => {
            expect(sut.isEditing).toBe(false);
        });

        it('should invert value', () => {
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });
    });
});
