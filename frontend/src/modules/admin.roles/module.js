import RolesController from './RolesController';
import RolesService from './RolesService';

const MODULE_NAME = 'admin.roles';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.roles-list', {
                url: "/roles-list/",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/roles-list-extend-top.html',
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/roles-list.html'),
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/roles-list-extend-bottom.html',
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    }
                }
            })
            .state('admin.edit-role', {
                url: "/edit-role/:roleId",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/edit-role-extend-top.html',
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/edit-role.html'),
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/edit-role-extend-bottom.html',
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    }
                }
            })
            .state('admin.add-role', {
                url: "/add-role",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/add-role-extend-top.html',
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/add-role.html'),
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/add-role-extend-bottom.html',
                        controller: 'RolesController',
                        controllerAs: 'RolesCtrl'
                    }
                }
            })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('templates/edit-role-extend-top.html', '');
        $templateCache.put('templates/edit-role-extend-bottom.html', '');

        $templateCache.put('templates/add-role-extend-top.html', '');
        $templateCache.put('templates/add-role-extend-bottom.html', '');

        $templateCache.put('templates/roles-list-extend-top.html', '');
        $templateCache.put('templates/roles-list-extend-bottom.html', '');

        $http.get(`templates/roles-list.html`)
            .then(
                response => {
                    $templateCache.put('templates/roles-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`templates/edit-role.html`)
            .then(
                response => {
                    $templateCache.put('templates/edit-role.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`templates/add-role.html`)
            .then(
                response => {
                    $templateCache.put('templates/add-role.html', response.data);
                }
            )
            .catch(catchErrorTemplate);
    })
    .controller('RolesController', RolesController)
    .service('RolesService', RolesService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw `${MODULE_NAME} will not be registered`
}