define(['exports', './ewf-click-directive', './ewf-click-controller', 'angularMocks'], function (exports, _ewfClickDirective, _ewfClickController, _angularMocks) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _EwfClick = _interopRequireDefault(_ewfClickDirective);

    var _EwfClickController = _interopRequireDefault(_ewfClickController);

    describe('ewfClick', function () {
        var sut = undefined;
        var ewfClickController = undefined;
        var $scope = undefined,
            elem = undefined,
            attrs = undefined,
            $q = undefined,
            $timeout = undefined;
        var queryProcessing = false;
        var defer = undefined;

        beforeEach(inject(function (_$rootScope_, _$q_, _$timeout_) {
            $scope = _$rootScope_.$new();
            elem = {};
            attrs = {};
            $q = _$q_;
            $timeout = _$timeout_;
            defer = $q.deffer;

            ewfClickController = jasmine.mockComponent(new _EwfClickController['default']());

            ewfClickController.handleClickFunction.and.returnValue(defer.promise);

            sut = new _EwfClick['default']($q, $timeout);
        }));

        function preLinkInit() {
            var ctrl = ewfClickController;
            sut.link.pre($scope, elem, attrs, ctrl);
        }

        describe('preLink function', function () {
            beforeEach(function () {
                preLinkInit();
            });

            it('should set queryProcessing to false on preLink function call', function () {
                expect(queryProcessing).toEqual(true);
            });

            it('should change state of button to active when query processed', function () {
                defer.resolve();
                $timeout.flush();
                expect(queryProcessing).toBe(false);
                expect(angular.element.removeClass).toHaveBeenCalled();
            });
        });
    });
});
//# sourceMappingURL=ewf-click-directive.tests.js.map
