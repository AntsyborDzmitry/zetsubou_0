define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ewfCrudService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('ewfCrudService', ewfCrudService);

    ewfCrudService.$inject = ['$http', '$q', 'logService'];

    function ewfCrudService($http, $q, logService) {
        Object.assign(this, {
            updateElement: updateElement,
            deleteElements: deleteElements,
            getElementDetails: getElementDetails,
            addElement: addElement,
            getElementList: getElementList,
            changeElement: changeElement,
            deleteElement: deleteElement
        });

        function deleteElements(elementKeys, url, paramName) {
            var elementKeysArr = Array.isArray(elementKeys) ? elementKeys : [elementKeys];

            var deleteRequest = {};
            deleteRequest[paramName] = elementKeysArr;

            return $http.post(url, deleteRequest).then(function (response) {
                logService.log('Deleted objects from ' + url + ' ', response);
                return response.data;
            })['catch'](function (response) {
                logService.error('delete objects failed from ' + url + ' ', response);
                return $q.reject(response.data);
            });
        }

        function getElementDetails(url, key) {
            var constructedUrl = key ? url + '/' + key : '' + url;
            return $http.get(constructedUrl, {
                params: { preventcache: new Date().getTime() }
            }).then(function (response) {
                logService.log('Got object from ' + url + ' ', response);
                return response.data;
            })['catch'](function (response) {
                logService.error('get objects failed from ' + url + ' ', response);
                return $q.reject(response.data);
            });
        }

        function getElementList(url) {
            return $http.get(url, {
                params: { preventcache: new Date().getTime() }
            }).then(function (response) {
                logService.log('Got objects from ' + url + ' ', response);
                return response.data;
            })['catch'](function (response) {
                logService.error('get list failed from ' + url + ' ', response);
                return $q.reject(response.data);
            });
        }

        function addElement(url, elementInfo) {
            return $http.post(url, elementInfo).then(function (response) {
                logService.log('Added objects to ' + url + ' ', response);
                return response.data;
            })['catch'](function (response) {
                logService.error('add objects failed from ' + url + ' ', response);
                return $q.reject(response);
            });
        }

        function updateElement(url, elementInfo) {
            return makeRequest('post', url, elementInfo);
        }

        function changeElement(url, elementInfo) {
            return makeRequest('put', url, elementInfo);
        }

        function deleteElement(url) {
            return makeRequest('delete', url);
        }

        function makeRequest(method, url, elementInfo) {
            return $http[method](url, elementInfo).then(function (response) {
                logService.log(method.toUpperCase() + ' request to ' + url, response);
                return response.data;
            })['catch'](function (response) {
                logService.error(method.toUpperCase() + ' request failed to ' + url, response);
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=ewf-crud-service.js.map
