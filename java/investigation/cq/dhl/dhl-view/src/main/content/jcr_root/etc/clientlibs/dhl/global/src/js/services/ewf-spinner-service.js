import ewf from 'ewf';

ewf.service('ewfSpinnerService', EwfSpinnerService);

EwfSpinnerService.$inject = [
    '$q',
    '$timeout'
];

export default function EwfSpinnerService(
    $q,
    $timeout) {

    let showSpinner = true;

    const publicAPI = {
        applySpinner,
        isSpinnerActive
    };

    const delayTime = 300;

    function applySpinner(externalPromise) {
        showSpinner = true;

        let promise = externalPromise || $q.when('spinner timeout');

        return promise.finally(() => {
            $timeout(() => {
               showSpinner = false;
            }, delayTime);
        });
    }

    function isSpinnerActive() {
        return showSpinner;
    }

    return publicAPI;
}
