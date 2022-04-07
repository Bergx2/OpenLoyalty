import angular from 'angular';
import FeedbackController from './FeedbackController'
import FeedbackService from './FeedbackService';

const MODULE_NAME = 'admin.feedback';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider.state('admin.feedback-list', {
            url: '/feedback-list',
            views: {
                'main@': {
                    templateUrl: require('./templates/feedback-list.html'),
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
            .get(`templates/feedback-list.html`)
            .then((response) => {
                $templateCache.put("templates/feedback-list.html", response.data);
            })
            .catch(catchErrorTemplate);

    })
    .controller('FeedbackController', FeedbackController)
    .service('FeedbackService', FeedbackService)