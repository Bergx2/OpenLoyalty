export default class CustomerRegistrationController {
    constructor($scope, $state, CustomerRegistrationService, Flash, $filter, DataService, Validation, $stateParams) {
        this.$scope = $scope;
        this.$scope.newCustomer = {};
        this.$scope.validate = {};
        this.$state = $state;
        this.CustomerRegistrationService = CustomerRegistrationService;
        this.Flash = Flash;
        this.$filter = $filter;
        this.country = DataService.getCountries();
        this.Validation = Validation;
        this.$stateParams = $stateParams;
        this.invitationToken = $stateParams.invitationToken;
        this.activationMethod = null;
        this.$scope.code = {};
        DataService.getActivationMethod().then((method) => {
            this.activationMethod = method;
        });
        this.showResendModal = false;
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
            plainPassword: '@assert:not_blank|equal_with:plainPassword2',
            plainPassword2: '@assert:not_blank|equal_with:plainPassword'
        };
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
    }
    isActivationBySms() {
        return this.activationMethod === 'sms';
    }

    isActivationByEmail() {
        return this.activationMethod === 'email';
    }
    activate() {
        let token = this.$stateParams.token;
        let self = this;

        if (!token) {
            self.$state.go('customer-login');
        }

        this.CustomerRegistrationService.postActivate(token).then(
            res => {
                self.$state.go('customer-login');
                let message = self.$filter('translate')('xhr.post_registration_customer_activate.success');
                self.Flash.create('success', message);

            },
            res => {
                self.$state.go('customer-login');
                let message = self.$filter('translate')('xhr.post_registration_customer_activate.error');
                self.Flash.create('danger', message);
            }
        )
    }
    resendActivationCode(code) {
        let self = this;
        if (!self.isActivationBySms()) {
            this.showResendModal = false;
            this.$scope.code.phone = '';

            return;
        }
        this.CustomerRegistrationService.resendActivationCode(code.phone).then(
            res => {
                let message = self.$filter('translate')('xhr.post_resend_customer_code.success');
                self.Flash.create('success', message);
                this.showResendModal = false;
                this.$scope.code.phone = '';
            },
            () => {
                let message = self.$filter('translate')('xhr.post_resend_customer_code.error');
                self.Flash.create('danger', message);
            }
        )
    }
    activateSms(code) {
        let token = code.value;
        let self = this;

        if (!token) {
            self.$state.go('customer-login');
        }

        this.CustomerRegistrationService.postActivateSms(token).then(
            res => {
                self.$state.go('customer-login');
                let message = self.$filter('translate')('xhr.post_registration_customer_activate.success');
                self.Flash.create('success', message);

            },
            res => {
                let message = self.$filter('translate')('xhr.post_registration_customer_activate.error');
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
            self.CustomerRegistrationService.postCustomer(newCustomer, this.invitationToken)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.post_registration_customer.success');
                        self.Flash.create('success', message);
                        if (self.isActivationBySms()) {
                            self.$state.go('customer.panel.registration_activate_sms');
                        } else {
                            self.$state.go('customer.panel.registration_success');
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
}

CustomerRegistrationController.$inject = ['$scope', '$state', 'CustomerRegistrationService', 'Flash', '$filter', 'DataService', 'Validation', '$stateParams'];