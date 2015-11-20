import ewf from 'ewf';

EwfClick.$inject = ['$q', '$timeout'];
ewf.directive('ewfClick', EwfClick);

function EwfClick($q, $timeout) {
    return {
        restrict: 'A',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs) {
        let queryProcessing = false;
        elem.bind('click', () => {
            if (!queryProcessing) {
                queryProcessing = true;
                elem.addClass('disabled');
                const definitionOfDone = scope.$eval(attrs.ewfClick);

                $q.when(definitionOfDone).finally(() => {
                    $timeout(() => {
                        elem.removeClass('disabled');
                        queryProcessing = false;
                    }, 500);
                });
            }
        });
    }
}
