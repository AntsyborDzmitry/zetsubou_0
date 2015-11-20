CKEDITOR.editorConfig = function (config) {
    config.height = 250;
    config.title = 'DHL Template Editor';
    config.toolbar = [
        {
            name: 'document',
            items: ['Source', 'NewPage', 'Preview', 'Print']
        },
        {
            name: 'clipboard',
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'Undo', 'Redo']
        },
        {
            name: 'editing',
            items: ['Find', 'Replace', 'SelectAll']
        },
        '/',
        {
            name: 'basicstyles',
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', 'RemoveFormat']
        },
        {
            name: 'insert',
            items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']
        },
        {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv',
                'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'BidiLtr', 'BidiRtl']
        },
        {
            name: 'links',
            items: ['Link', 'Unlink', 'Anchor']
        },
        '/',
        {
            name: 'styles',
            items: ['Styles', 'Format', 'Font', 'FontSize']
        },
        {
            name: 'colors',
            items: ['TextColor', 'BGColor']
        },
        {
            name: 'tools',
            items: ['ShowBlocks']
        }
    ];
    config.allowedContent = true;
    config.contentsCss = [CKEDITOR.getUrl('contents.css'), CKEDITOR.getUrl('ckeditor-contents.css')];
};
