/*global window*/
/*eslint-disable angular/ng_window_service */

'use strict';

(function () {
    var components = [];
    var angularModules = {
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
        registerComponent: function registerComponent(path) {
            components.push(path);
        },

        getComponents: function getComponents() {
            return components;
        },

        needAngularModule: function needAngularModule(moduleName) {
            angularModules[moduleName] = true;
        },

        getAngularModules: function getAngularModules() {
            return Object.keys(angularModules);
        }
    };
})();