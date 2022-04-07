export default class SettingsController {
    constructor($scope, SettingsService, Flash, DataService, $filter, Validation, $translate, TranslationService) {
        let self = this;
        this.$scope = $scope;
        this.Flash = Flash;
        this.SettingsService = SettingsService;
        this.DataService = DataService;
        this.TranslationService = TranslationService;
        this.$filter = $filter;
        this.Validation = Validation;
        this.$translate = $translate;

        this.$scope.refresh = false;
        this.$scope.languages = this.DataService.getLanguages();
        this.$scope.availableFrontendTranslations = this.DataService.getAvailableFrontendTranslations();
        this.$scope.availableCustomerStatuses = this.DataService.getAvailableCustomerStatuses();
        this.$scope.availableAccountActivationMethods = this.DataService.getAvailableAccountActivationMethods();
        this.$scope.availableMarketingVendors = this.DataService.getAvailableMarketingVendors();
        this.$scope.availableMarketingVendorsConfig = this.DataService.getAvailableMarketingVendorsConfig();
        this.$scope.smsGatewayConfig = this.DataService.getSmsGatewayConfig();
        this.$scope.timezones = this.DataService.getTimezones();
        this.$scope.countries = this.DataService.getCountries();
        this.$scope.currencies = this.DataService.getCurrencies();
        this.$scope.validate = {};
        this.$scope.fileValidate = this.SettingsService.storedFileError;
        this.$scope.uploadsUrl = window.OpenLoyaltyConfig.apiUrl.replace('/api', '').replace('/app_dev.php', '');
        this.pointsExpireAfterOptions = this.DataService.getPointExpireAfter();
        this.pointExpireAfterConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'value',
            searchField: 'value',
            maxItems: 1,
        };
        this.currencyConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.languageConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.customerStatusesEarningConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: self.$scope.availableCustomerStatuses.length,
            persist: false,
            plugins: ['remove_button'],
            onChange: function (value) {
                if (!this.customerStatusesEarningValue) {
                    this.customerStatusesEarningValue = value;
                }
                if (this.customerStatusesEarningValue != value) {
                    self.$scope.refresh = true;
                }
                this.customerStatusesEarningValue = value;
            }
        };
        this.accountActivationMethodsConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
            onChange: function (value) {
                if (!this.accountActivationMethodValue) {
                    this.accountActivationMethodValue = value;
                }
                if (this.accountActivationMethodValue != value) {
                    self.$scope.refresh = true;
                }
                this.accountActivationMethodValue = value;
            }
        };
        this.marketingVendorsConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
            onChange: function (value) {
                if (!this.marketingVendorsValue) {
                    this.marketingVendorsValue = value;
                }
                if (this.marketingVendorsValue != value) {
                    self.$scope.refresh = true;
                }
                this.marketingVendorsValue = value;
            }
        };
        this.customerStatusesSpendingConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: self.$scope.availableCustomerStatuses.length,
            persist: false,
            plugins: ['remove_button'],
            onChange: function (value) {
                if (!this.customerStatusesSpendingValue) {
                    this.customerStatusesSpendingValue = value;
                }
                if (this.customerStatusesSpendingValue != value) {
                    self.$scope.refresh = true;
                }
                this.customerStatusesSpendingValue = value;
            }
        };
        this.timezoneConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.fieldConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.tierConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.downgradeModeConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.downgradeBaseConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.fields = [
            {
                name: 'loyaltyCardNumber',
                value: 'loyaltyCardNumber'
            },
            {
                name: 'email',
                value: 'email'
            },
            {
                name: 'phone',
                value: 'phone'
            }
        ];
        this.tiers = [
            {
                name: 'points',
                value: 'points'
            },
            {
                name: 'transactions',
                value: 'transactions'
            }
        ];
        this.downgradeModes = [
            {
                name: self.$filter('translate')('settings.level_downgrade.none'),
                value: 'none'
            },
            {
                name: self.$filter('translate')('settings.level_downgrade.automatic'),
                value: 'automatic'
            },
            {
                name: self.$filter('translate')('settings.level_downgrade.after_x_days'),
                value: 'after_x_days'
            }
        ];
        this.downgradeBases = [
            {
                name: self.$filter('translate')('settings.level_downgrade.active_points'),
                value: 'active_points'
            },
            {
                name: self.$filter('translate')('settings.level_downgrade.earned_points'),
                value: 'earned_points'
            },
            {
                name: self.$filter('translate')('settings.level_downgrade.earned_points_since_last_level_change'),
                value: 'earned_points_since_last_level_change'
            },
        ];
        this.egSkus = ['SKU123'];
        this.skusConfig = {
            delimiter: ',',
            plugins: ['remove_button'],
            persist: false,
            create: function (input) {
                return {
                    value: input,
                    text: input
                }
            }
        };

        this.loaderStates = {
            adminSettings: true,
            coverLoader: true
        };
    }

    /**
     * Generating logo route
     *
     * @method generateLogoRoute
     * @returns {string}
     */
    generateLogoRoute() {
        return this.DataService.getConfig().apiUrl + '/settings/photo/logo';
    }

    /**
     * Generating Client Cockpit small logo route
     *
     * @method generateSmallLogoRoute
     * @returns {string}
     */
    generateSmallLogoRoute() {
        return this.DataService.getConfig().apiUrl + '/settings/photo/small-logo';
    }

    /**
     * Generating Client Cockpit big logo route
     *
     * @method generateBigLogoRoute
     * @returns {string}
     */
    generateBigLogoRoute() {
        return this.DataService.getConfig().apiUrl + '/settings/photo/client-cockpit-logo-big';
    }
    /**
     * Generating Hero Image route
     *
     * @method generateLogoRoute
     * @returns {string}
     */
    generateHeroImageRoute() {
        return this.DataService.getConfig().apiUrl + '/settings/photo/hero-image';
    }

    /**
     * Deletes logo
     *
     * @method deleteLogo
     */
    deleteLogo() {
        let self = this;

        this.SettingsService.deleteLogo()
            .then(
                res => {
                    self.$scope.logoFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_settings_logo.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_settings_logo.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Deletes big logo
     *
     * @method deleteBigLogo
     */
    deleteBigLogo() {
        let self = this;

        this.SettingsService.deleteBigLogo()
            .then(
                res => {
                    self.$scope.bigLogoFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_settings_big_logo.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_settings_big_logo.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Deletes small logo
     *
     * @method deleteSmallLogo
     */
    deleteSmallLogo() {
        let self = this;

        this.SettingsService.deleteSmallLogo()
            .then(
                res => {
                    self.$scope.smallLogoFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_settings_small_logo.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_settings_small_logo.error');
                    self.Flash.create('danger', message);
                }
            )
    }


    /**
     * Deletes hero image
     *
     * @method deleteHeroImage
     */
    deleteConditionsFile() {
        let self = this;

        this.SettingsService.deleteConditionsFile()
            .then(
                res => {
                    self.$scope.conditionsFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_settings_conditions_file.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_settings_conditions_file.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Deletes hero image
     *
     * @method deleteHeroImage
     */
    deleteHeroImage() {
        let self = this;

        this.SettingsService.deleteHeroImage()
            .then(
                res => {
                    self.$scope.heroImageFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_settings_hero_image.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_settings_hero_image.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    getData() {
        let self = this;
        self.loaderStates.adminSettings = true;

        self.SettingsService.getSettingsData()
            .then(
                () => {
                    self.$scope.settings = self.SettingsService.getSettings();
                    self.$scope.settingsOld = angular.copy(self.$scope.settingsOld);
                    self.loaderStates.adminSettings = false;
                    self.loaderStates.coverLoader = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_settings.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.adminSettings = false;
                    self.loaderStates.coverLoader = false;
                }
            );
        self.SettingsService.getLogo()
            .then(
                res => {
                    self.$scope.logoFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.logoFilePath = false;
                }
            );

        self.SettingsService.getBigLogo()
            .then(
                res => {
                    self.$scope.bigLogoFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.bigLogoFilePath = false;
                }
            );

        self.SettingsService.getSmallLogo()
            .then(
                res => {
                    self.$scope.smallLogoFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.smallLogoFilePath = false;
                }
            );

        self.SettingsService.getHeroImage()
            .then(
                res => {
                    self.$scope.heroImageFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.heroImageFilePath = false;
                }
            );

        self.SettingsService.getConditionsUrl()
            .then(
                res => {
                    self.$scope.conditionsFileUrl = res.url;
                }
            )
            .catch(
                err => {
                    self.$scope.conditionsFileUrl = null;
                }
            );

        self.SettingsService.getConditionsFile()
            .then(
                res => {
                    self.$scope.conditionsFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.conditionsFilePath = false;
                }
            );
    }

    editSettings(settings) {
        let self = this;
        if (settings.accountActivationMethod === 'sms') {
            let errors = 0;
            for (let i = 0; i < self.$scope.smsGatewayConfig.length; i += 1) {
                if (!settings[self.$scope.smsGatewayConfig[i].name]) {
                    self.$scope.validate[self.$scope.smsGatewayConfig[i].name] = { errors: [self.$filter('translate')('front_error.not_blank')] };
                    errors += 1;
                } else {
                    self.$scope.validate[self.$scope.smsGatewayConfig[i].name] = {};
                }
            }
            if (errors === self.$scope.smsGatewayConfig.length && errors > 0) {
                let message = self.$filter('translate')('xhr.put_settings.error');
                self.Flash.create('danger', message);

                return;
            }
        }
        if (settings.marketingVendorsValue !== 'none') {
            let errors = 0;
            self.$scope.validate = {};
            self.$scope.validate[settings.marketingVendorsValue] = {};
            for (let i = 0; i < self.$scope.availableMarketingVendorsConfig[settings.marketingVendorsValue].length; i += 1) {
                if (!settings[settings.marketingVendorsValue] || !settings[settings.marketingVendorsValue][self.$scope.availableMarketingVendorsConfig[settings.marketingVendorsValue][i].name]) {
                    self.$scope.validate[settings.marketingVendorsValue][self.$scope.availableMarketingVendorsConfig[settings.marketingVendorsValue][i].name] = { errors: [self.$filter('translate')('front_error.not_blank')] };
                    errors += 1;
                } else {
                    self.$scope.validate[settings.marketingVendorsValue][self.$scope.availableMarketingVendorsConfig[settings.marketingVendorsValue][i].name] = {};
                }
            }
            if (errors === self.$scope.availableMarketingVendorsConfig[settings.marketingVendorsValue].length && errors > 0) {
                let message = self.$filter('translate')('xhr.put_settings.error');
                self.Flash.create('danger', message);

                return;
            }
        }
        self.SettingsService.postSettings(settings)
            .then(
                res => {
                    let postChain = [1];
                    let errors = [];

                    if (self.$scope.logoFile) {
                        self.$scope.fileValidate = {};
                        postChain.push(
                            self.SettingsService.postLogo(self.$scope.logoFile)
                                .catch(
                                    err => {
                                        self.$scope.fileValidate = self.Validation.mapSymfonyValidation(err.data);
                                        let message = self.$filter('translate')('xhr.upload_settings_logo.error');
                                        errors.push(message);
                                        self.Flash.create('danger', message);
                                        self.loaderStates.coverLoader = false;
                                    }
                                )
                        );
                        self.$scope.refresh = true;
                    }

                    if (self.$scope.bigLogoFile) {
                        self.$scope.bigLogoValidate = {};
                        postChain.push(
                            self.SettingsService.postBigLogo(self.$scope.bigLogoFile)
                                .catch(
                                    err => {
                                        self.$scope.bigLogoValidate = self.Validation.mapSymfonyValidation(err.data);
                                        let message = self.$filter('translate')('xhr.upload_settings_big_logo.error');
                                        errors.push(message);
                                        self.Flash.create('danger', message);
                                        self.loaderStates.coverLoader = false;
                                    }
                                )
                        );
                        self.$scope.refresh = true;
                    }

                    if (self.$scope.smallLogoFile) {
                        self.$scope.smallLogoValidate = {};
                        postChain.push(
                            self.SettingsService.postSmallLogo(self.$scope.smallLogoFile)
                                .catch(
                                    err => {
                                        self.$scope.smallLogoValidate = self.Validation.mapSymfonyValidation(err.data);
                                        let message = self.$filter('translate')('xhr.upload_settings_small_logo.error');
                                        errors.push(message);
                                        self.Flash.create('danger', message);
                                        self.loaderStates.coverLoader = false;
                                    }
                                )
                        );
                        self.$scope.refresh = true;
                    }

                    if (self.$scope.heroImageFile) {
                        self.$scope.heroImageValidate = {};
                        postChain.push(
                            self.SettingsService.postHeroImage(self.$scope.heroImageFile)
                                .catch(
                                    err => {
                                        self.$scope.heroImageValidate = self.Validation.mapSymfonyValidation(err.data);
                                        let message = self.$filter('translate')('xhr.upload_settings_hero_image.error');
                                        errors.push(message);
                                        self.Flash.create('danger', message);
                                        self.loaderStates.coverLoader = false;
                                    }
                                )
                        );
                        self.$scope.refresh = true;
                    }

                    if (self.$scope.conditionsFile) {
                        self.$scope.conditionsFileValidate = {};
                        self.$scope.refresh = true;
                        postChain.push(
                            self.SettingsService.postConditionsFile(self.$scope.conditionsFile)
                                .catch(
                                    err => {
                                        self.$scope.conditionsFileValidate = self.Validation.mapSymfonyValidation(err.data);
                                        let message = self.$filter('translate')('xhr.upload_settings_conditions_file.error');
                                        errors.push(message);
                                        self.Flash.create('danger', message);
                                        self.loaderStates.coverLoader = false;
                                    }
                                )
                        );
                    }

                    Promise.all(postChain).then(function (values) {
                        let message = self.$filter('translate')('xhr.put_settings.success');
                        self.Flash.create('success', message);
                        self.$scope.validate = {};
                        self.$scope.settings = res.settings;
                        self.TranslationService.removeStoredTranslations();
                        self.$translate.refresh();
                        self.$scope.settingsOld = angular.copy(self.$scope.settings);

                        if (errors.length == 0 && self.$scope.refresh) {
                            window.location.reload(true);
                        }
                    });
                },
                (res) => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.put_settings.error');
                    self.Flash.create('danger', message);
                }
            );
    }

    removeIdentificationPriority(index) {
        let self = this;

        self.$scope.settings.customersIdentificationPriority = _.difference(self.$scope.settings.customersIdentificationPriority, [self.$scope.settings.customersIdentificationPriority[index]])
    }

    addIdentificationPriority() {
        let self = this;
        if (!self.$scope.settings.customersIdentificationPriority) {
            self.$scope.settings.customersIdentificationPriority = []
        }

        self.$scope.settings.customersIdentificationPriority.push({})
    }

}

SettingsController.$inject = ['$scope', 'SettingsService', 'Flash', 'DataService', '$filter', 'Validation', '$translate', 'TranslationService'];
