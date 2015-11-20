import ewf from 'ewf';

ewf.service('ewfCrudService', ewfCrudService);

ewfCrudService.$inject = ['$http', '$q', 'logService'];

export default function ewfCrudService($http, $q, logService) {
    Object.assign(this, {
        updateElement,
        deleteElements,
        getElementDetails,
        addElement,
        getElementList,
        changeElement,
        deleteElement
    });

    function deleteElements(elementKeys, url, paramName) {
        const elementKeysArr = Array.isArray(elementKeys)
            ? elementKeys
            : [elementKeys];

        const deleteRequest = {};
        deleteRequest[paramName] = elementKeysArr;

        return $http.post(url, deleteRequest)
            .then((response) => {
                logService.log(`Deleted objects from ${url} `, response);
                return response.data;
            })
            .catch((response) => {
                logService.error(`delete objects failed from ${url} `, response);
                return $q.reject(response.data);
            });
    }

    function getElementDetails(url, key) {
        const constructedUrl = key ? `${url}/${key}` : `${url}`;
        return $http.get(constructedUrl, {
            params: {preventcache: new Date().getTime()}
        })
            .then((response) => {
                logService.log(`Got object from ${url} `, response);
                return response.data;
            })
            .catch((response) => {
                logService.error(`get objects failed from ${url} `, response);
                return $q.reject(response.data);
            });
    }

    function getElementList(url) {
        return $http.get(url, {
            params: {preventcache: new Date().getTime()}
        })
            .then((response) => {
                logService.log(`Got objects from ${url} `, response);
                return response.data;
            })
            .catch((response) => {
                logService.error(`get list failed from ${url} `, response);
                return $q.reject(response.data);
            });
    }

    function addElement(url, elementInfo) {
        return $http.post(url, elementInfo)
            .then((response) => {
                logService.log(`Added objects to ${url} `, response);
                return response.data;
            })
            .catch((response) => {
                logService.error(`add objects failed from ${url} `, response);
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
        return $http[method](url, elementInfo)
            .then((response) => {
                logService.log(`${method.toUpperCase()} request to ${url}`, response);
                return response.data;
            })
            .catch((response) => {
                logService.error(`${method.toUpperCase()} request failed to ${url}`, response);
                return $q.reject(response.data);
            });
    }


}
