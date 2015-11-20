import ewf from 'ewf';
import angular from 'angular';

ewf.service('ewfFileUploaderService', EwfFileUploaderService);

EwfFileUploaderService.$inject = ['$q', '$window', '$timeout', 'logService'];

export default function EwfFileUploaderService($q, $window, $timeout, logService) {
    const serviceApi = {
        uploadFiles,
        uploadAvailable,
        submitForm
    };

    const somePartUploadedPercent = 37;
    const fullUploadedPercent = 100;
    const httpOkStatus = 200;
    const knownHttpStatuses = {
        413: {
            errors: ['errors.file_size_limit_exceeded']
        }
    };

    function uploadFiles(files, url, paramsString) {
        const uploadDeferred = $q.defer();
        const formData = new $window.FormData();

        files.forEach((eachFileItem, index) => {
            formData.append(`file${index}`, eachFileItem);
        });

        const request = getXmlHttpRequest();
        request.open('POST', `${url}${paramsString}`);
        request.onerror = (error) => uploadDeferred.reject(error);

        request.upload.addEventListener('uploadProgress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = event.loaded / event.total * 100;
                uploadDeferred.notify(percentComplete.toFixed());
            }
        }, true);

        request.onload = (event) => {
            const target = event.target;
            const response = parseResponse(target.response);

            if (target.status === httpOkStatus) {
                uploadDeferred.notify(fullUploadedPercent);
                return uploadDeferred.resolve(response);
            }
            logService.error(response);
            return uploadDeferred.reject(knownHttpStatuses[target.status] || response);
        };

        request.send(formData);
        return uploadDeferred.promise;
    }

    function parseResponse(response) {
        let result = response;
        try {
            result = angular.fromJson(result);
        } catch (error) {
            result = {
                errors: [result.toString()]
            };
        }
        return result;
    }

    function getXmlHttpRequest() {
        let xhrRequest;

        if ($window.XMLHttpRequest) {
            xhrRequest = new $window.XMLHttpRequest();
        } else if ($window.ActiveXObject) {
            try {
                xhrRequest = new $window.ActiveXObject('MSXML2.XMLHttp.3.0');
            } catch (error) {
                xhrRequest = new $window.ActiveXObject('Microsoft.XMLHTTP');
            }
        }

        return xhrRequest;
    }

    function uploadAvailable() {
        return !!$window.FormData;
    }

    function submitForm(submitElements) {
        const uploadDeferred = $q.defer();

        const frame = angular.element(submitElements.frame);

        frame.on('load', frameOnLoadHandler);
        frame.on('error', (error) => uploadDeferred.reject(error));

        submitElements.form.submit();

        $timeout(() => {
            uploadDeferred.notify(somePartUploadedPercent);
        }, 0);

        return uploadDeferred.promise;

        function frameOnLoadHandler() {
            const response = extractResponseFromFrame(this);
            if (!response) {
                return;
            }
            uploadDeferred.notify(fullUploadedPercent);

            if (response.hasOwnProperty('errors')) {
                uploadDeferred.reject(response);
                return;
            }
            uploadDeferred.resolve(response);
        }
    }

    function extractResponseFromFrame(frame) {
        try {
            // fixing Opera 10.53
            if (frame.contentDocument &&
                frame.contentDocument.body &&
                frame.contentDocument.body.innerHTML === 'false') {
                return null;
            }
        } catch (error) {
            //IE may throw an "access is denied" error when attempting to access contentDocument
            return null;
        }
        const frameDocument = frame.contentDocument || frame.contentWindow.document;
        const extractResponse = (htmBodyText) => {
            const bodyData = /(\{.*})/.exec(htmBodyText);
            return bodyData && bodyData[0] || null;
        };
        const jsonText = frameDocument.body.textContent || extractResponse(frameDocument.body.innerHTML);
        return angular.fromJson(jsonText);
    }

    return serviceApi;
}
