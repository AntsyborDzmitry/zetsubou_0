define(['exports', 'module', 'ewf', 'angular', './ewf-file-uploader-service'], function (exports, module, _ewf, _angular, _ewfFileUploaderService) {
    'use strict';

    module.exports = EwfFileUploaderController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _angular2 = _interopRequireDefault(_angular);

    _ewf2['default'].controller('ewfFileUploaderController', EwfFileUploaderController);

    EwfFileUploaderController.$inject = ['$scope', '$attrs', 'attrsService', 'ewfFileUploaderService'];

    function EwfFileUploaderController($scope, $attrs, attrsService, ewfFileUploaderService) {
        var vm = this;
        var filesToUpload = [];
        var multiFileMode = $attrs.hasOwnProperty('multiFileMode');

        var submitElements = undefined;

        Object.assign(vm, {
            filesUploaded: false,
            uploadStarted: false,
            uploadProgress: 0,

            onFilesReadyToUpload: onFilesReadyToUpload,
            onFilesUploaded: onFilesUploaded,
            onProgress: onProgress,
            onUploadError: onUploadError,
            getFilesList: getFilesList,
            clearFilesList: clearFilesList,
            canShowFileList: canShowFileList,
            uploadFiles: uploadFiles,
            onFormReady: onFormReady
        });

        function onFilesReadyToUpload(filesList) {
            if (!multiFileMode) {
                filesToUpload.length = 0;
            }
            vm.filesUploaded = false;
            filesToUpload.push.apply(filesToUpload, _toConsumableArray(getFilesIterator(filesList)));
        }

        function onFormReady(preparedSubmitElements) {
            submitElements = preparedSubmitElements;
        }

        function onFilesUploaded(fileInfo) {
            vm.filesUploaded = true;
            vm.uploadStarted = false;
            onProgress(100);
            attrsService.trigger($scope, $attrs, 'filesUploaded', fileInfo);
        }

        function onProgress(percentComplete) {
            vm.uploadProgress = percentComplete;
        }

        function getFilesList() {
            return filesToUpload;
        }

        function clearFilesList() {
            filesToUpload.length = 0;
            vm.filesUploaded = false;
        }

        function canShowFileList() {
            return getFilesList().length > 0 && !vm.filesUploaded;
        }

        function uploadFiles() {
            vm.filesUploaded = false;
            vm.uploadStarted = true;
            var uploadPromise = ewfFileUploaderService.uploadAvailable() ? ewfFileUploaderService.uploadFiles(filesToUpload, submitElements.url, submitElements.urlParameters) : ewfFileUploaderService.submitForm(submitElements);

            uploadPromise.then(onFilesUploaded, onUploadError, onProgress);
        }

        function onUploadError(response) {
            var errorObject = mapResponseErrors(response);

            vm.filesUploaded = false;
            vm.uploadStarted = false;
            attrsService.trigger($scope, $attrs, 'filesUploadError', errorObject);
        }

        function mapResponseErrors(response) {
            var errors = response && response.errors || [];
            var fieldErrors = response && response.fieldErrors;
            if (fieldErrors) {
                Object.keys(fieldErrors).forEach(function (eachErrorField) {
                    errors.push.apply(errors, _toConsumableArray(fieldErrors[eachErrorField]));
                });
            }
            return {
                errors: errors,
                fieldErrors: fieldErrors
            };
        }

        function getFilesIterator(fileObject) {
            var marked2$0 = [singFileIterator, singleFileModeIterator, filesObjectIterator].map(regeneratorRuntime.mark);

            if (_angular2['default'].isString(fileObject)) {
                return singFileIterator();
            }
            if (!multiFileMode) {
                return singleFileModeIterator();
            }
            return filesObjectIterator();

            function singFileIterator() {
                return regeneratorRuntime.wrap(function singFileIterator$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            context$3$0.next = 2;
                            return {
                                name: fileObject.replace(/^.*[\\\/]/, '')
                            };

                        case 2:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, marked2$0[0], this);
            }

            function singleFileModeIterator() {
                return regeneratorRuntime.wrap(function singleFileModeIterator$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            context$3$0.next = 2;
                            return fileObject[0];

                        case 2:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, marked2$0[1], this);
            }

            function filesObjectIterator() {
                var i;
                return regeneratorRuntime.wrap(function filesObjectIterator$(context$3$0) {
                    while (1) switch (context$3$0.prev = context$3$0.next) {
                        case 0:
                            i = 0;

                        case 1:
                            if (!(i < fileObject.length)) {
                                context$3$0.next = 7;
                                break;
                            }

                            context$3$0.next = 4;
                            return fileObject[i];

                        case 4:
                            i++;
                            context$3$0.next = 1;
                            break;

                        case 7:
                        case 'end':
                            return context$3$0.stop();
                    }
                }, marked2$0[2], this);
            }
        }
    }
});
//# sourceMappingURL=ewf-file-uploader-controller.js.map
