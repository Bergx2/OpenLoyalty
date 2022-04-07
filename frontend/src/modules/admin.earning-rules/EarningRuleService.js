export default class EarningRuleService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
        this._availableActiveCampaings = null;
    }

    getEarningRules(params) {
        return this.Restangular.all('earningRule').getList(params);
    }

    getEarningRule(earningRule) {
        return this.Restangular.one('earningRule', earningRule).get();
    }

    postEarningRule(newEarningRule) {
        return this.Restangular.one('earningRule').customPOST({earningRule: newEarningRule});
    }

    putEarningRule(earningRuleId, editedEarningRule) {
        let self = this;
        editedEarningRule = self.Restangular.stripRestangular(editedEarningRule);

        return self.Restangular.one('earningRule', earningRuleId).customPUT({earningRule: editedEarningRule});
    }
    postActivateRule(state, ruleId) {
        let self = this;

        return this.Restangular.one('earningRule').one(ruleId).one('activate').customPOST({active: state})
    }

    /**
     * Calls for post image to earning rule
     *
     * @method postEarningRuleImage
     * @param {Integer} earningRule
     * @param {Object} data
     * @returns {Promise}
     */
    postEarningRuleImage(earningRule, data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('earningRule', earningRule)
            .one('photo')
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    /**
     * Calls for earning rule image
     *
     * @method getEarningRuleImage
     * @param {Integer} earningRule
     * @returns {Promise}
     */
    getEarningRuleImage(earningRule) {
        return this.Restangular
            .one('earningRule', earningRule)
            .one('photo')
            .get()
    }

    /**
     * Calls to remove earning rule photo
     *
     * @method deleteEarningRuleImage
     * @param {Integer} earningRule
     * @returns {Promise}
     */
    deleteEarningRuleImage(earningRule) {
        return this.Restangular
            .one('earningRule', earningRule)
            .one('photo')
            .remove()
    }

    /**
     * @method getActiveCampaigns
     * @returns {Promise}
     */
    getActiveCampaigns(){
        return this.Restangular.one('campaign').all('active').getList();
    }

}

EarningRuleService.$inject = ['Restangular', 'EditableMap'];
