import Img1 from './../../img/ol_ban_1.jpg';
import Img2 from './../../img/ol_ban_2.jpg';
import Img3 from './../../img/ol_ban_3.jpg';
import Img4 from './../../img/ol_ban_4.jpg';
import Img5 from './../../img/ol_ban_5.jpg';
import Img6 from './../../img/ol_ban_6.jpg';
import Img7 from './../../img/ol_ban_7.jpg';
import Img8 from './../../img/ol_ban_8.jpg';
import Img9 from './../../img/ol_ban_9.jpg';
import Img10 from './../../img/ol_ban_10.jpg';
import CustomerDashboardController from './CustomerDashboardController';
import InvitationService from './InvitationService';

const MODULE_NAME = 'client.dashboard';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('customer.panel.dashboard', {
                url: "/dashboard",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/customer-dashboard-extend-top.html',
                        controller: 'CustomerDashboardController',
                        controllerAs: 'CustomerDashboardCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/customer-dashboard.html'),
                        controller: 'CustomerDashboardController',
                        controllerAs: 'CustomerDashboardCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/customer-dashboard-extend-bottom.html',
                        controller: 'CustomerDashboardController',
                        controllerAs: 'CustomerDashboardCtrl'
                    }
                },
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('templates/customer-dashboard-extend-top.html', '');
        $templateCache.put('templates/customer-dashboard-extend-bottom.html', '');

        $http.get(`templates/customer-dashboard.html`)
            .then(
                response => {
                    $templateCache.put('templates/customer-dashboard.html', response.data);
                }
            )
            .catch(catchErrorTemplate);
    })
    .controller('CustomerDashboardController', CustomerDashboardController)
    .service('InvitationService', InvitationService);


try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch(err) {
    throw `${MODULE_NAME} will not be registered`
}
