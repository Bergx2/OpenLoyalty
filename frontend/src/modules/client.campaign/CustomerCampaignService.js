export default class CustomerCampaignService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getAvailable(params) {
        return this.Restangular.one('customer').one('campaign').all('available').getList(params);
    }

    getBought(params) {
        params.includeDetails = true;
        return this.Restangular.one('customer').one('campaign').all('bought').getList(params);
    }

    postBuy(campaignId) {
        return this.Restangular.one('customer').one('campaign').one(campaignId).one('buy').post();
    }

    postUsage(campaignId, code, couponId, usage) {
        return this.Restangular.one('customer').one('campaign').one('coupons').one('mark_as_used').customPOST({
            'coupons': [
                {
                    used: usage,
                    campaignId: campaignId,
                    code: code,
                    couponId: couponId
                }
            ]
        });
    }

    /**
     * Calls for campaign image
     *
     * @method getCampaignImage
     * @param {Integer} campaignId
     * @returns {Promise}
     */
    getCampaignImage(campaignId) {
        return this.Restangular.one('campaign', campaignId).one('photo').get();
    }
}

CustomerCampaignService.$inject = ['Restangular', 'EditableMap'];
