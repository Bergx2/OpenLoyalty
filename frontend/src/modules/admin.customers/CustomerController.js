export default class CustomerController {
    constructor($scope, $state, $stateParams, AuthService, CustomerService, Flash, EditableMap, NgTableParams, ParamsMap, $q, LevelService, Validation, $filter, DataService, PosService, TransferService, SellerService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }

        this.$scope = $scope;
        this.TransferService = TransferService;
        this.transferTypeConfig = this.TransferService.getTransferTypeConfig();
        this.transferType = this.TransferService.getTransferType();
        this.$scope.dateNow = new Date();
        this.$scope.newCustomer = {labels: []};
        this.$scope.newLevel = {};
        this.$scope.newPos = {};
        this.$scope.showCompany = false;
        this.$scope.showAddress = false;
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
        this.levels = null;
        this.posList = null;
        this.$state = $state;
        this.AuthService = AuthService;
        this.SellerService = SellerService;
        this.CustomerService = CustomerService;
        this.Flash = Flash;
        this.EditableMap = EditableMap;
        this.customerId = $stateParams.customerId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.$q = $q;
        this.LevelService = LevelService;
        this.Validation = Validation;
        this.$filter = $filter;
        this.PosService = PosService;
        this.country = DataService.getCountries();
        this.config = DataService.getConfig();
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
        this.sellerConfig = {
            valueField: 'sellerId',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        if (this.customerId && this.$state.current.name === 'admin.single-customer') {
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
                if ($scope.customer && $scope.customer.sellerId) {
                    self.getAssignedSeller($scope.customer.sellerId);
                }
            }, true)
        }

        this.loaderStates = {
            customerTabs: true,
            customerDetails: true,
            customerList: true,
            customerReferredList: true,
            customerPOS: true,
            customerLevel: true,
            campaignList: true,
            rewardList: true,
            transactionList: true,
            transferList: true,
            coverLoader: true,
            cancelTransfer: false,
            assignLevel: false,
            assignPos: false,
            deactivateCustomer: false,
            addTransfer: false
        }

        this.referredStatusSelectOptions = [{
            value: '',
            label: $filter('translate')('customer.referred.statuses.all')
        },
            {
                value: 'invited',
                label: $filter('translate')('customer.referred.statuses.invited')
            },
            {
                value: 'registered',
                label: $filter('translate')('customer.referred.statuses.registered')
            },
            {
                value: 'made_purchase',
                label: $filter('translate')('customer.referred.statuses.made_purchase')
            }
        ];

        this.referredStatusSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };
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
        self.loaderStates.addTransfer = true;

        Object.assign(newTransfer, {
            'customer':this.customerId
        });

        switch (type) {
            case 'add':
                self.TransferService.postAddTransfer(newTransfer)
                    .then(
                        res => {
                            let message = self.$filter('translate')('xhr.post_add_transfer.success');
                            self.Flash.create('success', message);
                            self.transfersTableParams.reload();
                            self.closeTransferModal();
                            self.$scope.validate = {};
                            self.loaderStates.addTransfer = false;
                        },
                        res => {
                            self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                            let message = self.$filter('translate')('xhr.post_add_transfer.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.addTransfer = false;
                        }
                    );
                break;
            case 'spend':
                self.TransferService.postSpendTransfer(newTransfer)
                    .then(
                        res => {
                            let message = self.$filter('translate')('xhr.post_spend_transfer.success');
                            self.Flash.create('success', message);
                            self.transfersTableParams.reload();
                            self.closeTransferModal();
                            self.$scope.validate = {};
                            self.loaderStates.addTransfer = false;
                        },
                        res => {
                            self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                            let message = self.$filter('translate')('xhr.post_spend_transfer.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.addTransfer = false;
                        }
                    );
                break;
            default:
                self.loaderStates.addTransfer = false;
                break;
        }
    }

    getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage,
            sorting: {
                createdAt: 'desc'
            }
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.customerList = true;
                self.CustomerService.getCustomers(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.loaderStates.customerList = false;
                            self.loaderStates.coverLoader = false;
                            self.$scope.customers = res;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getReferredData() {
        let self = this;

        self.referredTableParams = new self.NgTableParams({
            count: self.config.perPage,
            sorting: {
                createdAt: 'desc'
            }
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.customerReferredList = true;
                self.CustomerService.getReferredCustomers(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.referredTotal = res.total;
                            self.referredCompleted = res.additional ? res.additional.totalCompleted: '';
                            self.referredRegistered = res.additional ? res.additional.totalRegistered: '';
                            self.loaderStates.customerReferredList = false;
                            self.loaderStates.coverLoader = false;
                            self.$scope.referredCustomers = res;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_referred_customers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerReferredList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    cancelTransfer(transferId) {
        let self = this;
        this.loaderStates.cancelTransfer = true;

        self.TransferService.postCancelTransfer(transferId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_cancel_transfer.success');
                    self.Flash.create('success', message);
                    self.getTransfersData();
                    this.loaderStates.cancelTransfer = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_cancel_transfer.error');
                    self.Flash.create('danger', message);
                    this.loaderStates.cancelTransfer = false;
                }
            )
    }

    getTransactionsData() {
        let self = this;

        self.transactionsTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.transactionList = true;
                self.CustomerService.getCustomerTransactions(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.customerTransactions = res;
                            params.total(res.total);
                            self.loaderStates.transactionList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_translations.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.transactionList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getTransfersData() {
        let self = this;

        self.transfersTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.transferList = true;
                self.CustomerService.getCustomerTransfers(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.customerTransfers = res;
                            params.total(res.total);
                            self.loaderStates.transferList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_transfers.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.transferList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getCampaignsData() {
        let self = this;

        self.availableCampaignsTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.campaignList = true;
                self.CustomerService.getCustomerAvailableCampaigns(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.availableCampaigns = res;
                            params.total(res.total);
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_available_campaigns.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getRewardsData() {
        let self = this;

        self.boughtCampaignsTableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.rewardList = true;
                self.CustomerService.getCustomerBoughtCampaigns(self.ParamsMap.params(params.url()), self.customerId)
                    .then(
                        res => {
                            self.$scope.boughtCampaigns = res;
                            params.total(res.total);
                            self.loaderStates.rewardList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_bought_campaigns.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.rewardList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getCustomerData() {
        let self = this;

        self.loaderStates.customerDetails = true;

        if (self.customerId) {
            self.$q.all([
                self.CustomerService.getCustomer(self.customerId)
                    .then(
                        res => {
                            self.$scope.customer = res;
                            self.$scope.editableFields = self.EditableMap.humanizeCustomer(res);
                            self.$scope.showAddress = !(_.isEmpty(self.$scope.editableFields.address));
                            self.$scope.showCompany = !(_.isEmpty(self.$scope.editableFields.company));
                            self.loaderStates.customerDetails = false;
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customer.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.customerDetails = false;
                        }
                    ),

                self.CustomerService.getCustomerStatus(self.customerId)
                    .then(
                        res => {
                            self.$scope.status = res;
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_customer.error');
                            self.Flash.create('danger', message);
                        }
                    ),
                self.getTransactionsData(),
                self.getTransfersData(),
                self.getCampaignsData(),
                self.getRewardsData(),
            ])
                .then(
                    () => {
                        this.loaderStates.coverLoader = false;
                    }
                );
        } else {
            self.$state.go('admin.customers-list');
            let message = self.$filter('translate')('xhr.get_customer.no_id');
            self.Flash.create('warning', message);
        }
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
            self.CustomerService.postCustomer(self.EditableMap.newCustomer(newCustomer))
                .then(
                    res => {
                        self.$state.go('admin.customers-list');
                        let message = self.$filter('translate')('xhr.post_customer.success');
                        self.Flash.create('success', message);

                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.post_customer.error');
                        self.Flash.create('danger', message);
                    }
                )
        } else {
            let message = self.$filter('translate')('xhr.post_customer.error');
            self.Flash.create('danger', message);
            self.$scope.validate = frontValidation;
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

        // sets as an empty string if data has been removed
        for (let property in editedCustomer) {
            if (editedCustomer.hasOwnProperty(property)) {
                if (typeof self.$scope.editableFields[property] === 'undefined' ||
                    self.$scope.editableFields[property] === ''
                ) {
                    editedCustomer[property] = '';
                    self.$scope.editableFields[property] = '';
                }
            }
        }

        let frontValidation = self.Validation.frontValidation(editedCustomer, validateFields);
        if (_.isEmpty(frontValidation)) {
            self.CustomerService.putCustomer(editedCustomer)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.put_customer.success');
                        self.Flash.create('success', message);
                        self.$state.go('admin.single-customer', {customerId: res.customerId});
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

    getAssignedLevel(levelId) {
        let self = this;

        if (!levelId) {
            return;
        }

        self.loaderStates.customerLevel = true;

        self.LevelService.getLevel(levelId)
            .then(
                res => {
                    self.$scope.assignedLevel = res;
                    self.loaderStates.customerLevel = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_level.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerLevel = false;
                }
            )

    }

    getAvailableLevels() {
        let self = this;

        self.LevelService.getLevels({perPage:-1})
            .then(
                res => {
                    self.$scope.availableLevels = [];
                    let tmp = 0;
                    for (var i in res) {
                        if (!res.hasOwnProperty(i)) {
                            continue;
                        }
                        if (res[i] && res[i].active) {
                            tmp++;
                            self.$scope.availableLevels.push(res[i]);
                        }
                    }
                    self.$scope.availableLevels.total = tmp;
                    self.levels = res;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_levels.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    getAvailablePos() {
        let self = this;

        self.loaderStates.customerPOS = true;

        self.PosService.getPosList()
            .then(
                res => {
                    self.$scope.availablePos = res;
                    self.posList = res;
                    self.loaderStates.customerPOS = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_pos_list.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerPOS = false;
                }
            )
    }

    getAvailableSellers() {
        let self = this;

        self.loaderStates.customerSeller = true;

        self.SellerService.getSellers()
            .then(
                res => {
                    self.$scope.availableSellers = res;
                    self.sellersList = res;
                    self.loaderStates.customerSeller = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_seller_list.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerSeller = false;
                }
            )
    }

    getAssignedPos(posId) {
        let self = this;

        self.loaderStates.customerPOS = true;

        self.PosService.getPos(posId)
            .then(
                res => {
                    self.$scope.assignedPos = res;
                    self.loaderStates.customerPOS = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_pos_list.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerPOS = false;
                }
            )
    }
    getAssignedSeller(sellerId) {
        let self = this;

        self.loaderStates.customerSeller = true;

        self.SellerService.getSeller(sellerId)
            .then(
                res => {
                    self.$scope.assignedSeller = res;
                    self.loaderStates.customerSeller = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_seller_list.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.customerSeller = false;
                }
            )
    }

    assignPos(newPos) {
        let self = this;
        self.loaderStates.assignPos = true;

        self.CustomerService.postPos(self.$scope.customer, newPos.posId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_pos.success');
                    self.Flash.create('success', message);
                    self.getCustomerData();
                    self.showAvailablePosModal = false;
                    self.loaderStates.assignPos = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_pos.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.assignPos = false;
                }
            )
    }

    updateCouponUsage(customerId, campaignId, code, couponId, used) {
        let self = this;
        self.CustomerService.postUsage(customerId, campaignId, code, couponId, used).then(
            res => {
                self.getRewardsData();
            },
            res => {
                let message = self.$filter('translate')('xhr.pos_coupon_usage.error');
                self.Flash.create('danger', message);

            }
        )
    }

    deactivateCustomer(customerId) {
        let self = this;
        self.loaderStates.deactivateCustomer = true;

        self.CustomerService.deactivateCustomer(customerId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.success');
                    self.Flash.create('success', message);
                    self.getData();
                    self.loaderStates.deactivateCustomer = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_deactivate_customer.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.deactivateCustomer = false;
                }
            )
    }

    activateCustomer(customerId) {
        let self = this;

        self.CustomerService.activateCustomer(customerId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_activate_customer.success');
                    self.Flash.create('success', message);
                    self.getData();
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_customer.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    assignLevel(newLevel) {
        let self = this;
        self.loaderStates.assignLevel = true;

        self.CustomerService.postLevel(self.$scope.customer, newLevel.id)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_level.success');
                    self.Flash.create('success', message);
                    self.getCustomerData();
                    self.showAvailableLevelsModal = false;
                    self.loaderStates.assignLevel = false
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_level.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.assignLevel = false
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

    removeManuallyLevel(customerId, fromList) {
        let self = this;

        self.CustomerService.removeManuallyLevel(customerId)
            .then(
                res => {
                        let message = self.$filter('translate')('xhr.post_remove_customer_manually_level.success');
                    self.Flash.create('success', message);
                    if (fromList) {
                        self.getData();
                    } else {
                        self.getCustomerData();
                    }
                },
                    () => {
                        let message = self.$filter('translate')('xhr.post_remove_customer_manually_level.error');
                        self.Flash.create('danger', message);
                    }
                )
    }

    importCustomers(file) {
        let self = this;

        if (file) {
            self.loaderStates.importCustomers = true;
            self.CustomerService.postImportCustomers(file)
                .then(
                    res => {
                if (res.totalProcessed == 0) {
                let message = self.$filter('translate')('xhr.import.no_data');
                self.Flash.create('warning', message);
            } else if (res.totalFailed == 0 && res.totalProcessed > 0) {
                let message = self.$filter('translate')('xhr.import.success', {processed: res.totalProcessed});
                self.Flash.create('success', message);
            } else {
                let message = self.$filter('translate')('xhr.import.warning',
                    {processed: res.totalProcessed, success: res.totalSuccess, failed: res.totalFailed}
                );
                self.Flash.create('warning', message);
            }

            self.$scope.importCustomerModal = false;
            self.loaderStates.importCustomers = false;
            self.tableParams.reload();
        },
            res => {
                let message = self.$filter('translate')('xhr.import.error');
                self.Flash.create('danger', message);
                self.loaderStates.importCustomers = false;
            }
        );
        }
    }
}
CustomerController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'CustomerService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'LevelService', 'Validation', '$filter', 'DataService', 'PosService', 'TransferService', 'SellerService'];
