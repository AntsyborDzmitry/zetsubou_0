/*global window*/
/*eslint-disable angular/ng_window_service */

(function() {
    const components = [];
    const angularModules = {
        LocalStorageModule: true,
        ngCookies: true,
        ngDialog: true,
        modelOptions: true,
        'ui.bootstrap': true,
        'ui.mask': true,
        ngCkeditor: true
    };

    window.dhl = {

        /**
         * @param {String} requirejs file path
         */
        registerComponent: function(path) {
            components.push(path);
        },

        getComponents: function() {
            return components;
        },

        needAngularModule: function(moduleName) {
            angularModules[moduleName] = true;
        },

        getAngularModules: function() {
            return Object.keys(angularModules);
        }
    };
}());
