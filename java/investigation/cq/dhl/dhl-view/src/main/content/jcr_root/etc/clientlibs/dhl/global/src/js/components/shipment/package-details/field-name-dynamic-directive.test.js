import fieldNameDynamic from './field-name-dynamic-directive';
import 'angularMocks';

describe('fieldNameDynamic', () => {
    let sut;
    let scope, elem, controllers, modelCtrl;
    const attrs = {fieldNameDynamic: 1};

    function callPostLink() {
        sut.link.post(scope, elem, attrs, controllers);
    }

    beforeEach(() => {
        scope = {$index: '1'};
        elem = [{name: 'field'}];
        modelCtrl = {$name: ''};
        controllers = [modelCtrl, {}];

        sut = new fieldNameDynamic();
    });

    describe('#link', () => {
        it('should replace $index with actual index value', () => {
            callPostLink();

            expect(modelCtrl.$name).toEqual('field1');
        });
    });
});
