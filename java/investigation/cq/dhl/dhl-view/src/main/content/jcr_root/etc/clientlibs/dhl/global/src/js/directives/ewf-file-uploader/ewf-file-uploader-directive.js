import ewf from 'ewf';
import EwfFileUploaderController from './ewf-file-uploader-controller';
import angular from 'angular';

ewf.directive('ewfFileUploader', EwfFileUploader);

EwfFileUploader.$inject = ['$window', 'attrsService'];

export default function EwfFileUploader($window, attrsService) {
    return {
        restrict: 'EA',
        controller: EwfFileUploaderController,
        controllerAs: 'fileUploaderCtrl',
        scope: true,
        link: {
            post: postLink
        }
    };

    function postLink(scope, element, attributes, fileUploaderCtrl) {
        const selectFileInput = element.find('input');

        attributes.$observe('action', () => {
            fileUploaderCtrl.onFormReady(getPreparedSubmitElements(element));
        });

        selectFileInput.on('click', (event) => {
            const fileInput = event.target;
            if (fileInput.type === 'file') {
                fileInput.value = '';
                attrsService.trigger(scope, attributes, 'filesBeforeSelect');
            }
        });

        selectFileInput.on('change', (event) => {
            const fileInput = event.target;
            if (fileInput.type === 'file') {
                scope.$apply(() => {
                    fileUploaderCtrl.onFilesReadyToUpload(fileInput.files || fileInput.value);
                });
            }
        });
    }

    function getPreparedSubmitElements(element) {
        const form = element.parents('form')[0];
        const frame = createFrame();
        const formAction = form.getAttribute('action');
        const url = /(^.*\??)/.exec(formAction)[0];
        const urlParameters = /(\?.*$)/.exec(formAction);
        form.setAttribute('target', frame.id);
        return {
            form,
            frame,
            url,
            urlParameters: urlParameters ? urlParameters[0] : ''
        };
    }

    function createFrame() {
        const frameName = Math.floor(Math.random() * 99999);
        const documentObject = $window.document;
        const frame = angular.element('<iframe></iframe>')[0];
        const frameNamePrefix = 'file_uploader_frame_';

        frame.setAttribute('id', `${frameNamePrefix}${frameName}`);
        frame.setAttribute('name', `${frameNamePrefix}${frameName}`);
        frame.style.display = 'none';
        documentObject.body.appendChild(frame);
        return frame;
    }
}
