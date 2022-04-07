export default class TransferController {
    constructor($scope, $state, $stateParams, AuthService, TransferService, Flash, EditableMap, NgTableParams, ParamsMap, $q, CustomerService, Validation, $filter, DataService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            AuthService.logout();
        }
        this.$scope = $scope;
        this.$state = $state;
        this.AuthService = AuthService;
        this.TransferService = TransferService;
        this.CustomerService = CustomerService;
        this.Flash = Flash;
        this.EditableMap = EditableMap;
        this.transferId = $stateParams.transferId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.$q = $q;
        this.Validation = Validation;
        this.$filter = $filter;
        this.$scope.validate = {};
        this.$scope.clientSearch = 0; //0 - nothing, 1 - loading, 2 - nothing found
        this.config = DataService.getConfig();
        this.transferTypeConfig = this.TransferService.getTransferTypeConfig();
        this.transferType = this.TransferService.getTransferType();

        let self = this;
        this.customerConfig = {
            valueField: 'customerId',
            render: {
                option: (item, escape) => {
                    return '<div>'+(item.email ? escape(item.email) : '')+' ('+escape(item.phone)+')</div>';
                },
                item: (item, escape) => {
                    return '<div>'+(item.email ? escape(item.email) : '')+' ('+escape(item.phone)+')</div>';
                }
            },
            create: false,
            sortField: 'email',
            maxItems: 1,
            searchField: ['phone', 'email'],
            placeholder: this.$filter('translate')('global.start_typing_an_email_or_phone'),
            onChange: value => {
                self.$scope.clientSearch = 0;
            },
            load: (query, callback) => {
                if (!query.length) return callback();

                self.$scope.clientSearch = 1;

                CustomerService.getCustomers(ParamsMap.params({
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

        this.loaderStates = {
            transferList: true,
            coverLoader: true,
            addTransfer: false,
            cancelTransfer: false,
            importTransfer: false
        }
    }

    openAddPointsModal() {
        let self = this;

        self.$scope.newTransfer = {};
        self.$scope.showAddPoints = true;
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

    closeAddPointsModal() {
        let self = this;

        self.$scope.showAddPoints = false;
    }

    openSpendPointsModal() {
        let self = this;

        self.$scope.newTransfer = {};
        self.$scope.showSpendPoints = true;
    }

    closeSpendPointsModal() {
        let self = this;

        self.$scope.showSpendPoints = false;
    }

    openImportModal() {
        let self = this;

        self.$scope.showTransferImportModal = true;
    }

    closeImportModal() {
        let self = this;

        self.$scope.showTransferImportModal = false;
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
                self.loaderStates.transferList = true;

                self.TransferService.getTransfers(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.$scope.transfers = res;
                            params.total(res.total);
                            self.loaderStates.transferList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res)
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

    transferPoints(newTransfer, type) {
        let self = this;
        self.loaderStates.addTransfer = true;

        switch (type) {
            case 'add':
                self.TransferService.postAddTransfer(newTransfer)
                    .then(
                        res => {
                            let message = self.$filter('translate')('xhr.post_add_transfer.success');
                            self.Flash.create('success', message);
                            self.tableParams.reload();
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
                    )
                break;
            case 'spend':
                self.TransferService.postSpendTransfer(newTransfer)
                    .then(
                        res => {
                            let message = self.$filter('translate')('xhr.post_spend_transfer.success');
                            self.Flash.create('success', message);
                            self.tableParams.reload();
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
                    )
                break;
            default:
                self.loaderStates.addTransfer = false;
                break;
        }
    }

    addPoints(newTransfer) {
        let self = this;

        self.TransferService.postAddTransfer(newTransfer)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_add_transfer.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                    self.closeAddPointsModal();
                    self.$scope.validate = {};
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.post_add_transfer.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    spendPoints(newTransfer) {
        let self = this;

        self.TransferService.postSpendTransfer(newTransfer)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_spend_transfer.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                    self.closeSpendPointsModal();
                    self.$scope.validate = {};
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.post_spend_transfer.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    cancelTransfer(transferId) {
        let self = this;
        self.loaderStates.cancelTransfer = true;

        self.TransferService.postCancelTransfer(transferId)
            .then(
                res => {
                    let message = self.$filter('translate')('xhr.post_cancel_transfer.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                    self.loaderStates.cancelTransfer = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_cancel_transfer.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.cancelTransfer = false;
                }
            )
    }

    importTransfer(file) {
        let self = this;

        if (file) {
            self.loaderStates.importTransfer = true;
            self.TransferService.postImportTransfer(file)
                .then(
                    res => {
                        if (res.totalProcessed == 0) {
                            let message = self.$filter('translate')('xhr.import.no_data');
                            self.Flash.create('warning', message);
                        }
                        else if (res.totalFailed == 0) {
                            let message = self.$filter('translate')('xhr.import.success', {processed: res.totalProcessed});
                            self.Flash.create('success', message);
                        } else {
                            let message = self.$filter('translate')('xhr.import.warning',
                                {processed: res.totalProcessed, success: res.totalSuccess, failed: res.totalFailed}
                            );
                            self.Flash.create('warning', message);
                        }

                        self.$scope.importTransactionModal = false;
                        self.loaderStates.importTransfer = false;
                        self.closeImportModal();
                        self.tableParams.reload();
                    },
                    res => {
                        let message = self.$filter('translate')('xhr.import.error');
                        self.Flash.create('danger', message);
                        self.loaderStates.importTransfer = false;
                    }
                );
        }
    }
}

TransferController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'TransferService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'CustomerService', 'Validation', '$filter', 'DataService'];
