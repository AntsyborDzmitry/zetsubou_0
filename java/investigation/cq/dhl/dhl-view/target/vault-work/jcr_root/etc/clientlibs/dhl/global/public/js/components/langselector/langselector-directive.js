define(['exports', 'ewf', './langselector-controller'], function (exports, _ewf, _langselectorController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _LanguageController = _interopRequireDefault(_langselectorController);

    _ewf2['default'].directive('ewfLangselector', function () {
        return {
            restrict: 'E',
            controller: _LanguageController['default'],
            controllerAs: 'langselector',
            template: '<div class=dropdown><select class=\"btn btn-default dropdown-toggle\" ng-options=\"lg.name for lg in langselector.availableLangs\" ng-model=langselector.currentLang ng-change=langselector.langChanged()></select></div>'
        };
    });
});
//# sourceMappingURL=langselector-directive.js.map
