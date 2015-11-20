define(['exports', 'ewf'], function (exports, _ewf) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    EwfClick.$inject = ['$q', '$timeout'];
    _ewf2['default'].directive('ewfClick', EwfClick);

    function EwfClick($q, $timeout) {
        return {
            restrict: 'A',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs) {
            var queryProcessing = false;
            elem.bind('click', function () {
                if (!queryProcessing) {
                    queryProcessing = true;
                    elem.addClass('disabled');
                    var definitionOfDone = scope.$eval(attrs.ewfClick);

                    $q.when(definitionOfDone)['finally'](function () {
                        $timeout(function () {
                            elem.removeClass('disabled');
                            queryProcessing = false;
                        }, 500);
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=ewf-click-directive.js.map
