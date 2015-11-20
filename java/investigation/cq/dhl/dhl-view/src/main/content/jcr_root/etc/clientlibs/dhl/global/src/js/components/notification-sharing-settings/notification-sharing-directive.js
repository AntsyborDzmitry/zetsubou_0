import ewf from 'ewf';
import NotificationSharingController from './notification-sharing-controller';

ewf.directive('notificationSharing', NotificationSharing);

NotificationSharing.$inject = ['$window'];

export default function NotificationSharing($window) {
    const HTMLParserFilter = $window.CKEDITOR.htmlParser.filter;
    const HTMLParserText = $window.CKEDITOR.htmlParser.text;
    const HTMLWriter = $window.CKEDITOR.htmlWriter;
    const htmlParserFilter = new HTMLParserFilter({
        elements: {
            input: function(element) {
                const key = element.attributes['dhl-tpl-key'];

                if (key) {
                    element.replaceWith(new HTMLParserText(key));
                }
            }
        }
    });
    const htmlWriter = new HTMLWriter();
    const nativeReplace = $window.CKEDITOR.replace;

    return {
        restrict: 'E',
        controller: NotificationSharingController,
        controllerAs: 'notificationSharingCtrl',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        Object.assign(scope, {
            ckEditorInsertTag,
            ckEditorHTMLToTpl,
            ckEditorTplToHTML
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
        return `<input dhl-tpl-key="${key}" type="button" value="[[${name}]]" />`;
    }

    function ckEditorInsertTag(tag) {
        const html = getTagTemplate(tag.key, tag.name);
        const node = $window.CKEDITOR.dom.element.createFromHtml(html);

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
        const HIGH_PRIORITY = 9;
        const LOW_PRIORITY = 11;
        const editor = eventInfo.editor;

        editor.on('insertElement', onBeforeInsertElement, null, null, HIGH_PRIORITY);
        editor.on('insertElement', onAfterInsertElement, null, null, LOW_PRIORITY);
    }

    function onDataReady(eventInfo) {
        const editor = eventInfo.editor;

        if (editor.document) {
            [...editor.document.find('[dhl-tpl-key]').$].forEach(elementCleanUp);
        }
    }

    function ckEditorHTMLToTpl(html) {
        if (!html) {
            return '';
        }

        const fragment = $window.CKEDITOR.htmlParser.fragment.fromHtml(html);

        fragment.writeHtml(htmlWriter, htmlParserFilter);

        return htmlWriter.getHtml();
    }

    function ckEditorTplToHTML(tpl, tags) {
        if (!tpl) {
            return '';
        }

        return tpl.replace(/(\$\{[a-z_$][\w$]*\})/g, (match) => {
            const tag = tags.find((item) => item.key === match);
            const name = tag ? tag.name : match;

            return getTagTemplate(match, name);
        });
    }
}
