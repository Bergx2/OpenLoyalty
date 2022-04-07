const USAGE_TYPE_USED = 'true';
const USAGE_TYPE_DELIVERED = 'false';

/**
 * Describes Admin CampaignController
 * @class CampaignController
 * @constructor
 */
export default class CampaignController {
    /**
     * @param {Object} $scope
     * @param {Object} $state
     * @param {Object} $stateParams
     * @param {Object} $timeout
     * @param {AuthService} AuthService
     * @param {CampaignService} CampaignService
     * @param {Object} Flash
     * @param {EditableMap} EditableMap
     * @param {Object} NgTableParams
     * @param {ParamsMap} ParamsMap
     * @param {Object} $q
     * @param {Object} Validation
     * @param {Object} $filter
     * @param {SegmentService} SegmentService
     * @param {Object} LevelService
     * @param {DataService} DataService
     * @param {CustomerService} CustomerService
     * @param {TransactionService} TransactionService
     * @method constructor
     */
    constructor($scope, $state, $stateParams, $timeout, AuthService, CampaignService, Flash, EditableMap, NgTableParams, ParamsMap, $q, Validation, $filter, SegmentService, LevelService, DataService, CustomerService, TransactionService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.campaignFiles = [{
            id: 0,
            file: {},
            error: '',
            visible: true
        }];
        this.deliveryStatusesHumanized = [];
        this.deliveryStatusesSelectOptions = [];
        this.SegmentService = SegmentService;
        this.LevelService = LevelService;
        this.AuthService = AuthService;
        this.DataService = DataService;
        this.CampaignService = CampaignService;
        this.TransactionService = TransactionService;
        this.EditableMap = EditableMap;
        this.ParamsMap = ParamsMap;
        this.Validation = Validation;
        this.CustomerService = CustomerService;

        this.activityStatusSelectOptions = [
            {
                value: '',
                label: $filter('translate')('campaign.activity_statuses.all')
            },
            {
                value: '1',
                label: $filter('translate')('campaign.activity_statuses.active')
            },
            {
                value: '0',
                label: $filter('translate')('campaign.activity_statuses.inactive')
            },
        ];

        this.activityStatusSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.fulfillmentTrackingSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.fulfillmentTrackingSelectOptions = [
            {
                value: '',
                label: $filter('translate')('campaign.campaign_type.all')
            },
            {
                label: $filter('translate')('global.no'),
                value: false
            },
            {
                label: $filter('translate')('global.confirm'),
                value: true
            }
        ];

        this.rewardSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.rewardSelectOptions = [
            {
                value: '',
                label: $filter('translate')('campaign.campaign_type.all')
            },
            {
                label: $filter('translate')('campaign.discount_code'),
                value: 'discount_code'
            },
            {
                label: $filter('translate')('campaign.event_code'),
                value: 'event_code'
            },
            {
                label: $filter('translate')('campaign.free_delivery_code'),
                value: 'free_delivery_code'
            },
            {
                label: $filter('translate')('campaign.gift_code'),
                value: 'gift_code'
            },
            {
                label: $filter('translate')('campaign.value_code'),
                value: 'value_code'
            },
            {
                label: $filter('translate')('campaign.cashback'),
                value: 'cashback'
            },
            {
                label: $filter('translate')('campaign.percentage_discount_code'),
                value: 'percentage_discount_code'
            },
            {
                label: $filter('translate')('campaign.custom_campaign_code'),
                value: 'custom_campaign_code'
            }
        ];

        this.Flash = Flash;
        this.NgTableParams = NgTableParams;
        this.$q = $q;
        this.$filter = $filter;
        this._selectizeConfigs();
    }

    /**
     * adding another file input to form
     * @param {Integer} event
     * @method addFileInput
     */
    addFileInput(event) {
        event.preventDefault();
        let keys = Object.keys(this.$scope.CampaignCtrl.campaignFiles);
        this.$scope.CampaignCtrl.campaignFiles.push({
            id: keys.length,
            file: {},
            error: '',
            visible: true
        });
    };

    /**
     * removing file input from form
     * @param {Integer} event
     * @param {Integer} id
     * @method removeFileInput
     */
    removeFileInput(event, id) {
        event.preventDefault();
        for (var i = 0; i < this.$scope.CampaignCtrl.campaignFiles.length; i++) {
            if (this.$scope.CampaignCtrl.campaignFiles[i].id == id) {
                this.$scope.CampaignCtrl.campaignFiles.splice(i, 1);
            }
        }
    };

