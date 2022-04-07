export default class SecurityController {
    constructor($scope, $state, SecurityService, Flash, $filter, Validation, $stateParams, DataService) {
        this.$scope = $scope;
        this.$scope.username = null;
        this.$scope.password = null;
        this.$state = $state;
        this.SecurityService = SecurityService;
        this.Flash = Flash;
        this.$filter = $filter;
        this.Validation = Validation;
        this.token = $stateParams.token;
        DataService.getActivationMethod().then((method) => {
            this.activationMethod = method;
        });
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
    }

    requestPassword() {
        let self = this;
        if (self.$scope.username) {
            self.SecurityService.postPasswordRequest(self.$scope.username)
                .then(
                    res => {
                        self.$scope.showSuccess = true;
                        self.$scope.showError = false;
                        self.$scope.successMsg = self.$filter('translate')('xhr.post_password_request.success');
                    },
                    res => {
                        self.$scope.showSuccess = false;
                        self.$scope.showError = true;
                        self.$scope.errorMsg = self.$filter('translate')('xhr.post_password_request.error');
                    }
                )
        }
    }

    requestCustomerPassword() {
        let self = this;
        if (self.$scope.username) {
            self.SecurityService.postCustomerPasswordRequest(self.$scope.username)
                .then(
                    res => {
                        self.$scope.showError = false;
                        self.$scope.successMsg = self.$filter('translate')('xhr.post_password_request.success');
                        if (self.isActivationBySms()) {
                            self.$state.go('forgot-password-reset-sms-customer')
                        } else {
                            self.$scope.showSuccess = true;
                        }
                    },
                    res => {
                        self.$scope.showSuccess = false;
                        self.$scope.showError = true;
                        self.$scope.errorMsg = self.$filter('translate')('xhr.post_password_request.error');
                    }
                )
        }
    }

    resetPassword() {
        let self = this;
        self.SecurityService.postPasswordReset(self.$scope.password, self.token)
            .then(
                () => {
                    self.$scope.showSuccess = true;
                    self.$scope.showError = false;
                    self.$scope.successMsg = self.$filter('translate')('xhr.post_password_reset.success');
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    self.$scope.showSuccess = false;
                    self.$scope.showError = true;

                    if(self.$scope.validate.plainPassword && self.$scope.validate.plainPassword.errors) {
                        self.$scope.errorMsg = '';
                        _.each(self.$scope.validate.plainPassword.errors, error => {
                            self.$scope.errorMsg += self.$filter('translate')(error) + '<br>';
                        });
                        self.$scope.errorMsg = '<span>'+self.$scope.errorMsg+'</span>';
                    }
                }
            )
    }

    resetCustomerPassword() {
        let self = this;
        self.SecurityService.postPasswordReset(self.$scope.password, self.$scope.token)
            .then(
                () => {
                    self.$scope.showError = false;
                    self.$scope.successMsg = self.$filter('translate')('xhr.post_password_reset.success');
                    self.$scope.showSuccess = true;
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    self.$scope.showSuccess = false;
                    self.$scope.showError = true;

                    if(self.$scope.validate.plainPassword && self.$scope.validate.plainPassword.errors) {
                        self.$scope.errorMsg = '';
                        _.each(self.$scope.validate.plainPassword.errors, error => {
                            self.$scope.errorMsg += self.$filter('translate')(error) + '<br>';
                        });
                        self.$scope.errorMsg = '<span>'+self.$scope.errorMsg+'</span>';
                    }
                }
            )
    }

    isActivationBySms() {
        return this.activationMethod === 'sms';
    }

    backToLogin() {
        let self = this;
        if (self.$state.current.name === 'forgot-password-request-seller' || self.$state.current.name === 'forgot-password-reset-seller') {
            self.$state.go('seller-login');
        } else if (self.$state.current.name === 'forgot-password-request-customer' || self.$state.current.name === 'forgot-password-reset-customer' || self.$state.current.name === 'forgot-password-reset-sms-customer') {
            self.$state.go('customer-login');
        } else {
            self.$state.go('admin-login');
        }
    }
}

SecurityController.$inject = ['$scope', '$state', 'SecurityService', 'Flash', '$filter', 'Validation', '$stateParams', 'DataService'];
