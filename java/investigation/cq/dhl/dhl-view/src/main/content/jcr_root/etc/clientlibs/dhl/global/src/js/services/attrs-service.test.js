import attrsService from './attrs-service';
import 'angularMocks';

describe('attrsService', () => {
    let sut;
    let $parse, $scope, $attrs;

    beforeEach(inject(($rootScope, _$parse_) => {
        $scope = $rootScope.$new();
        $parse = _$parse_;
        $attrs = {};

        sut = new attrsService($parse);
    }));

    describe('#trigger', () => {
        beforeEach(() => {
            $scope.$eval = jasmine.createSpy('$eval');
        });

        it('should have "trigger" function', () => {
            expect(sut.trigger).toBeDefined();
        });

        it('should pass attributeName in attrs to the scope eval if it is defined', () => {
            $attrs['some-key'] = 'some-value';
            sut.trigger($scope, $attrs, 'some-key');

            expect($scope.$eval).toHaveBeenCalledWith('some-value');
        });

        it('should NOT pass attributeName in attrs to the scope eval if it NOT is defined', () => {
            $attrs['some-key'] = 'some-value';
            sut.trigger($scope, $attrs, 'other-key');

            expect($scope.$eval).not.toHaveBeenCalled();
        });

        it('should apply keys from onTrigger to the scope if the object passed', () => {
            const attributeName = 'some-attr';
            $attrs[attributeName] = true;
            const onTrigger = {test: 11};
            sut.trigger($scope, $attrs, attributeName, onTrigger);

            expect($scope.test).toEqual(11);
        });

        it('should not throw an error if empty object passed', () => {
            const attributeName = 'some-attr';
            $attrs[attributeName] = true;
            const onTrigger = {};
            const trigger = () => sut.trigger($scope, $attrs, attributeName, onTrigger);

            expect(trigger).not.toThrow(new Error());
        });

        it('should throw an error if onTrigger have unexpected type', () => {
            const attributeName = 'some-attr';
            $attrs[attributeName] = true;
            const onTrigger = 'wrong type';
            const trigger = () => sut.trigger($scope, $attrs, attributeName, onTrigger);

            expect(trigger).toThrow(new Error('unexpected onTrigger value type'));
        });
    });

    describe('#track', () => {
        it('should have "track" function', () => {
            expect(sut.track).toBeDefined();
        });

        it('should call onChangeFn if it is passed', () => {
            $attrs['some-key'] = 'some-value';
            const attributeName = 'some-key';
            const onChangeFn = jasmine.createSpy('onChangeFn');
            sut.track($scope, $attrs, attributeName, {}, onChangeFn);

            expect(onChangeFn).toHaveBeenCalled();
        });

        it('should rename parameter attribute name', () => {
            const attributeName = 'somekey';
            const attributeValue = 'somevalue';
            const scoupValue = 'scopeValue';
            $attrs[attributeName] = attributeValue;
            const attributeAlias = 'otherkey';
            $scope[attributeValue] = scoupValue;
            const target = {};
            sut.track($scope, $attrs, attributeName, target, undefined, attributeAlias);

            expect(target.hasOwnProperty(attributeAlias)).toBe(true);
            expect(target[attributeAlias]).toBe(scoupValue);
        });
    });
});