    /**
     * Initial method
     *
     * @method $onInit
     */
    $onInit() {
        this.$scope.clientSearch = 0;
        this.loaderStates = {
            deliveryStatuses: true,
            campaignList: true,
            campaignDetails: true,
            campaignCustomerList: true,
            coverLoader: true,
            redeemedCampaigns: true,
            buyCampaignManually: false,
            categoryList: true,
            campaignCategoryDetails: true
        };

        this.campaignId = this.$stateParams.campaignId || null;
        this.$scope.campaignName = this.$stateParams.campaignName || false;
        this.$scope.newCampaign = {labels: []};
        this.$scope.newCampaign.reward = 'discount_code';
        this.$scope.buyCampaignManually = {};
        this.$scope.showCompany = false;
        this.$scope.showAddress = false;
        this.$scope.fileValidate = [];
        this.$scope.dateFrom = null;
        this.$scope.dateTo = null;
        this.$scope.exportDateFrom = null;
        this.$scope.exportDateTo = null;
        this.$scope.content = "test";
        this.$scope.buyCampaignManuallyModal = false;
        this.$scope.brandIconFileValidate = null;
        this.$scope.campaignBrandIconFilePath = false;
        this.$scope.campaignBrandIconFile = null;
        this.$scope.campaignPhotos = [];
        this.segments = null;
        this.levels = null;
        this.campaignCategoryId = this.$stateParams.campaignCategoryId || null;
        this.$scope.newCategory = {};
        // If 'required: true' it will only
        // be required on default language
        this.$scope.translatableFields = [
            {
                key: 'name',
                label: 'campaign.name',
                prompt: 'campaign.name_prompt',
                required: true
            }
        ];
        this.$scope.availableFrontendTranslations = this.DataService.getAvailableFrontendTranslations();
        this.$scope.translatableCategoryFields = [
            {
              key: 'name',
              label: 'campaign.name',
              prompt: 'campaign.name_prompt',
              required: true
            }
        ];
        this.config = this.DataService.getConfig();
        this.target = [
            {
                name: this.$filter('translate')('global.segment'),
                type: 'segment'
            },
            {
                name: this.$filter('translate')('global.level'),
                type: 'level'
            }
        ];
        this.active = [
            {
                name: this.$filter('translate')('global.active'),
                type: 1
            },
            {
                name: this.$filter('translate')('global.inactive'),
                type: 0
            }
        ];
        this.reward = [
            {
                name: this.$filter('translate')('campaign.discount_code'),
                type: 'discount_code'
            },
            {
                name: this.$filter('translate')('campaign.event_code'),
                type: 'event_code'
            },

            {
                name: this.$filter('translate')('campaign.free_delivery_code'),
                type: 'free_delivery_code'
            },
            {
                name: this.$filter('translate')('campaign.gift_code'),
                type: 'gift_code'
            },
            {
                name: this.$filter('translate')('campaign.value_code'),
                type: 'value_code'
            },
            {
                name: this.$filter('translate')('campaign.cashback'),
                type: 'cashback'
            },
            {
                name: this.$filter('translate')('campaign.percentage_discount_code'),
                type: 'percentage_discount_code'
            },
            {
                name: this.$filter('translate')('campaign.custom_campaign_code'),
                type: 'custom_campaign_code'
            }
        ];
        this.connectType = [
            {
                name: this.$filter('translate')('campaign.connect_type.none'),
                type: 'none'
            },
            {
                name: this.$filter('translate')('campaign.connect_type.qrcode_earning_rule'),
                type: 'qrcode'
            },
            {
                name: this.$filter('translate')('campaign.connect_type.geolocation_earning_rule'),
                type: 'geolocation'
            }
        ];
        this.rewardConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.connectTypeConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.earningRuleIdConfig = {
            valueField: 'earningRuleId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.levelsConfig = {
            valueField: 'id',
            labelField: 'name',
            create: false,
            plugins: ['remove_button'],
            sortField: 'name'
        };
        this.segmentsConfig = {
            valueField: 'segmentId',
            labelField: 'name',
            create: false,
            plugins: ['remove_button'],
            sortField: 'name'
        };
        this.targetConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1
        };
        this.activeConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1
        };
        this.statusConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            maxItems: 1
        };
        this.categoriesConfig = {
            valueField: 'campaignCategoryId',
            labelField: 'name',
            create: false,
            plugins: ['remove_button'],
            sortField: 'sortOrder'
        };
        this.couponsConfig = {
            delimiter: ',',
            persist: false,
            plugins: ['remove_button'],
            create: function (input) {
                return {
                    value: input,
                    text: input
                }
            }
        };

        let categoryPromise = this.CampaignService.getCategories({'perPage': 1000})
            .then(
                res => {
                    this.categories = res;
                }
        );
        let segmentPromise = this.SegmentService.getActiveSegments({perPage: 1000})
            .then(
                res => {
                    this.segments = res;
                }
            );

        let levelPromise = this.LevelService.getLevels({perPage: 1000})
            .then(
                res => {
                    this.levels = res;
                }
            );

        this.dataPromise = this.$q.all([segmentPromise, levelPromise, categoryPromise]);
    }

    /**
     * creates NgTable instances
     *
     * @method getData
     */
    getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.campaignList = true;
                self.CampaignService.getCampaigns(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.$scope.campaigns = res;
                            self.CampaignService.setStoredCampaigns(res);
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_campaigns.error');
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    /**
    * get connect type earning rule
    *
    * @param {String} connectType
    * @method getConnectTypeEarningRule
    */
    getConnectTypeEarningRule(connectType) {
        let self = this;
        self.earningRuleId = null;

        function deleteEarningRuleIdFieldData() {
            if (self.$scope.newCampaign && self.$scope.newCampaign.earningRuleId) {
                self.$scope.newCampaign.earningRuleId = null;
            }
            if (self.$scope.editableFields && self.$scope.editableFields.earningRuleId) {
                self.$scope.editableFields.earningRuleId = null;
            }
        }

        if (connectType == 'none') {
            deleteEarningRuleIdFieldData();
        } else {
            self.CampaignService.getConnectTypeEarningRule(connectType)
                .then(
                    res => {
                        self.earningRuleId = res;
                    },
                    () => {
                        deleteEarningRuleIdFieldData();
                        let message = self.$filter('translate')('xhr.get_earning_rule.error');
                        self.Flash.create('danger', message);
                    }
                );
        }
    }

    /**
    * Sets category state
    *
    * @param {Boolean} active
    * @param {Integer} campaignCategoryId
    * @method setCategoryState
    */
    setCategoryState(campaignCategoryId, active) {
        let self = this;

        self.CampaignService.setCategoryState(campaignCategoryId, active)
            .then(
                () => {
                  let message = self.$filter('translate')('xhr.post_activate_campaign_category.success');
                  self.Flash.create('success', message);
                  self.categoryTableParams.reload();
                },
                () => {
                  let message = self.$filter('translate')('xhr.post_activate_campaign_category.error');
                  self.Flash.create('danger', message);
                }
            )
    }

    /**
    * creates NgTable instances
    *
    * @method getCategoryData
    */
    getCategoryData() {
        let self = this;

        self.categoryTableParams = new self.NgTableParams({
          count: self.config.perPage,
          sorting: {
            order: 'desc'
          }
        }, {
          getData: function (params) {
            let dfd = self.$q.defer();
            self.loaderStates.categoryList = true;
            self.CampaignService.getCategories(self.ParamsMap.params(params.url()))
              .then(
                res => {
                  self.$scope.categories = res;
                  self.CampaignService.setStoredCategories(res);
                  self.loaderStates.categoryList = false;
                  self.loaderStates.coverLoader = false;
                  params.total(res.total);
                  dfd.resolve(res)
                },
                () => {
                  let message = self.$filter('translate')('xhr.get_campaign_categories.error');
                  self.loaderStates.categoryList = false;
                  self.loaderStates.coverLoader = false;
                  self.Flash.create('danger', message);
                  dfd.reject();
                }
              );

            return dfd.promise;
          }
        });
    }

    /**
    * Obtains category details
    *
    * @method getCategoryDetails
    */
    getCategoryDetails() {
        let self = this;

        if (self.campaignCategoryId) {
            self.dataPromise.then(self._getCategory());
        } else {
            self.$state.go('admin.campaign-category-list');
            let message = self.$filter('translate')('xhr.get_campaign_category.no_id');
            self.Flash.create('warning', message);
        }
    }

    /**
     * Adds new category
     *
     * @param {Object} newCategory
     * @method addCategory
     */
    addCategory(newCategory) {
        let self = this;

        self.CampaignService.postCategory(newCategory)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_campaign_category.success');
                    self.Flash.create('success', message);
                    self.loaderStates.coverLoader = false;
                    self.$state.go('admin.campaign-category-list');
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.post_campaign_category.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.categoryDetails = false;
                    self.loaderStates.coverLoader = false;
                }
            )
    }

    /**
     * Edits category
     *
     * @param editedCategory
     * @method editCategory
     */
    editCategory(editedCategory) {
        let self = this;

        self.CampaignService.putCategory(self.campaignCategoryId, editedCategory)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.put_campaign_category.success');
                    self.Flash.create('success', message);
                    self.loaderStates.coverLoader = false;
                    self.$state.go('admin.campaign-category-list');
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.put_campaign_category.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.categoryDetails = false;
                    self.loaderStates.coverLoader = false;
                }
            )
    }

    /**
     * Sets campaign state
     *
     * @param {Boolean} active
     * @param {Integer} campaignId
     * @method setCampaignState
     */
    setCampaignState(active, campaignId) {
        let self = this;

        self.CampaignService.setCampaignState(active, campaignId)
            .then(
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_campaign.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_campaign.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Obtains campaign data
     *
     * @method getCampaignData
     */
    getCampaignData() {
        let self = this;

        if (self.campaignId) {
            self.dataPromise.then(self._getCampaign())
        } else {
            self.$state.go('admin.campaign-list');
            let message = self.$filter('translate')('xhr.get_campaign.no_id');
            self.Flash.create('warning', message);
        }
    }

    /**
     * Adds new campaign
     *
     * @param {Object} newCampaign
     * @method addCampaign
     */
    addCampaign(newCampaign) {
        let self = this;

        if (newCampaign.reward !== 'gift_code') {
            delete newCampaign['fulfillmentTracking'];
        }

        self.CampaignService.postCampaign(newCampaign)
            .then(
                res => {
                   self._uploadCampaignFile(res, 'post');
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.post_campaign.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Deletes photo
     *
     * @method deletePhoto
     */
    deletePhoto(photoId) {
        let self = this;

        this.CampaignService.deleteCampaignImage(this.$stateParams.campaignId, photoId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.delete_campaign_image.success');
                    self.Flash.create('success', message);
                    
                        angular.forEach(self.$scope.campaign.photos, function (value, key) {
                            if( self.$scope.campaign.photos[key].photoId.id === photoId){
                                self.$scope.campaign.photos.splice([key], 1);
                            }
                        });
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_campaign_image.error');
                    self.Flash.create('danger', message);
                }
            )
            
    }

    /**
     * Deletes brand icon
     *
     * @method deleteBrandIcon
     */
    deleteBrandIcon() {
        let self = this;

        this.CampaignService.deleteCampaignBrandIcon(this.$stateParams.campaignId)
            .then(
                res => {
                    self.$scope.campaignBrandIconFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_campaign_brand_icon.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_campaign_brand_icon.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Edits campaign
     *
     * @param editedCampaign
     * @method editCampaign
     */
    editCampaign(editedCampaign) {
        let self = this;

        // sets as an empty string if data has been removed
        for (let property in editedCampaign) {
            if (editedCampaign.hasOwnProperty(property)) {
                if (typeof self.$scope.editableFields[property] === 'undefined' ||
                    self.$scope.editableFields[property] === ''
                ) {
                    editedCampaign[property] = '';
                    self.$scope.editableFields[property] = '';
                }
            }
        }

        if (editedCampaign.reward !== 'gift_code') {
            delete editedCampaign['fulfillmentTracking'];
            delete self.$scope.editableFields['fulfillmentTracking'];
        }

        self.CampaignService.putCampaign(editedCampaign)
            .then(
                res => {
                   self._uploadCampaignFile(res, 'put');
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.put_campaign.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.campaignDetails = false;
                    self.loaderStates.coverLoader = false;
                }
            )
    }

    /**
     * Upload campaign file
     *
     * @param res
     * @param method
     * @method _uploadCampaignFile
     * @private
     */
    _uploadCampaignFile(res, method) {
        let self = this;
        let campaignId = res.campaignId
        var flashMessageType = 'danger';

        if (method == 'post') {
            flashMessageType = 'warning';
        }

        function postCampaignImages(item, key) {

            return self.CampaignService.postCampaignImages(campaignId, item.file)
                .then(
                    res2 => {
                        self.$scope.CampaignCtrl.campaignFiles[key].file = '';
                        self.$scope.CampaignCtrl.campaignFiles[key].visible = false;
                    }
                )
                .catch(
                    err => {
                        let inputError = self.Validation.mapSymfonyValidation(err.data);
                        self.$scope.fileValidate[key] = { error: inputError.file.errors[0] };
                        self.$scope.CampaignCtrl.campaignFiles[key].error = inputError.file.errors[0];
                        let message = self.$filter('translate')('xhr.put_campaign.error');
                        self.Flash.create('danger', message);
                        self.loaderStates.coverLoader = false;
                    }
                );


        }

        function postCampaignBrandIcon() {
            return self.CampaignService.postCampaignBrandIcon(campaignId, self.$scope.campaignBrandIconFile)
                .then(
                    res2 => {}
                )
                .catch(
                    err => {
                        self.$scope.brandIconFileValidate = self.Validation.mapSymfonyValidation(err.data);

                        let message = self.$filter('translate')('xhr.'+method+'_campaign_brand_icon.warning');
                        self.Flash.create(flashMessageType, message);
                    }
                )
            }

        var queries = [];
        if (self.$scope.CampaignCtrl.campaignFiles) {
            self.$scope.fileValidate = [];
            angular.forEach(self.$scope.CampaignCtrl.campaignFiles, function (item, key) {

                if (item.file.name) {
                    queries.push(postCampaignImages(item, key))
                }

            })
        }

        if (self.$scope.campaignBrandIconFile) {
            self.$scope.brandIconFileValidate = null;
            queries.push(postCampaignBrandIcon());
        }

        if (queries.length>0) {
            self.$q.all(queries).then(function() {
                var failed = false;
                if (self.$scope.CampaignCtrl.campaignFiles && self.$scope.fileValidate.length) {
                    failed = true;
                }
                if (self.$scope.campaignBrandIconFile && self.$scope.brandIconFileValidate) {
                    failed = true;
                }

                if (failed) {
                    if (method == 'post') {
                        self.$state.go('admin.edit-campaign', {campaignId: campaignId});
                    } else {
                        self.loaderStates.coverLoader = false;
                    }
                } else {
                    if (method == 'post') {
                        self.$state.go('admin.single-campaign', {campaignId: campaignId});
                        let message = self.$filter('translate')('xhr.'+method+'_campaign.success');
                        self.Flash.create('success', message);
                    } else {
                        self.$state.go('admin.single-campaign', {campaignId: campaignId});
                        let message = self.$filter('translate')('xhr.'+method+'_campaign.success');
                        self.Flash.create('success', message);
                        self.loaderStates.campaignDetails = false;
                        self.loaderStates.coverLoader = false;
                    }
                }
            });

        } else {
            if (method == 'post') {
                self.$state.go('admin.campaign-list');
                let message = self.$filter('translate')('xhr.'+method+'_campaign.success');
                self.Flash.create('success', message);
            } else {
                self.$state.go('admin.single-campaign', {campaignId: campaignId});
                let message = self.$filter('translate')('xhr.'+method+'_campaign.success');
                self.Flash.create('success', message);
                self.loaderStates.campaignDetails = false;
                self.loaderStates.coverLoader = false;
            }
        }
    }


    /**
     * Obtains customers for campaign
     *
     * @method getCustomersForCampaign
     */
    getCustomersForCampaign() {
        let self = this;

        if (self.campaignId) {
            self.customersTableParams = new self.NgTableParams({
                count: self.config.perPage
            }, {
                getData: function (params) {
                    let dfd = self.$q.defer();
                    self.loaderStates.campaignCustomerList = true;

                    self.CampaignService.getVisibleCustomers(self.campaignId, self.ParamsMap.params(params.url()))
                        .then(
                            res => {
                                self.$scope.customers = res;
                                params.total(res.total);
                                dfd.resolve(res)
                                self.loaderStates.campaignCustomerList = false;
                                self.loaderStates.coverLoader = false;
                            },
                            () => {
                                let message = self.$filter('translate')('xhr.get_customers_for_campaign.error');
                                self.Flash.create('danger', message);
                                dfd.reject();
                                self.loaderStates.campaignCustomerList = false;
                                self.loaderStates.coverLoader = false;
                            }
                        );

                    return dfd.promise;
                }
            });
        } else {
            self.$state.go('admin.campaign-list');
            let message = self.$filter('translate')('xhr.get_customers_for_campaign.no_id');
            self.Flash.create('warning', message);
            self.loaderStates.campaignCustomerList = false;
        }
    }

    /**
     * Generating photo route
     *
     * @method generatePhotoRoute
     * @returns {string}
     */
    generatePhotoRoute() {
        return this.DataService.getConfig().apiUrl + '/campaign/' + this.$stateParams.campaignId + '/photo'
    }

    /**
     * Generating Campaing photo route
     *
     * @method generateCampaignPhotoRoute
     * @returns {string}
     */
    generateCampaignPhotoRoute(photoId) {
        return this.DataService.getConfig().apiUrl + '/campaign/' + this.$stateParams.campaignId + '/photo/' + photoId
    }

    /**
     * Generating brand icon route
     *
     * @method generateBrandIconRoute
     * @returns {string}
     */
    generateBrandIconRoute() {
        return this.DataService.getConfig().apiUrl + '/campaign/' + this.$stateParams.campaignId + '/brand_icon'
    }

    /**
     * Obtain all campaign data
     *
     * @method _getCampaign
     * @private
     */
    _getCampaign() {
        let self = this;

        self.CampaignService.getCampaign(self.campaignId)
            .then(
                res => {
                    self.$scope.campaign = res;
                    self.$scope.editableFields = self.EditableMap.humanizeCampaign(res);
                   
                    if (self.$scope.editableFields.levels && self.$scope.editableFields.levels.length) {
                        let levels = self.$scope.editableFields.levels;
                        for (let i in levels) {
                            let level = _.find(self.levels, {id: levels[i]});
                        }
                    }
                    if (self.$scope.editableFields.segments && self.$scope.editableFields.segments.length) {
                        let segments = self.$scope.editableFields.segments;
                        for (let i in segments) {
                            let segment = _.find(self.segments, {id: segments[i]});
                        }
                    }
                    if (self.$scope.editableFields.categories && self.$scope.editableFields.categories.length) {
                        let categories = self.$scope.editableFields.categories;
                        for (let i in categories) {
                            let category = _.find(self.categories, {id: categories[i]});
                        }
                    }
                    self.loaderStates.campaignDetails = false;

                    if (res.brandIcon) {
                        self.$scope.campaignBrandIconFilePath = true;
                        self.$scope.hasCampaignBrandIconFilePath = true;
                    }

                    if (self.$scope.editableFields.connectType) {
                        self.getConnectTypeEarningRule(self.$scope.editableFields.connectType);
                    }
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_campaign.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.campaignDetails = false;
                }
            );



    }


    /**
     * Obtain all category data
     *
     * @method _getCategory
     * @private
     */
    _getCategory() {
        let self = this;

        self.CampaignService.getCategory(self.campaignCategoryId)
            .then(
                res => {
                    self.$scope.category = res;
                    self.$scope.editableCategoryFields = self.EditableMap.humanizeCampaignCategory(res);
                    self.loaderStates.categoryDetails = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_campaign_category.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.categoryDetails = false;
                }
            );
    }


    /**
     * Get delivery statuses
     *
     * @method _getDeliveryStatuses
     * @private
     */
    getDeliveryStatuses() {
        let self = this;

        self.CampaignService.getDeliveryStatuses()
            .then(
                res => {
                    self.$scope.deliveryStatuses = res.choices;
                    this.deliveryStatusesSelectOptions.push({
                        value: '',
                        label: self.$filter('translate')('campaign.delivery_statuses.all')
                    });
                    for (var value of res.choices) {
                        self.deliveryStatusesHumanized.push({
                            value: value,
                            label: self.$filter('translate')(`campaign.delivery_statuses.${value}`)
                        });
                        self.deliveryStatusesSelectOptions.push({
                            value: value,
                            label: self.$filter('translate')(`campaign.delivery_statuses.${value}`)
                        });
                    }
                    self.loaderStates.deliveryStatuses = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_delivery_statuses.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.deliveryStatuses = false;
                }
            );
    }
    
    /**
    * Sets delivery status
    *
    * @param {Boolean} active
    * @param {string} status
    * @param {Integer} customerId
    * @param {Integer} couponId
    * @method setDeliveryStatus
    */
    setDeliveryStatus(status, customerId, couponId) {
        let self = this;

        self.CampaignService.putDeliveryStatus(status, customerId, couponId)
            .then(
                () => {
                    let message = self.$filter('translate')('xhr.put_change_delivery_status.success');
                    self.Flash.create('success', message);
                },
                () => {
                    let message = self.$filter('translate')('xhr.put_change_delivery_status.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Creates NgTable instances for redeemed campaigns page
     *
     * @method getRedeemedCampaigns
     */
    getRedeemedCampaigns() {
        let self = this;

        self.redeemedCampaignsTableParams = new self.NgTableParams({
            count: self.config.perPage,
            sorting: {
                purchasedAt: 'desc'
            }
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                let parsedParams = self.ParamsMap.params(params.url());

                if (parsedParams.purchasedAtFrom) {
                    parsedParams.purchasedAtFrom = new Date(decodeURIComponent(parsedParams.purchasedAtFrom));
                }

                if (parsedParams.purchasedAtTo) {
                    parsedParams.purchasedAtTo = new Date(decodeURIComponent(parsedParams.purchasedAtTo));
                }

                if (parsedParams.usageDateFrom) {
                    parsedParams.usageDateFrom = new Date(decodeURIComponent(parsedParams.usageDateFrom));
                }

                if (parsedParams.usageDateTo) {
                    parsedParams.usageDateTo = new Date(decodeURIComponent(parsedParams.usageDateTo));
                }

                self.loaderStates.redeemedCampaigns = true;
                self.CampaignService.getRedeemedCampaignRewards(parsedParams)
                    .then(
                        res => {
                            self.$scope.redeemedCampaigns = res;
                            self.loaderStates.redeemedCampaigns = false;
                            self.loaderStates.coverLoader = false;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_redeemed_campaigns.error');
                            self.loaderStates.redeemedCampaigns = false;
                            self.loaderStates.coverLoader = false;
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }


    /**
     * Update usage of single campaign
     *
     * @method updateCampaignUsage
     * @param {number} customerId
     * @param {number} campaignId
     * @param {number} couponId
     * @param {string} code
     * @param {Boolean} used
     */
    updateCampaignUsage(customerId, campaignId, code, couponId, used) {
        let self = this;
        self.CustomerService.postUsage(customerId, campaignId, code, couponId, used).then(
            () => {
                self.redeemedCampaignsTableParams.reload();
            },
            () => {
                let message = self.$filter('translate')('xhr.pos_coupon_usage.error');
                self.Flash.create('danger', message);

            }
        )
    }

    addLabel(edit) {
        if (edit) {
            if (!(this.$scope.editableFields.labels instanceof Array)) {
                this.$scope.editableFields.labels = [];
            }
            this.$scope.editableFields.labels.push({
                key: '',
                value: ''
            })
        } else {
            this.$scope.newCampaign.labels.push({
                key: '',
                value: ''
            })
        }
    }

    removeLabel(index, edit) {
        let self = this;
        let campaign;

        if (!edit) {
            campaign = self.$scope.newCampaign;
        } else {
            campaign = self.$scope.editableFields;
        }

        campaign.labels = _.difference(campaign.labels, [campaign.labels[index]])
    }

    downloadRedeemedCampaignsReportCSV(dateFrom = null, dateTo = null) {
        var self = this;
        let params = {};

        if (dateFrom) {
            params.purchasedAtFrom = dateFrom;
        }

        if (dateTo) {
            params.purchasedAtTo = dateTo;
        }

        self.CampaignService.getBoughtReport(params).then(function (response) {
            let file = new Blob([response], {type: 'text/csv'});
            self.downloadFile(file, 'report.csv');
        });
    }


    downloadFile(res, filename) {
        let self = this;

        let blob = new Blob([res], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob);
            return;
        }

        const data = window.URL.createObjectURL(blob);

        let link = document.createElement('a');
        link.href = data;
        link.download = filename;
        self.$timeout(function() { link.dispatchEvent(new MouseEvent('click')); }, 2000);
    }

    canBeBoughtManually(campaign) {
        return campaign.active && campaign.reward !== 'cashback' && campaign.reward !== 'custom_campaign_code';
    }

    activateBuyCampaignManuallyModal(campaignId, name, transactionId, reward) {
        this.$scope.buyCampaignManually.name = name;
        this.$scope.buyCampaignManually.campaignId = campaignId;
        this.$scope.buyCampaignManually.transactionId = transactionId;
        this.$scope.buyCampaignManually.reward = reward;
        this.$scope.buyCampaignManually.quantity = 1;
        this.$scope.buyCampaignManuallyModal = true;
    }

    buyCampaignManuallyByAdmin() {
        let self = this;
        self.loaderStates.addTransaction = true;

        if (self.$scope.buyCampaignManually.customerId) {
            self.CampaignService.postBuyCampaignManually(self.$scope.buyCampaignManually)
                .then(
                    () => {
                        let message = self.$filter('translate')('xhr.post_campaign_buy_manually_assign.success');
                        self.Flash.create('success', message);
                        this.$scope.buyCampaignManuallyModal = false;
                        self.loaderStates.buyCampaignManually = false;
                        self.tableParams.reload();
                    },
                    res => {
                        let message;
                        if (res.status === 400) {
                            message = self.$filter('translate')('xhr.post_campaign_buy_manually_assign.error_occurred') + ': ' + res.data.error;
                        } else {
                            message = self.$filter('translate')('xhr.post_campaign_buy_manually_assign.error');
                        }
                        self.Flash.create('danger', message);
                        this.$scope.buyCampaignManuallyModal = false;
                        self.loaderStates.buyCampaignManually = false;
                    }
                );
        }

    }

    _selectizeConfigs() {
        let self = this;
        this.$scope.clientSearch = 0; //0 - nothing, 1 - loading, 2 - nothing found

        this.campaignsUsageSelectOptions = [
            {
                value: '',
                label: self.$filter('translate')('campaign.usage_types.both')
            },
            {
                value: USAGE_TYPE_DELIVERED,
                label: self.$filter('translate')('campaign.usage_types.' + USAGE_TYPE_DELIVERED)
            },
            {
                value: USAGE_TYPE_USED,
                label: self.$filter('translate')('campaign.usage_types.' + USAGE_TYPE_USED)
            }
        ];


        this.campaignUsageSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.deliveryStatusSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.customersConfig = {
            valueField: 'customerId',
            render: {
                option: (item, escape) => {
                    return '<div>' + (item.email ? escape(item.email) : '') + ' (' + escape(item.phone) + ')</div>';
                },
                item: (item, escape) => {
                    return '<div>' + (item.email ? escape(item.email) : '') + ' (' + escape(item.phone) + ')</div>';
                }
            },
            create: false,
            sortField: 'email',
            maxItems: 1,
            searchField: ['phone', 'email'],
            placeholder: this.$filter('translate')('global.start_typing_an_email_or_phone'),
            onChange: () => {
                self.$scope.clientSearch = 0;
                self.transactionsToLink = [];
            },
            load: (query, callback) => {
                if (!query.length) return callback();

                self.$scope.clientSearch = 1;

                self.CustomerService.getCustomers(self.ParamsMap.params({
                    'filter[emailOrPhone]': query,
                    'filter[silenceQuery]': true
                }))
                    .then(
                        res => {
                            self.$scope.clientSearch = 0;
                            callback(res)
                        },
                        () => {
                            callback();
                        }
                    );

            }
        };

        this.transactionsConfig = {
            valueField: 'transactionId',
            labelField: 'documentNumber',
            create: false,
            sortField: 'documentNumber',
            maxItems: 1,
            searchField: 'documentNumber',
            placeholder: this.$filter('translate')('global.start_typing_a_number'),
            onChange: value => {
                self.$scope.documentSearch = 0;
            },
            load: (query, callback) => {
                if (!query.length) return callback();

                self.$scope.documentSearch = 1;

                self.TransactionService.getTransactions(self.ParamsMap.params({
                    'filter[documentNumber]': query,
                    'filter[customerId]': self.$scope.buyCampaignManually.customerId,
                    'filter[silenceQuery]': true
                }))
                    .then(
                        res => {
                            self.$scope.documentSearch = 0;
                            callback(res)
                        },
                        () => {
                            callback();
                        }
                    );

            }
        };
    }

    isTransactionRequired(type) {
        return this.CampaignService.campaignRequireTransaction.includes(type);
    }
}

CampaignController.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'AuthService', 'CampaignService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'Validation', '$filter', 'SegmentService', 'LevelService', 'DataService', 'CustomerService', 'TransactionService'];
