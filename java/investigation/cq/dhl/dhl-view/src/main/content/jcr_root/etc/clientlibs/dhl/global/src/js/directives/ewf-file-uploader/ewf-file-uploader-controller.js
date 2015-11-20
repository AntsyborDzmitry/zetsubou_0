import ewf from 'ewf';
import angular from 'angular';
import './ewf-file-uploader-service';

ewf.controller('ewfFileUploaderController', EwfFileUploaderController);

EwfFileUploaderController.$inject = ['$scope', '$attrs', 'attrsService', 'ewfFileUploaderService'];

export default function EwfFileUploaderController($scope, $attrs, attrsService, ewfFileUploaderService) {
    const vm = this;
    const filesToUpload = [];
    const multiFileMode = $attrs.hasOwnProperty('multiFileMode');

    let submitElements;

    Object.assign(vm, {
        filesUploaded: false,
        uploadStarted: false,
        uploadProgress: 0,

        onFilesReadyToUpload,
        onFilesUploaded,
        onProgress,
        onUploadError,
        getFilesList,
        clearFilesList,
        canShowFileList,
        uploadFiles,
        onFormReady
    });

    function onFilesReadyToUpload(filesList) {
        if (!multiFileMode) {
            filesToUpload.length = 0;
        }
        vm.filesUploaded = false;
        filesToUpload.push(...getFilesIterator(filesList));
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
        const uploadPromise = ewfFileUploaderService.uploadAvailable()
            ? ewfFileUploaderService.uploadFiles(filesToUpload, submitElements.url, submitElements.urlParameters)
            : ewfFileUploaderService.submitForm(submitElements);

        uploadPromise.then(onFilesUploaded, onUploadError, onProgress);
    }

    function onUploadError(response) {
        const errorObject = mapResponseErrors(response);

        vm.filesUploaded = false;
        vm.uploadStarted = false;
        attrsService.trigger($scope, $attrs, 'filesUploadError', errorObject);
    }

    function mapResponseErrors(response) {
        const errors = response && response.errors || [];
        const fieldErrors = response && response.fieldErrors;
        if (fieldErrors) {
            Object.keys(fieldErrors).forEach((eachErrorField) => {
                errors.push(...fieldErrors[eachErrorField]);
            });
        }
        return {
            errors,
            fieldErrors
        };
    }

    function getFilesIterator(fileObject) {
        if (angular.isString(fileObject)) {
            return singFileIterator();
        }
        if (!multiFileMode) {
            return singleFileModeIterator();
        }
        return filesObjectIterator();

        function* singFileIterator() {
            yield {
                name: fileObject.replace(/^.*[\\\/]/, '')
            };
        }

        function* singleFileModeIterator() {
            yield fileObject[0];
        }

        function* filesObjectIterator() {
            for (let i = 0; i < fileObject.length; i++) {
                yield fileObject[i];
            }
        }

    }
}
