import ewf from 'ewf';

ewf.service('shipmentErrorService', shipmentErrorService);

shipmentErrorService.$inject = ['$q'];

export default function shipmentErrorService($q) {

    this.processErrorCode = (response) => {
        let errCode;
        if (response.data && response.data.errors) {
            errCode = response.data.errors[0];
        } else {
            errCode = 'common.service_currently_unavailable';
        }
        return $q.reject(errCode);
    };
}
