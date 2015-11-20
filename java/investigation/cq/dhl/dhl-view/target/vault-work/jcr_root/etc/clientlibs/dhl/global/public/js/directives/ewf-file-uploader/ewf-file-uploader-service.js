define(['exports', 'module', 'ewf', 'angular'], function (exports, module, _ewf, _angular) {
    'use strict';

    module.exports = EwfFileUploaderService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _angular2 = _interopRequireDefault(_angular);

    _ewf2['default'].service('ewfFileUploaderService', EwfFileUploaderService);

    EwfFileUploaderService.$inject = ['$q', '$window', '$timeout', 'logService'];

    function EwfFileUploaderService($q, $window, $timeout, logService) {
        var serviceApi = {
            uploadFiles: uploadFiles,
            uploadAvailable: uploadAvailable,
            submitForm: submitForm
        };

        var somePartUploadedPercent = 37;
        var fullUploadedPercent = 100;
        var httpOkStatus = 200;
        var knownHttpStatuses = {
            413: {
                errors: ['errors.file_size_limit_exceeded']
            }
        };

        function uploadFiles(files, url, paramsString) {
            var uploadDeferred = $q.defer();
            var formData = new $window.FormData();

            files.forEach(function (eachFileItem, index) {
                formData.append('file' + index, eachFileItem);
            });

            var request = getXmlHttpRequest();
            request.open('POST', '' + url + paramsString);
            request.onerror = function (error) {
                return uploadDeferred.reject(error);
            };

            request.upload.addEventListener('uploadProgress', function (event) {
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total * 100;
                    uploadDeferred.notify(percentComplete.toFixed());
                }
            }, true);

            request.onload = function (event) {
                var target = event.target;
                var response = parseResponse(target.response);

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
            var result = response;
            try {
                result = _angular2['default'].fromJson(result);
            } catch (error) {
                result = {
                    errors: [result.toString()]
                };
            }
            return result;
        }

        function getXmlHttpRequest() {
            var xhrRequest = undefined;

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
            var uploadDeferred = $q.defer();

            var frame = _angular2['default'].element(submitElements.frame);

            frame.on('load', frameOnLoadHandler);
            frame.on('error', function (error) {
                return uploadDeferred.reject(error);
            });

            submitElements.form.submit();

            $timeout(function () {
                uploadDeferred.notify(somePartUploadedPercent);
            }, 0);

            return uploadDeferred.promise;

            function frameOnLoadHandler() {
                var response = extractResponseFromFrame(this);
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
                if (frame.contentDocument && frame.contentDocument.body && frame.contentDocument.body.innerHTML === 'false') {
                    return null;
                }
            } catch (error) {
                //IE may throw an "access is denied" error when attempting to access contentDocument
                return null;
            }
            var frameDocument = frame.contentDocument || frame.contentWindow.document;
            var extractResponse = function extractResponse(htmBodyText) {
                var bodyData = /(\{.*})/.exec(htmBodyText);
                return bodyData && bodyData[0] || null;
            };
            var jsonText = frameDocument.body.textContent || extractResponse(frameDocument.body.innerHTML);
            return _angular2['default'].fromJson(jsonText);
        }

        return serviceApi;
    }
});
//# sourceMappingURL=ewf-file-uploader-service.js.map
