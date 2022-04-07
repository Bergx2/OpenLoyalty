export default class CustomerCampaignController {
    constructor($scope, $state, AuthService, CustomerCampaignService, Flash, $q, ParamsMap, $stateParams, EditableMap, $filter, CustomerStatusService, DataService, NgTableParams) {
        if (!AuthService.isGranted('ROLE_PARTICIPANT')) {
            $state.go('customer-login')
        }
        this.id = AuthService.getLoggedUserId();

        this.$scope = $scope;
        this.CustomerCampaignService = CustomerCampaignService;
        this.CustomerStatusService = CustomerStatusService;
        this.$state = $state;
        this.Flash = Flash;
        this.ParamsMap = ParamsMap;
        this.EditableMap = EditableMap;
        this.NgTableParams = NgTableParams;
        this.$q = $q;
        this.$filter = $filter;
        this.available = false;
        this.bought = false;
        this.$scope.params = {
            perPage: 6,
            page: 1
        };
        this.$scope.currentPage = this.$scope.params.page;
        this.$scope.total = 0;
        this.$scope.totalPages = [];
        this.config = DataService.getConfig();
        this.$scope.loaderVisible = true;
    }

    getStatus() {
        if (this.id) {
            let self = this;

            this.CustomerStatusService.getStatus(this.id).then(
                res => {
                    self.$scope.status = res;
                    self.$scope.availablePoints = res.points;
                    self.$scope.translateValues = {
                        "levelName": res.levelName,
                        "level": res.level,
                        "points": self.$filter('roundPoints')(res.points),
                        "pointsToNextLevel": res.pointsToNextLevel,
                        "transactionsAmountToNextLevelWithoutDeliveryCosts": res.transactionsAmountToNextLevelWithoutDeliveryCosts + res.currency,
                        "transactionsAmountToNextLevel": res.transactionsAmountToNextLevel + res.currency,
                    };
                }
            )
        }
    }

    updateCouponUsage(campaignId, code, couponId, used) {
        let self = this;
        self.CustomerCampaignService.postUsage(campaignId, code, couponId, used).then(
            res => {
            },
            res => {
                let message = self.$filter('translate')('xhr.pos_coupon_usage.error');
                self.Flash.create('danger', message);
            }
        )
    }

    getAvailableData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: 6
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.CustomerCampaignService.getAvailable(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.$scope.loaderVisible = false;
                            self.$scope.campaigns = res;
                            angular.forEach(self.$scope.campaigns, function(campaign, key) {
                                self.CustomerCampaignService.getCampaignImage(campaign.campaignId)
                                    .then(
                                        res => {
                                            campaign.campaignFilePath = true;
                                        }
                                    )
                                    .catch(
                                        err => {
                                            campaign.campaignFilePath = false;
                                        }
                                    );
                            });
                            params.total(res.total);
                            self.available = true;
                            dfd.resolve(res)
                        },
                        () => {
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });

    }

    getBoughtData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: 6
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.CustomerCampaignService.getBought(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.$scope.campaigns = res;
                            params.total(res.total);
                            self.available = true;
                            dfd.resolve(res)
                        },
                        () => {
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    buyCampaign(campaignId) {
        let self = this;

        self.CustomerCampaignService.postBuy(campaignId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.customer_buy.success');
                    self.$scope.boughtCoupon = res.coupon;
                    self.$scope.boughtCampaign = _.find(self.$scope.campaigns, {campaignId: campaignId})
                    self.$scope.showBoughtModal = true;
                    self.Flash.create('success', message);
                    self.getStatus();
                    self.getAvailableData();
                },
                res => {
                    if (res.status === 404 || res.status === 400) {
                        self.getAvailableData();
                        self.showRewardClosedModal = true;
                    } else {
                        let message = self.$filter('translate')('xhr.customer_buy.error');
                        self.Flash.create('danger', message);
                    }
                }
            );

    }

    /**
     * Generating photo route
     *
     * @method generatePhotoRoute
     * @returns {string}
     */
    generatePhotoRoute(campaignId) {
        return this.config.apiUrl + '/campaign/' + campaignId + '/photo'
    }



}

CustomerCampaignController.$inject = ['$scope', '$state', 'AuthService', 'CustomerCampaignService', 'Flash', '$q', 'ParamsMap', '$stateParams', 'EditableMap', '$filter', 'CustomerStatusService', 'DataService', 'NgTableParams'];
