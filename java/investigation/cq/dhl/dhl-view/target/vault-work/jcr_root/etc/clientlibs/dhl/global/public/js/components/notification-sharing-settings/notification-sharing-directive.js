define(['exports', 'module', 'ewf', './notification-sharing-controller'], function (exports, module, _ewf, _notificationSharingController) {
    'use strict';

    module.exports = NotificationSharing;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _NotificationSharingController = _interopRequireDefault(_notificationSharingController);

    _ewf2['default'].directive('notificationSharing', NotificationSharing);

    NotificationSharing.$inject = ['$window'];

    function NotificationSharing($window) {
        var HTMLParserFilter = $window.CKEDITOR.htmlParser.filter;
        var HTMLParserText = $window.CKEDITOR.htmlParser.text;
        var HTMLWriter = $window.CKEDITOR.htmlWriter;
        var htmlParserFilter = new HTMLParserFilter({
            elements: {
                input: function input(element) {
                    var key = element.attributes['dhl-tpl-key'];

                    if (key) {
                        element.replaceWith(new HTMLParserText(key));
                    }
                }
            }
        });
        var htmlWriter = new HTMLWriter();
        var nativeReplace = $window.CKEDITOR.replace;

        return {
            restrict: 'E',
            controller: _NotificationSharingController['default'],
            controllerAs: 'notificationSharingCtrl',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            Object.assign(scope, {
                ckEditorInsertTag: ckEditorInsertTag,
                ckEditorHTMLToTpl: ckEditorHTMLToTpl,
                ckEditorTplToHTML: ckEditorTplToHTML
            });

            $window.CKEDITOR.replace = function replaceWrapper(element) {
                return nativeReplace.call($window.CKEDITOR, element, {
                    customConfig: 'ckeditor-config.js',
                    on: {
                        instanceReady: onInstanceReady,
                        dataReady: onDataReady
                    }
                });
            };

            controller.init();
        }

        function getTagTemplate(key, name) {
            return '<input dhl-tpl-key="' + key + '" type="button" value="[[' + name + ']]" />';
        }

        function ckEditorInsertTag(tag) {
            var html = getTagTemplate(tag.key, tag.name);
            var node = $window.CKEDITOR.dom.element.createFromHtml(html);

            $window.CKEDITOR.instances.dhlTxtEditor.insertElement(node);
        }

        function elementCleanUp(context) {
            context.removeAttribute('data-cke-editable');
            context.removeAttribute('contenteditable');
        }

        function onBeforeInsertElement(eventInfo) {
            eventInfo.editor.focus();
        }

        function onAfterInsertElement(eventInfo) {
            elementCleanUp(eventInfo.data);
        }

        function onInstanceReady(eventInfo) {
            var HIGH_PRIORITY = 9;
            var LOW_PRIORITY = 11;
            var editor = eventInfo.editor;

            editor.on('insertElement', onBeforeInsertElement, null, null, HIGH_PRIORITY);
            editor.on('insertElement', onAfterInsertElement, null, null, LOW_PRIORITY);
        }

        function onDataReady(eventInfo) {
            var editor = eventInfo.editor;

            if (editor.document) {
                [].concat(_toConsumableArray(editor.document.find('[dhl-tpl-key]').$)).forEach(elementCleanUp);
            }
        }

        function ckEditorHTMLToTpl(html) {
            if (!html) {
                return '';
            }

            var fragment = $window.CKEDITOR.htmlParser.fragment.fromHtml(html);

            fragment.writeHtml(htmlWriter, htmlParserFilter);

            return htmlWriter.getHtml();
        }

        function ckEditorTplToHTML(tpl, tags) {
            if (!tpl) {
                return '';
            }

            return tpl.replace(/(\$\{[a-z_$][\w$]*\})/g, function (match) {
                var tag = tags.find(function (item) {
                    return item.key === match;
                });
                var name = tag ? tag.name : match;

                return getTagTemplate(match, name);
            });
        }
    }
});
//# sourceMappingURL=notification-sharing-directive.js.map
