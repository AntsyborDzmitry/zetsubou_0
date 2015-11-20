import './esecure-service';

ESecureController.$inject = ['logService', 'eSecureService'];

export default function ESecureController(logService, eSecureService) {
    const vm = this;
    vm.eSecureToken = '';

    eSecureService.getToken()
        .then((response) => {
            vm.eSecureToken = response;
        })
        .catch((error) => {
            logService.warn('From eSecure controller ' + error);
        });
}
