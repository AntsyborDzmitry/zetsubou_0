/*eslint-disable */
'use strict';

(function (jasmine) {
    /**
     * Replaces all component methods with Jasmine's stubs
     *
     * @example var componentMock = jasmine.mockComponent(new ComponentConstructor())
     *
     * @param {object} component - Instance of a component
     * @returns {object}
     */
    jasmine.mockComponent = function (component) {
        if (typeof component !== 'object') {
            throw new Error('jasmine#mockComponent: type of component should be an object!');
        }
        getAllPropertyNames(component).filter(function (prop) {
            return typeof component[prop] === 'function' && prop !== 'constructor';
        }).forEach(function (method) {
            component[method] = spyOn(component, method);
        });
        return component;
    };

    function getAllPropertyNames(obj) {
        var props = [];

        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));

        return props;
    }
})(window.jasmine);
/**
 * Jasmine helper for mocking instance of a component object.
 *
 * @requires jasmine-core
 */