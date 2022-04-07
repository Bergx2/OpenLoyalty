import CampaignController from './CampaignController';
import CampaignService from './CampaignService';

const MODULE_NAME = 'admin.campaign';

angular.module(MODULE_NAME, [])
    .config($stateProvider => {
        $stateProvider
            .state('admin.campaign-list', {
                url: "/campaign-list/",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/campaign-list-extend-top.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/campaign-list.html'),
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/campaign-list-extend-bottom.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    }
                }
            })
            .state('admin.edit-campaign', {
                url: "/edit-campaign/:campaignId",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/edit-campaign-extend-top.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/edit-campaign.html'),
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/edit-campaign-extend-bottom.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    }
                }
            })
            .state('admin.campaign-customers', {
                url: "/campaign-customers/:campaignId/:campaignName",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/campaign-customers-extend-top.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/campaign-customers.html'),
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/campaign-customers-extend-bottom.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    }
                }
            })
            .state('admin.single-campaign', {
                url: "/single-campaign/:campaignId",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/single-campaign-extend-top.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/single-campaign.html'),
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/single-campaign-extend-bottom.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    }
                }
            })
            .state('admin.add-campaign', {
                url: "/add-campaign",
                views: {
                    'extendTop@': {
                        templateUrl: 'templates/add-campaign-extend-top.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'main@': {
                        templateUrl: require('./templates/add-campaign.html'),
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    },
                    'extendBottom@': {
                        templateUrl: 'templates/add-campaign-extend-bottom.html',
                        controller: 'CampaignController',
                        controllerAs: 'CampaignCtrl'
                    }
                }
            })
          .state('admin.redeemed-rewards', {
              url: "/redeemed-campaigns",
              views: {
                'extendTop@': {
                  templateUrl: 'templates/redeemed-campaigns-extend-top.html',
                  controller: 'CampaignController',
                  controllerAs: 'CampaignCtrl'
                },
                'main@': {
                  templateUrl: require('./templates/redeemed-campaigns.html'),
                  controller: 'CampaignController',
                  controllerAs: 'CampaignCtrl'
                },
                'extendBottom@': {
                  templateUrl: 'templates/redeemed-campaigns-extend-bottom.html',
                  controller: 'CampaignController',
                  controllerAs: 'CampaignCtrl'
                }
              }
          })
          .state('admin.campaign-category-list', {
              url: "/campaign-category-list/",
              views: {
                  'main@': {
                      templateUrl: require('./templates/campaign-category-list.html'),
                      controller: 'CampaignController',
                      controllerAs: 'CampaignCtrl'
                  },
              }
          })
          .state('admin.edit-campaign-category', {
              url: "/edit-campaign-category/:campaignCategoryId",
              views: {
                'main@': {
                  templateUrl: require('./templates/edit-campaign-category.html'),
                  controller: 'CampaignController',
                  controllerAs: 'CampaignCtrl'
                },
              }
          })
          .state('admin.add-campaign-category', {
              url: "/add-campaign-category",
              views: {
                'main@': {
                  templateUrl: require('./templates/add-campaign-category.html'),
                  controller: 'CampaignController',
                  controllerAs: 'CampaignCtrl'
                },
              }
          })
    })
    .run(($templateCache, $http) => {
        let catchErrorTemplate = () => {
            throw `${MODULE_NAME} has missing template`
        };

        $templateCache.put('templates/campaign-list-extend-top.html', '');
        $templateCache.put('templates/campaign-list-extend-bottom.html', '');

        $templateCache.put('templates/edit-campaign-extend-top.html', '');
        $templateCache.put('templates/edit-campaign-extend-bottom.html', '');

        $templateCache.put('templates/campaign-customers-extend-top.html', '');
        $templateCache.put('templates/campaign-customers-extend-bottom.html', '');

        $templateCache.put('templates/add-campaign-extend-top.html', '');
        $templateCache.put('templates/add-campaign-extend-bottom.html', '');

        $templateCache.put('templates/single-campaign-extend-top.html', '');
        $templateCache.put('templates/single-campaign-extend-bottom.html', '');

        $templateCache.put('templates/redeemed-campaigns-extend-top.html', '');
        $templateCache.put('templates/redeemed-campaigns-extend-bottom.html', '');

        $http.get(`templates/add-campaign.html`)
            .then(
                response => {
                    $templateCache.put('templates/add-campaign.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`templates/campaign-customers.html`)
            .then(
                response => {
                    $templateCache.put('templates/campaign-customers.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`templates/campaign-list.html`)
            .then(
                response => {
                    $templateCache.put('templates/campaign-list.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`templates/single-campaign.html`)
            .then(
                response => {
                    $templateCache.put('templates/single-campaign.html', response.data);
                }
            )
            .catch(catchErrorTemplate);

        $http.get(`templates/redeemed-campaigns.html`)
           .then(
             response => {
               $templateCache.put('templates/redeemed-campaigns.html', response.data);
             }
           )
           .catch(catchErrorTemplate);

      $http.get(`templates/campaign-category-list.html`)
          .then(
              response => {
                $templateCache.put('templates/campaign-category-list.html', response.data);
              }
          )
          .catch(catchErrorTemplate);

      $http.get(`templates/edit-campaign-category.html`)
          .then(
              response => {
                $templateCache.put('templates/edit-campaign-category.html', response.data);
              }
          )
          .catch(catchErrorTemplate);

      $http.get(`templates/add-campaign-category.html`)
          .then(
              response => {
                $templateCache.put('templates/add-campaign-category.html', response.data);
              }
          )
          .catch(catchErrorTemplate);
    })
    .controller('CampaignController', CampaignController)
    .service('CampaignService', CampaignService);

try {
    window.OpenLoyaltyConfig.modules.push(MODULE_NAME);
} catch (err) {
    throw `${MODULE_NAME} will not be registered`
}
