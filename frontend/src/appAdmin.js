require('./templates/admin.html');

var _ = require('lodash');

// import jquery
import 'jquery';
import 'foundation-sites/dist/js/foundation';
import 'jquery-datetimepicker';
import 'chart.js/src/chart';
import 'select2';
import angular from 'angular';
import 'sortablejs/Sortable';
import 'microplugin';
import 'sifter';
import 'angular-legacy-sortablejs-maintained';
import 'angular-translate';
import 'angular-sanitize';
import 'ng-table';
import 'angular-moment';
import 'angular-ui-router';
import 'restangular';
import 'angular-jwt/';
import 'ui-select';
import 'pickadate/lib/picker';
import 'angular-flash-alert';
import 'angular-selectize2/dist/selectize';
import 'angular-chart.js/angular-chart';
import 'ng-jsoneditor';
import 'brace';
import 'angular-animate';
import 'angular-loading-bar';
import 'ace-angular';
import 'simplemde/dist/simplemde.min.css';
import 'ng-simplemde';
import 'ng-showdown';


// global styles
import 'pickadate/lib/themes/classic.css';
import 'pickadate/lib/themes/classic.date.css';
import 'angular-flash-alert/dist/angular-flash.min.css';
import 'ui-select/dist/select.min.css';
import 'selectize/dist/css/selectize.css';
import 'jquery-datetimepicker/jquery.datetimepicker.css';
import 'jsoneditor/dist/jsoneditor.min.css';
import 'angular-loading-bar/build/loading-bar.css';

import EditableMap from './component/global/map/EditableMap';
import ParamsMap from './component/global/map/ParamsMap';
import Validation from './component/global/validation/Validation';

import ToggleControlDirective from './component/global/toggleControl/ToggleControlDirective';
import ModalDirective from './component/global/modal/ModalDirective';
import CheckboxDirective from './component/global/checkbox/CheckboxDirective';
import DatepickerDirective from './component/global/datepicker/DatepickerDirective';
import FormValidationDirective from './component/global/validation/FormValidationDirective';
import CsvUploadDirective from './component/global/csv/CsvUploadDirective';
import XmlUploadDirective from './component/global/import/XmlUploadDirective';
import SecurityController from './component/global/security/SecurityController';
import SecurityService from './component/global/security/SecurityService';

import AuthService from './component/global/auth/AuthService';
//admin
import DataService from './component/global/data/DataService';
import TranslationService from './component/global/translations/TranslationService';
import TranslationLoader from './component/global/translations/TranslationLoader';

import RootController from './component/global/root/RootController';
//admin
import StaticPagesController from './component/global/pages/StaticPagesController';
import StaticPagesDirective from './component/global/pages/StaticPagesDirective';
import FileModelDirective from './component/global/filereader/FileModelDirective';
import BoxLoaderDirective from './component/global/boxLoader/BoxLoaderDirective';
import SpinnerLoaderDirective from './component/global/spinnerLoader/SpinnerLoaderDirective';

import AdminFieldsetBlockDirective from './component/admin/adminFieldsetBlock/AdminFieldsetBlockDirective';
import AdminFieldsetRowDirective from './component/admin/adminFieldsetRow/AdminFieldsetRowDirective';

import DebugController from './component/global/debug/DebugController';

import Filters from './component/global/filters/Filters';
// global scss
import './style/main.scss';
// global js
import './scripts/main';

window.Selectize = require('selectize');
window.JSONEditor = require('jsoneditor');
require('brace/mode/json');


// open loyalty modules
require('./modules/admin.campaign/module.js');
require('./modules/admin.customers/module.js');
require('./modules/admin.dashboard/module.js');
require('./modules/admin.data/module.js');
require('./modules/admin.earning-rules/module.js');
require('./modules/admin.levels/module.js');
require('./modules/admin.login/module.js');
require('./modules/admin.partials/module.js');
require('./modules/admin.pos/module.js');
require('./modules/admin.segment/module.js');
require('./modules/admin.seller/module.js');
require('./modules/admin.settings/module.js');
require('./modules/admin.transactions/module.js');
require('./modules/admin.transfers/module.js');
require('./modules/admin.translations/module.js');
require('./modules/admin.users/module.js');
require('./modules/admin.roles/module.js');
require('./modules/admin.emails/module.js');
require('./modules/admin.logs/module.js');
require('./modules/admin.feedback/module.js');

