export default class CustomerEarningRulesService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getRules($id) {
        return this.Restangular.one('customer').one('earningRule').get();
    }

    /**
     * Calls for earning rule image
     *
     * @method getEarningRuleImage
     * @param {Integer} earningRuleId
     * @returns {Promise}
     */
    getEarningRuleImage(earningRuleId) {
        return this.Restangular.one('earningRule', earningRuleId).one('photo').get();
    }
}

CustomerEarningRulesService.$inject = ['Restangular', 'EditableMap'];