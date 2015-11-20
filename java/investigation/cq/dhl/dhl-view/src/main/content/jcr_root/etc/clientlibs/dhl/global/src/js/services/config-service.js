/*eslint-disable no-unused-vars,no-unreachable*/
import ewf from 'ewf';
import './../services/throttle-service';

ewf.service('configService', ConfigService);

ConfigService.$inject = ['$http', '$q', 'logService', 'navigationService', 'throttleService'];

export default function ConfigService($http, $q, logService, navigationService, throttleService) {
    const valueFailedToLoad = 'Value failed to load';
    const valueRequestPending = 'Value request pending';

    const publicApi = {
        getValue,
        getBoolean,
        getFormField
    };


    /**
     * values = {
     *      'US': [
     *          'some name, f.e. "Rewards / Promotion.Available Reward programs.nectar"': {
     *              type:"BOOLEAN",
     *              alias:"nectar",
     *              group:"Rewards / Promotion",
     *              subGroup:"Available Reward programs",
     *              data:{
     *                  value: true
     *              }
     *          },
     *          ...
     *      ],
     *      'UA': [...]
     *  }
     */
    const values = {};

    const aggregateFn = (ciRequests, ciRequest, country) => {
        const [group, subgroup, ciAliases] = ciRequest.split('.');
        const currentRequests = ciRequests || [];

        currentRequests.push({
            group,
            ciRequest,
            country
        });
        return currentRequests;
    };

    const throttleHandler = (ciRequests) => {
        const ciRequestsByCountry = ciRequests.reduce((acc, ciRequest) => {
            if (!acc[ciRequest.country]) {
                acc[ciRequest.country] = [];
            }
            acc[ciRequest.country].push(ciRequest.group);
            return acc;
        }, {});

        const groupRequests = Object.keys(ciRequestsByCountry).map((country) => {
             const groupsRequest = ciRequestsByCountry[country]
                 .map(encodeURIComponent)
                 .reduce((acc, str) => acc + '&groups=' + str, '');
             return {
                 httpRequest: $http.get(`/api/rules?country=${country}${groupsRequest}`),
                 country
             };
        });

        return $q.all(groupRequests.map((item) => item.httpRequest))
            .then((response) => {
                const countries = groupRequests.map((item) => item.country);

                response.forEach((item, index) => {
                    const collection = response[index].data;
                    collection.forEach((ciResult) => {
                        const key = `${ciResult.group}.${ciResult.subGroup}.${ciResult.alias}`;
                        values[countries[index]][key] = ciResult;
                    });
                });
            })
            .catch((response) => {
                logService.error(`Error while requesting values ${JSON.stringify(ciRequests)}`);
                return $q.reject(response);
            })
            .finally(() => {
                ciRequests.forEach((ciRequest) => {
                    values[ciRequest.country][ciRequest.ciRequest] = values[ciRequest.country][ciRequest.ciRequest] ||
                        valueFailedToLoad;
                });
            });
    };

    const requestValues = lazyFn(() =>
        throttleService.createThrottleFunction(
            aggregateFn,
            throttleHandler
        ));

    function getValue(key, country = navigationService.getCountryLang().countryId) {
        if (!values[country]) {
            values[country] = [];
        }

        if (values[country][key] === valueFailedToLoad) {
            return $q.reject(`Value "${key}" was already requested but failed to load properly`);
        }

        const value = values[country][key] || (values[country][key] = valueRequestPending);

        return value !== valueRequestPending
            ? $q.when(values[country][key])
            : requestValues(key, country)
                .then((throttleResultFn) => throttleResultFn())
                .then(() => {
                    const result = values[country][key];

                    if (result === valueFailedToLoad) {
                        return $q.reject(`Was unable to load setting/ConfigItem "${key}"`);
                    }

                    return $q.when(result);
                });
    }

    function lazyFn(factoryFunction) {
        let fn = null;

        return (...args) => {
            return (fn || (fn = factoryFunction())).apply(this, args);
        };
    }

    function getBoolean(key, country) {
        return publicApi.getValue(key, country)
            .then((response) => response.data.value);
    }

    function getFormField(key, country) {
        return publicApi.getValue(key, country)
            .then((response) => response.data.value);
    }

    return publicApi;

}
