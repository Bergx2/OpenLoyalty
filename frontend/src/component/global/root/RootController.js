export default class RootController {
    constructor($rootScope, AuthService, $state, $timeout, $translate, $sce, $stateParams, $interval, DataService) {
        let self = this;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$interval = $interval;
        this.AuthService = AuthService;
        this.DataService = DataService;

        this.translate = $translate;
        this.initialRequests = true;
        this.loadingParts = {
            $$translationsLoaded: false,
            $$contentCompiled: false,
            $$viewLoaded: false,
            allXhrsDone: false,
        };
        this.stateClasses = this._stateClasses();
        this.logo = this.DataService.getConfig().apiUrl + '/settings/photo/logo';

        this.activationMethod = null;

        this.$rootScope.$on('$includeContentLoaded', () => {
            $(document).foundation();
        });

        this.$rootScope.$on('$translateLoadingEnd', () => {
            this.loadingParts.$$viewLoaded = true;
        });

        this.$rootScope.$on('$stateChangeSuccess', () => {
            let excludedStates = [
                'customer.panel.registration',
                'customer.panel.registration_activate_sms',
                'customer.panel.registration_confirm',
                'customer.panel.registration_from_invitation',
                'customer.panel.registration_success'
            ];

            if (self.$state.includes('admin') || self.$state.includes('customer') || self.$state.includes('seller')) {
                if (!_.includes(excludedStates, self.$state.current.name)) {
                    self.AuthService.setLogoutFrom(self.$state.current.name);
                    self.AuthService.setLogoutFromParams(self.$stateParams);
                }
            }
        });

        this.$rootScope.$on('$stateChangeError', () => {
            //this.loadingParts.stateChanged = true;
        });

        this.$rootScope.$on('$viewContentLoaded', () => {
            $(document).foundation();
            this.loadingParts.$$translationsLoaded = true;
        });

        this.$rootScope.$watch('pendingRequests', () => {
            if ($rootScope.pendingRequests > 0 && !this.loaderInstance && this.initialRequests) {
                self.setLoading(true);
                this.loaderInstance = $interval(() => {
                    if ($rootScope.pendingRequests <= 0) {
                        this.loadingParts.allXhrsDone = true;
                        $rootScope.pendingRequests = 0;
                    }
                    if (this._allTrue(this.loadingParts)) {
                        this._destroyLoader();
                    }

                }, 3500);
            }


        });

        this.contentLoadedTest = $interval(() => {
            let test = angular.element('#contentLoadedTest').text();

            if (test === 'ok') {
                this.loadingParts.$$contentCompiled = true;
                this._destoryContentLoadedTest();
            }

        }, 1000);
    }

    setupActivationMethod() {
        this.DataService.getActivationMethod().then((method) => {
            this.activationMethod = method;
        });
    }

    _allTrue(obj) {
        for (var o in obj) {
            if (!obj[o]) return false;
        }

        return true;
    }

    _destroyLoader() {
        if (angular.isDefined(this.loaderInstance)) {
            this.$interval.cancel(this.loaderInstance);
            this.loaderInstance = undefined;
        }

        this.loadingParts.allXhrsDone = false;
        //this.loadingParts.stateChanged = false;

        this.setLoading(false);
        if (this.$state.includes('admin')) {
            this.initialRequests = false;
        }
    }

    _destoryContentLoadedTest() {
        if (angular.isDefined(this.contentLoadedTest)) {
            this.$interval.cancel(this.contentLoadedTest);
            this.contentLoadedTest = undefined;
        }
    }

    _stateClasses() {
        let states = this.$state.get();
        let stateClasses = [];

        for (let i in states) {
            stateClasses[states[i].name] = states[i].name.replace(/\./g, '_');
        }

        return stateClasses;
    }

    foundation() {
        $(document).foundation();
    }

    logout() {
        this.AuthService.logout();
    }


    loggedIn() {
        return this.$state.current.name !== 'admin-login' &&
            this.$state.current.name !== 'customer-login' &&
            this.$state.current.name !== 'seller-login' &&
            this.$state.current.name !== 'customer.panel.registration_success' &&
            this.$state.current.name !== 'customer.panel.registration' &&
            this.$state.current.name !== 'customer.panel.registration_activate_sms' &&
            this.$state.current.name !== 'customer.panel.registration_from_invitation';
    }

    setLoading(loading) {
        if (!loading) {
            this.$timeout(() => {
                angular.element('section.loader').fadeOut(500, () => {
                    this.loading = loading;
                })
            }, 1100) //should be greater than default box loader delay
        } else {
            this.loading = loading;
        }
    }

    getViewClass() {
        return this.stateClasses[this.$state.current.name];
    }

    getLogo() {
        return this.logo;
    }

    getAvtivationMethod() {
        return this.activationMethod;
    }

    isActivationByEmail() {
        return this.activationMethod === 'email';
    }

    isActivationBySms() {
        return this.activationMethod === 'sms';
    }

    isAdminPanel() {
        let self = this;

        let adminCustomStates = [
            'admin-login',
            'forgot-password-request-admin',
            'forgot-password-reset-admin'
        ];

        return (self.$state.includes('admin') && !_.includes(adminCustomStates, self.$state.current.name))
    }

    isCustomerPanel() {
        let self = this;

        let customerCustomStates = [
            'customer-login',
            'forgot-password-request-customer',
            'forgot-password-reset-customer',
            'customer.panel.registration_confirm',
            'customer.panel.registration_success',
            'customer.panel.registration',
            'customer.panel.registration_activate_sms',
            'customer.panel.registration_from_invitation'
        ];

        return (self.$state.includes('customer') && !_.includes(customerCustomStates, self.$state.current.name))
    }

    isSellerPanel() {
        let self = this;

        let sellerCustomStates = [
            'seller-login',
            'forgot-password-request-seller',
            'forgot-password-reset-seller'
        ];

        return (self.$state.includes('seller') && !_.includes(sellerCustomStates, self.$state.current.name))

    }

    isClientPanel() {
        return this.isCustomerPanel();
    }

    isPosPanel() {
        return this.isSellerPanel();
    }
}

RootController.$inject = ['$rootScope', 'AuthService', '$state', '$timeout', '$translate', '$sce', '$stateParams', '$interval', 'DataService'];
