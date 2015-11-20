import itemAttributesForm from './item-attributes-form-directive';
import ItemAttributesFormController from './item-attributes-form-controller';
import ItemAttributesController from './item-attributes-controller';
import 'angularMocks';

describe('itemAttributesForm', () => {
    let sut;
    let $scope, elem, attrs;
    let itemAttrFormCtrl, itemAttrCtrl;

    const itemAttributesModel = ['test'];

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        itemAttrFormCtrl = new ItemAttributesFormController();
        itemAttrCtrl = new ItemAttributesController();
        spyOn(itemAttrFormCtrl, 'init');
        itemAttrFormCtrl.itemAttributesModel = itemAttributesModel;

        sut = new itemAttributesForm();
    }));

    it('should define template', () => {
        expect(sut.template).toBeDefined();
    });

    describe('preLink', () => {
        const defaultArgs = [$scope, elem, attrs];

        it('should init item attributes form controller', () => {
            sut.link.pre(...defaultArgs, [itemAttrFormCtrl]);
            expect(itemAttrFormCtrl.init).toHaveBeenCalledWith();
        });

        it('should set itemAttrFormCtrl to itemAttrCtrl if it was passed', () => {
            sut.link.pre(...defaultArgs, [itemAttrFormCtrl, itemAttrCtrl]);
            expect(itemAttrCtrl.itemAttrFormCtrl).toEqual(itemAttrFormCtrl);
        });

        it('should not corrupt itemAttrFormCtrl in itemAttrCtrl if it was not passed', () => {
            const defaultItemAttrFormCtrl = 'test';
            itemAttrCtrl.itemAttrFormCtrl = defaultItemAttrFormCtrl;
            sut.link.pre(...defaultArgs, [itemAttrFormCtrl]);

            expect(itemAttrCtrl.itemAttrFormCtrl).toEqual(defaultItemAttrFormCtrl);
        });
    });
});
