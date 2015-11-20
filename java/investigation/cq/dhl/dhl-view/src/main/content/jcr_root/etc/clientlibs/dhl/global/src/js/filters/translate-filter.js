import ewf from 'ewf';
import './../services/nls-service';

ewf.filter('translate', translate);

export default function translate(nlsService) {
    return function(fullKey) {
        return nlsService.translate(fullKey);
    };
}
