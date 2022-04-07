import FeedbackSerivce from './FeedbackService'
import FeedbackController from './FeedbackController'
import angular from 'angular';

const MODULE_NAME = 'client.feedback';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('customer.panel.feedback', {
                url: '/feedback',
                views: {
                    'main@': {
                        templateUrl: require('./template/send-feedback.html'),
                        controller: 'FeedbackController',
                        controllerAs: 'FeedbackController'
                    },
                },
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`;
        };

        $http
            .get(`templates/send-feedback.html`)
            .then((response) => {
                $templateCache.put("templates/send-feedback.html", response.data);
            })
            .catch(catchErrorTemplate);

    })
    .controller('FeedbackController', FeedbackController)
    .service('FeedbackService', FeedbackSerivce)


try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw `${MODULE_NAME} will not be registered`
}