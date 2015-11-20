define(['exports', 'module', 'ewf', './ewf-file-uploader-controller', 'angular'], function (exports, module, _ewf, _ewfFileUploaderController, _angular) {
    'use strict';

    module.exports = EwfFileUploader;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfFileUploaderController = _interopRequireDefault(_ewfFileUploaderController);

    var _angular2 = _interopRequireDefault(_angular);

    _ewf2['default'].directive('ewfFileUploader', EwfFileUploader);

    EwfFileUploader.$inject = ['$window', 'attrsService'];

    function EwfFileUploader($window, attrsService) {
        return {
            restrict: 'EA',
            controller: _EwfFileUploaderController['default'],
            controllerAs: 'fileUploaderCtrl',
            scope: true,
            link: {
                post: postLink
            }
        };

        function postLink(scope, element, attributes, fileUploaderCtrl) {
            var selectFileInput = element.find('input');

            attributes.$observe('action', function () {
                fileUploaderCtrl.onFormReady(getPreparedSubmitElements(element));
            });

            selectFileInput.on('click', function (event) {
                var fileInput = event.target;
                if (fileInput.type === 'file') {
                    fileInput.value = '';
                    attrsService.trigger(scope, attributes, 'filesBeforeSelect');
                }
            });

            selectFileInput.on('change', function (event) {
                var fileInput = event.target;
                if (fileInput.type === 'file') {
                    scope.$apply(function () {
                        fileUploaderCtrl.onFilesReadyToUpload(fileInput.files || fileInput.value);
                    });
                }
            });
        }

        function getPreparedSubmitElements(element) {
            var form = element.parents('form')[0];
            var frame = createFrame();
            var formAction = form.getAttribute('action');
            var url = /(^.*\??)/.exec(formAction)[0];
            var urlParameters = /(\?.*$)/.exec(formAction);
            form.setAttribute('target', frame.id);
            return {
                form: form,
                frame: frame,
                url: url,
                urlParameters: urlParameters ? urlParameters[0] : ''
            };
        }

        function createFrame() {
            var frameName = Math.floor(Math.random() * 99999);
            var documentObject = $window.document;
            var frame = _angular2['default'].element('<iframe></iframe>')[0];
            var frameNamePrefix = 'file_uploader_frame_';

            frame.setAttribute('id', '' + frameNamePrefix + frameName);
            frame.setAttribute('name', '' + frameNamePrefix + frameName);
            frame.style.display = 'none';
            documentObject.body.appendChild(frame);
            return frame;
        }
    }
});
//# sourceMappingURL=ewf-file-uploader-directive.js.map
