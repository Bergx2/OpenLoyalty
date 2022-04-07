export default class CustomerEarningRulesController {
    constructor($scope, $state, AuthService, CustomerEarningRulesService, Flash,ParamsMap, $stateParams, EditableMap, DataService) {
        if (!AuthService.isGranted('ROLE_PARTICIPANT')) {
            $state.go('customer-login')
        }
        this.$scope = $scope;
        this.CustomerEarningRulesService = CustomerEarningRulesService;
        this.$state = $state;
        this.Flash = Flash;
        this.ParamsMap = ParamsMap;
        this.EditableMap = EditableMap;
        this.$scope.loader = true;
        this.config = DataService.getConfig();
    }

    getRules() {
        let self = this;

        this.CustomerEarningRulesService.getRules().then(
            res => {
                self.$scope.loader = false;
                self.$scope.rules = res.earningRules;
                self.$scope.currency = res.currency;
                angular.forEach(self.$scope.rules, function(rule, key) {
                    self.CustomerEarningRulesService.getEarningRuleImage(rule.earningRuleId)
                        .then(
                            res => {
                                rule.earningRuleImagePath = true;
                            }
                        )
                        .catch(
                            err => {

                                rule.earningRuleImagePath = false;
                            }
                        );
                });
            }
        )
    }

    generatePhotoRoute(earningRuleId) {
        return this.config.apiUrl + '/earningRule/' + earningRuleId + '/photo'
    }
}

CustomerEarningRulesController.$inject = ['$scope', '$state', 'AuthService', 'CustomerEarningRulesService', 'Flash', 'ParamsMap', '$stateParams', 'EditableMap', 'DataService'];
