import './proview-service';

ProviewController.$inject = ['logService', '$sce', 'proviewService'];

export default function ProviewController(logService, $sce, proviewService) {
    const vm = this;

    proviewService.getUrl()
        .then((response) => {
            vm.proviewAccessUrl = $sce.trustAsResourceUrl(response);
        })
        .catch((error) => {
            logService.warn('Error getting Proview url ' + error);
        });
}