if (!window.OpenLoyaltyConfig.debug) {
    if (!window.console) window.console = {};
    ["log", "debug", "warn", "info"].map((method) => console[method] = function () { })
}

angular.module('OpenLoyalty', [
    'ui.router',
    'angular-jwt',
    'restangular',
    'ngFlash',
    'angularMoment',
    'ngTable',
    'ui.select',
    'ngSanitize',
    'ng-sortable',
    'pascalprecht.translate',
    'selectize',
    'chart.js',
    'ng.jsoneditor',
    'ace.angular',
    'angular-loading-bar',
    'ngAnimate',
    'admin.campaign',
    'admin.customers',
    'admin.dashboard',
    'admin.data',
    'admin.earning-rules',
    'admin.levels',
    'admin.login',
    'admin.partials',
    'admin.pos',
    'admin.segment',
    'admin.seller',
    'admin.settings',
    'admin.transactions',
    'admin.transfers',
    'admin.translations',
    'admin.roles',
    'admin.users',
    'admin.emails',
    'admin.logs',
    'admin.feedback',
    'simplemde',
    'ng-showdown'
])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, RestangularProvider, $translateProvider, $locationProvider, cfpLoadingBarProvider) {
        let config = window.OpenLoyaltyConfig;

        cfpLoadingBarProvider.includeSpinner = false;
        $translateProvider.useLoader('TranslationLoader');
        $locationProvider.hashPrefix('!');
        $translateProvider.preferredLanguage('en');

        RestangularProvider.setBaseUrl(config.apiUrl);

        RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, $state) {
            var extractedData = data;

            if (extractedData.customers) {
                for (let i in data.customers) {
                    if (extractedData.customers[i].customerId) {
                        extractedData.customers[i].id = extractedData.customers[i].customerId
                    }
                }
            }
            if (extractedData.customerId) {
                extractedData.id = extractedData.customerId
            }
            if (extractedData.campaignId) {
                extractedData.id = extractedData.campaignId
            }

            if (operation === "getList") {
                let keys = Object.keys(data);
                extractedData = data[keys[0]];
                extractedData.total = data.total;
                extractedData.additional = data.additional;
            }

            return extractedData;
        });

        jwtInterceptorProvider.tokenGetter = ['AuthService', 'jwtHelper', 'config', '$state', function (AuthService, jwtHelper, config, $state) {
            if (config.url.indexOf('login_check') !== -1 || config.url.indexOf('token/refresh') !== -1) {
                return null;
            }

            let idToken = AuthService.getStoredToken();

            if (idToken && jwtHelper.isTokenExpired(idToken) && AuthService.isRememberMe()) {
                return AuthService.getRefreshToken()
                    .then(
                        res => {
                            let id_token = res.token;
                            let refresh_token = res.refresh_token;

                            AuthService.setStoredRefreshToken(refresh_token);
                            AuthService.setStoredToken(id_token);

                            return id_token;
                        },
                        res => {
                            AuthService.logout();
                        }
                    );
            } else if (idToken && !jwtHelper.isTokenExpired(idToken)) {
                return idToken;
            } else {
                return null
            }
        }];

        $httpProvider.interceptors.push('jwtInterceptor');

        $urlRouterProvider
            .otherwise("/");
        $stateProvider
            .state('admin-login', {
                url: "/",
                templateUrl: require('./modules/admin.login/templates/login.html'),
                controller: 'LoginController',
                controllerAs: 'LoginCtrl'
            })
            .state('forgot-password-request-admin', {
                url: "/admin/password/request",
                templateUrl: require('./modules/admin.login/templates/password-request.html'),
                controller: 'SecurityController',
                controllerAs: 'SecurityCtrl'
            })
            .state('forgot-password-reset-admin', {
                url: "/password/reset/:token",
                templateUrl: require('./modules/admin.login/templates/password-reset.html'),
                controller: 'SecurityController',
                controllerAs: 'SecurityCtrl'
            })
            .state('admin.static', {
                url: "/page/:pageName",
                views: {
                    '@': {
                        templateUrl: require('./component/global/pages/templates/static-pages.html'),
                        controller: 'StaticPagesController',
                        controllerAs: 'StaticPagesCtrl'
                    }
                }
            })

        if (window.OpenLoyaltyConfig.debug) {
            $stateProvider.state('debug', {
                url: "/debug",
                views: {
                    '@': {
                        templateUrl: require('./component/global/debug/templates/debug.html'),
                        controller: 'DebugController',
                        controllerAs: 'DebugCtrl'
                    }
                }
            });
        }
    })

    .run(['Restangular', '$state', 'AuthService', '$rootScope', '$templateCache', function (Restangular, $state, AuthService, $rootScope, $templateCache, Flash) {
        $rootScope.pendingRequests = _.isNumber($rootScope.pendingRequests) ? $rootScope.pendingRequests : 0;
        Restangular.setErrorInterceptor(function (response) {
            $rootScope.pendingRequests -= 1;

            if (response.status === 401) {
                AuthService.logout();
            }
            return true;
        });
        Restangular.addResponseInterceptor(res => {
            if ($rootScope.pendingRequests > 0) {
                $rootScope.pendingRequests -= 1;
            }

            return res;
        });
        Restangular.addFullRequestInterceptor((element, operation, what, url, headers, params) => {
            //filter[silenceQuery]: true
            console.log('pendingRequest', $rootScope.pendingRequests)
            if (!params.silenceQuery) {
                $rootScope.pendingRequests += 1;
            }

            return element;
        });
        $templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}" ng-model-options="{debounce: 1500}" /> ');
        $templateCache.put('ng-table/filters/number.html', '<input type="number" name="{{name}}" ng-disabled="$filterRow.disabled" ng-model="params.filter()[name]" class="input-filter form-control" placeholder="{{getFilterPlaceholderValue(filter, name)}}" ng-model-options="{debounce: 1500}" /> ');

    }])

    .filter('commaToDot', () => new Filters.CommaToDecimal())
    .filter('percent', () => new Filters.Percent())
    .filter('propsFilter', () => new Filters.PropsFilter())
    .filter('isEmpty', () => new Filters.IsEmptyFilter())
    .filter('roundPoints', () => new Filters.RoundPoints())

    .directive('toggleControl', () => new ToggleControlDirective())
    .directive('modal', () => new ModalDirective())
    .directive('datepicker', () => new DatepickerDirective())
    .directive('formValidation', () => new FormValidationDirective())
    .directive('csvUpload', () => new CsvUploadDirective())
    .directive('xmlUpload', () => new XmlUploadDirective())
    .directive('checkbox', () => new CheckboxDirective())
    .directive('staticPage', () => new StaticPagesDirective())
    .directive('fileModel', FileModelDirective.create)
    .directive('boxLoader', BoxLoaderDirective.create)
    .directive('spinnerLoader', SpinnerLoaderDirective.create)
    .directive('adminFieldsetRow', () => new AdminFieldsetRowDirective())
    .directive('adminFieldsetBlock', () => new AdminFieldsetBlockDirective())

    .service('EditableMap', EditableMap)
    .service('ParamsMap', ParamsMap)
    .service('Validation', Validation)
    .service('AuthService', AuthService)
    .service('DataService', DataService)
    .service('SecurityService', SecurityService)
    .service('TranslationService', TranslationService)
    .factory('TranslationLoader', ['TranslationService', (TranslationService) => new TranslationLoader(TranslationService)])

    .controller('RootController', RootController)
    .controller('SecurityController', SecurityController)
    .controller('StaticPagesController', StaticPagesController)
    .controller('DebugController', DebugController)
    // .controller('UserListController', ($rootScope, Restangular) => {
    //     const getUsers = (params) => {
    //         if (!params) {
    //             params = {};
    //         }

    //         Restangular.all('admin').getList(params)
    //             .then(res => {
    //                 $rootScope.customerList = res
    //                 console.log($rootScope.customerList )
    //             })
    //     }
    // })
