export default class SellerCustomerController {
    constructor($scope, $state, $stateParams, SellerCustomerService, Flash, $filter, DataService, Validation, EditableMap, $q, ParamsMap, NgTableParams, AuthService, TransferService) {
        this.$scope = $scope;
        this.sellerId = AuthService.getLoggedUserId();
        this.$scope.newCustomer = {labels: []};
        this.$scope.editableFields = {};
        this.$scope.newLevel = {};
        this.$scope.newPos = {};
        this.$scope.validate = {};
        this.$scope.dateNow = new Date();
        this.$state = $state;
        this.SellerCustomerService = SellerCustomerService;
        this.Flash = Flash;
        this.$scope.token = {};
        this.$filter = $filter;
        this.country = DataService.getCountries();
        this.EditableMap = EditableMap;
        this.Validation = Validation;
        this.TransferService = TransferService;
        this.transferTypeConfig = this.TransferService.getTransferTypeConfig();
        this.transferType = this.TransferService.getTransferType();
        this.activationMethod = null;
        SellerCustomerService.getPosSeller(this.sellerId).then((method) => {
            this.allowPointTransfer = method.allowPointTransfer;
        });
        DataService.getActivationMethod().then((method) => {
            this.activationMethod = method;
        });
        this.$scope.addressValidation = {
            street: '@assert:not_blank',
            address1: '@assert:not_blank',
            postal: '@assert:not_blank',
            country: '@assert:not_blank',
            city: '@assert:not_blank',
        };
        this.$scope.companyValidation = {
            nip: '@assert:not_blank',
            name: '@assert:not_blank'
        };
        this.$scope.frontValidate = {
            firstName: '@assert:not_blank',
            lastName: '@assert:not_blank',
            agreement1: '@assert:not_blank',
        };
        this.customerId = $stateParams.customerId || null;
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.levelsConfig = {
            valueField: 'id',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.posConfig = {
            valueField: 'posId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.$scope.search = {};
        this.ParamsMap = ParamsMap;
        this.$scope.searchCustomerValidate = {
            loyaltyCardNumber: '@assert:one_from:phone:email:firstName:lastName:city:postcode',
            phone: '@assert:one_from:loyaltyCardNumber:email:firstName:lastName:city:postcode',
            email: '@assert:one_from:phone:loyaltyCardNumber:firstName:lastName:city:postcode',
            firstName: '@assert:one_from:phone:email:loyaltyCardNumber:city:postcode:lastName',
            lastName: '@assert:one_from:phone:email:loyaltyCardNumber:city:postcode:firstName',
            city: '@assert:one_from:phone:email:firstName:lastName:loyaltyCardNumber:postcode',
            postcode: '@assert:one_from:phone:email:firstName:lastName:city:loyaltyCardNumber'
        };
        this.NgTableParams = NgTableParams;
        this.$scope.customers = null;
        this.$q = $q;
        this.loaderVisible = {
            addTransfer: false,
            editCustomer: true,
            singleCustomer: true
        };

        if (this.customerId && this.$state.current.name === 'seller.panel.single-customer') {
            let self = this;

            $scope.$watch('customer', function () {
                if ($scope.customer && $scope.customer.levelId) {
                    self.getAssignedLevel($scope.customer.levelId);
                    self.getAvailableLevels();
                } else {
                    self.getAvailableLevels();
                }
                if ($scope.customer && $scope.customer.posId) {
                    self.getAssignedPos($scope.customer.posId);
                    self.getAvailablePos();
                } else {
                    self.getAvailablePos();
                }
            }, true)
        }
    }
    resendActivationCode(id) {
        let self = this;
        if (!self.isActivationBySms()) {
            return;
        }
        this.SellerCustomerService.resendActivationCode(id).then(
            res => {
                let message = self.$filter('translate')('xhr.post_resend_activation_code.success');
                self.Flash.create('success', message);
                self.$state.go('seller.panel.customer-registration.activation', {customerId: id})
            },
            () => {
                let message = self.$filter('translate')('xhr.post_activate_customer.error');
                self.Flash.create('danger', message);
            }
        )
    }
    activateCustomer(token) {
        let self = this;
        this.SellerCustomerService.activateCustomer(this.customerId, token.value).then(
            res => {
                let message = self.$filter('translate')('xhr.post_activate_customer.success');
                self.Flash.create('success', message);
                self.$state.go('seller.panel.dashboard')
            },
            () => {
                let message = self.$filter('translate')('xhr.post_activate_customer.error');
                self.Flash.create('danger', message);
            }
        )
    }
    isActivationBySms() {
        return this.activationMethod === 'sms';
    }

    isActivationByEmail() {
        return this.activationMethod === 'email';
    }
    deactivateCustomer(customerId) {
        let self = this;

        self.SellerCustomerService.deactivateCustomer(customerId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
                    self.Flash.create('success', message);
                    self.find();
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    addCustomer(newCustomer) {
        let self = this;
        let validateFields = angular.copy(self.$scope.frontValidate);

        if (self.$scope.showAddress) {
            validateFields.address = angular.copy(self.$scope.addressValidation);
        } else {
            delete self.$scope.newCustomer.address;
        }
        if (self.$scope.showCompany) {
            validateFields.company = angular.copy(self.$scope.companyValidation);
        } else {
            delete self.$scope.newCustomer.company;
        }

        let frontValidation = self.Validation.frontValidation(newCustomer, validateFields);
        if (_.isEmpty(frontValidation)) {
            self.SellerCustomerService.postCustomer(newCustomer)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.post_registration_customer.success');
                        self.Flash.create('success', message);
                        if (self.isActivationBySms()) {
                            self.$state.go('seller.panel.customer-registration.activation', {customerId: res.customerId})
                        } else {
                            self.$state.go('seller.panel.dashboard')
                        }
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.post_registration_customer.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.post_registration_customer.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }

    getTransactionsData() {
        let self = this;

        self.transactionsTableParams = new self.NgTableParams({}, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.SellerCustomerService.getCustomerTransactions(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.customerTransactions = res;
                            params.total(res.total);
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_translations.error');
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getTransfersData() {
        let self = this;

        self.transfersTableParams = new self.NgTableParams({}, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.SellerCustomerService.getCustomerTransfers(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.customerTransfers = res;
                            params.total(res.total);
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_transfers.error');
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getCampaignsData() {
        let self = this;

        self.availableCampaignsTableParams = new self.NgTableParams({}, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.SellerCustomerService.getCustomerAvailableCampaigns(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.availableCampaigns = res;
                            params.total(res.total);
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_available_campaigns.error');
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getRewardsData() {
        let self = this;

        self.boughtCampaignsTableParams = new self.NgTableParams({}, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.SellerCustomerService.getCustomerBoughtCampaigns(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.boughtCampaigns = res;
                            params.total(res.total);
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_bought_campaigns.error');
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }



    getCustomerData() {
        let self = this;

        if (self.customerId) {
            self.SellerCustomerService.getCustomer(self.customerId)
                .then(
                    res => {
                        self.$scope.customer = res;
                        self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                        self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
                        self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
                        self.loaderVisible.editCustomer = false;
                        self.loaderVisible.singleCustomer = false;
                    },
                    () => {
                        self.$state.go('seller.panel.customer-search');
                        let message = self.$filter('translate')('xhr.get_customer.cant_edit');
                        self.Flash.create('danger', message);
                        self.loaderVisible.editCustomer = false;
                        self.loaderVisible.singleCustomer = false;

                    }
                );
            self.SellerCustomerService.getCustomerStatus(self.customerId)
                .then(
                    res => {
                        self.$scope.status = res;
                    },
                    () => {
                        let message = self.$filter('translate')('xhr.get_customer.error');
                        self.Flash.create('danger', message);
                    }
                );
            self.getTransactionsData();
            self.getTransfersData();
            self.getCampaignsData();
            self.getRewardsData();
        } else {
            self.$state.go('seller.panel.dashboard');
            let message = self.$filter('translate')('xhr.get_customer.no_id');
            self.Flash.create('warning', message);
        }
    }

    editCustomer(editedCustomer) {
        let self = this;
        let validateFields = angular.copy(self.$scope.frontValidate);

        if (self.$scope.showAddress) {
            validateFields.address = angular.copy(self.$scope.addressValidation);
        } else {
            delete self.$scope.editableFields.address;
        }
        if (self.$scope.showCompany) {
            validateFields.company = angular.copy(self.$scope.companyValidation);
        } else {
            delete self.$scope.editableFields.company;
        }

        let frontValidation = self.Validation.frontValidation(editedCustomer, validateFields);
        if (_.isEmpty(frontValidation)) {
            self.SellerCustomerService.putCustomer(editedCustomer)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.put_customer.success');
                        self.Flash.create('success', message);
                        self.$state.go('seller.panel.dashboard');
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.put_customer.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.post_customer.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }

    getAvailableLevels() {
        let self = this;

        self.SellerCustomerService.getLevels()
            .then(
                res => {
                    self.$scope.availableLevels = res;
                    self.levels = res;
                },
                () => {
                    let messagsearchCustomerValidatee = self.$filter('translate')('xhr.get_levels.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    getAvailablePos() {
        let self = this;

        self.SellerCustomerService.getPosList()
            .then(
                res => {
                    self.$scope.availablePos = res;
                    self.posList = res;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_pos_list.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    getAssignedPos(posId) {
        let self = this;

        self.SellerCustomerService.getPos(posId)
            .then(
                res => {
                    self.$scope.assignedPos = res;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_pos_list.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    getAssignedLevel(levelId) {
        let self = this;

        if (!levelId) {
            return;
        }

        self.SellerCustomerService.getLevel(levelId)
            .then(
                res => {
                    self.$scope.assignedLevel = res;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_level.error');
                    self.Flash.create('danger', message);
                }
            )

    }

    find() {
        let self = this;
        self.$scope.validate = {};
        let validateFields = angular.copy(self.$scope.searchCustomerValidate);
        let frontValidation = self.Validation.frontValidation(self.$scope.search, validateFields);

        if (_.isEmpty(frontValidation)) {
            if (self.$scope.search) {
                self.SellerCustomerService.search(self.$scope.search)
                    .then(
                        (res) => {
                            if(!res.customers.length) {
                                let message = self.$filter('translate')('xhr.customer_search.nothing_found');
                                self.Flash.create('warning', message);
                            } else {
                                let message = self.$filter('translate')('xhr.customer_search.success');
                                self.Flash.create('success', message);
                            }
                            self.$scope.customers = res.customers;
                        },
                        res => {
                            if (res.data.error && res.data.error == 'to many results') {
                                let message = self.$filter('translate')('xhr.customer_search.to_many_results');
                                self.Flash.create('danger', message);
                            } else {
                                self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                                let message = self.$filter('translate')('xhr.customer_search.error');
                                self.Flash.create('danger', message);
                                self.$scope.customers = null;
                            }
                        }
                    );
            }
        } else {
            let message = self.$filter('translate')('xhr.customer_search.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
        }
    }

    assignPos(newPos) {
        let self = this;

        self.SellerCustomerService.postPos(self.$scope.customer, newPos.posId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_pos.success');
                    self.Flash.create('success', message);
                    self.getCustomerData();
                    self.showAvailablePosModal = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_pos.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    assignLevel(newLevel) {
        let self = this;

        self.SellerCustomerService.postLevel(self.$scope.customer, newLevel.id)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_level.success');
                    self.Flash.create('success', message);
                    self.getCustomerData();
                    self.showAvailableLevelsModal = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_level.error');
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
            this.$scope.newCustomer.labels.push({
                key: '',
                value: ''
            })
        }
    }

    removeLabel(index, edit) {
        let self = this;
        let customer;

        if (!edit) {
            customer = self.$scope.newCustomer;
        } else {
            customer = self.$scope.editableFields;
        }

        customer.labels = _.difference(customer.labels, [customer.labels[index]])
    }

    openTransferModal() {
        let self = this;

        self.$scope.newTransfer = {};
        self.$scope.showTransferModal = true;
    }

    closeTransferModal() {
        let self = this;
        self.$scope.showTransferModal = false;
    }

    transferPoints(newTransfer, type) {
        let self = this;
        self.loaderVisible.addTransfer = true;

        Object.assign(newTransfer, {
            'customer':this.customerId
        });

        switch (type) {
            case 'add':
                self.SellerCustomerService.postPosAddTransfer(newTransfer)
                    .then(
                        res => {
                            let message = self.$filter('translate')('xhr.post_add_transfer.success');
                            self.Flash.create('success', message);
                            self.transfersTableParams.reload();
                            self.closeTransferModal();
                            self.$scope.validate = {};
                            self.loaderVisible.addTransfer = false;
                        },
                        res => {
                            self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                            let message = self.$filter('translate')('xhr.post_add_transfer.error');
                            self.Flash.create('danger', message);
                            self.loaderVisible.addTransfer = false;
                        }
                    );
                break;
            case 'spend':
                self.SellerCustomerService.postPosSpendTransfer(newTransfer)
                    .then(
                        res => {
                            let message = self.$filter('translate')('xhr.post_spend_transfer.success');
                            self.Flash.create('success', message);
                            self.transfersTableParams.reload();
                            self.closeTransferModal();
                            self.$scope.validate = {};
                            self.loaderVisible.addTransfer = false;
                        },
                        res => {
                            self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                            let message = self.$filter('translate')('xhr.post_spend_transfer.error');
                            self.Flash.create('danger', message);
                            self.loaderVisible.addTransfer = false;
                        }
                    );
                break;
            default:
                self.loaderVisible.addTransfer = false;
                break;
        }
    }
}

SellerCustomerController.$inject = ['$scope', '$state', '$stateParams', 'SellerCustomerService', 'Flash', '$filter', 'DataService', 'Validation', 'EditableMap', '$q', 'ParamsMap', 'NgTableParams', 'AuthService', 'TransferService'];
