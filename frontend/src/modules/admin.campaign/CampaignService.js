/**
 * Defines service to call backend campaign API
 *
 * @class CampaignService
 * @constructor
 */
export default class CampaignService {
    /**
     * @method constructor
     * @param {Object} Restangular
     * @param {EditableMap} EditableMap
     */
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
        this.campaigns = null;
        this._campaignFileError = {};
        this.campaignRequireTransaction = [
            'percentage_discount_code'
        ];
    }

    /**
     * Gets stored campaign file error
     *
     * @method storedFileError
     */
    get storedFileError() {
        return this._campaignFileError
    }

    /**
     * Sets stored campaign file error
     *
     * @method storedFileError
     */
    set storedFileError(error) {
        this._campaignFileError = error;
    }

    /**
     * Stores campaign in service
     *
     * @method setStoredCampaigns
     * @param campaigns
     */
    setStoredCampaigns(campaigns) {
        this.campaigns = campaigns;
    }

    /**
     * Returns stored campaign
     *
     * @method getStoredCampaigns
     * @returns {Object|null}
     */
    getStoredCampaigns() {
        return this.campaigns;
    }

    /**
    * Stores category in service
    *
    * @method setStoredCategories
    * @param categories
    */
    setStoredCategories(categories) {
        this.categories = categories;
    }

    /**
    * Returns stored campaign categories
    *
    * @method getStoredCampaigns
    * @returns {Object|null}
    */
    getStoredCategories() {
        return this.categories;
    }

    /**
    * Calls to post new category
    *
    * @method postCategory
    * @param newCategory
    * @returns {Promise}
    */
    postCategory(newCategory) {
        let self = this;

        return this.Restangular
            .one('campaignCategory')
            .customPOST({campaign_category: self.EditableMap.campaignCategory(newCategory)})
    }

    /**
     * Calls for campaign list
     *
     * @method getCampaigns
     * @param {Object} params
     * @returns {Promise}
     */
    getCampaigns(params = {}) {
        return this.Restangular
            .all('campaign')
            .getList(params);
    }

    /**
     * Calls to post new campaign
     *
     * @method postCampaign
     * @param newCampaign
     * @returns {Promise}
     */
    postCampaign(newCampaign) {
        let self = this;

        return this.Restangular
            .one('campaign')
            .customPOST({campaign: self.EditableMap.campaign(newCampaign)})
    }

    /**
     * Calls single campaign details
     *
     * @method getCampaign
     * @param {Integer} campaignId
     * @returns {Promise}
     */
    getCampaign(campaignId) {
        return this.Restangular.one('campaign', campaignId).get();
    }

    /**
     * Calls for post image to campaign
     *
     * @method postCampaignImages
     * @param {Integer} campaignId
     * @param {Object} data
     * @returns {Promise}
     */
    postCampaignImages(campaignId, data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('campaign', campaignId)
            .one('photo')
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    /**
     * Calls for campain images
     *
     * @method getCampaignImages
     * @param {Integer} campaignId
     * @param {Integer} photoId
     * @returns {Promise}
     */
    getCampaignImages(campaignId, photoId) {
        return this.Restangular
            .one('campaign', campaignId)
            .one('photo', photoId)
            .get()
    }

    /**
     * Calls to remove campaign photo
     *
     * @method deleteCampaignImage
     * @param {Integer} campaignId
     * @param {Integer} photoId
     * @returns {Promise}
     */
    deleteCampaignImage(campaignId, photoId) {
        return this.Restangular
            .one('campaign', campaignId)
            .one('photo', photoId)
            .remove()
    }

    /**
     * Calls for post brand icon to campaign
     *
     * @method postCampaignBrandIcon
     * @param {Integer} campaignId
     * @param {Object} data
     * @returns {Promise}
     */
    postCampaignBrandIcon(campaignId, data) {
        let fd = new FormData();

        fd.append('brand_icon[file]', data);

        return this.Restangular
            .one('campaign', campaignId)
            .one('brand_icon')
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    /**
     * Calls for campain brand icon
     *
     * @method getCampaignBrandIcon
     * @param {Integer} campaignId
     * @returns {Promise}
     */
    getCampaignBrandIcon(campaignId) {
        return this.Restangular
            .one('campaign', campaignId)
            .one('brand_icon')
            .get()
    }

    /**
     * Calls to remove campaign brand icon
     *
     * @method deleteCampaignBrandIcon
     * @param {Integer} campaignId
     * @returns {Promise}
     */
    deleteCampaignBrandIcon(campaignId) {
        return this.Restangular
            .one('campaign', campaignId)
            .one('brand_icon')
            .remove()
    }

    /**
     * Calls to set campaign state
     *
     * @method setCampaignState
     * @param {Boolean} active
     * @param {Integer} campaignId
     * @returns {Promise}
     */
    setCampaignState(active, campaignId) {
        return this.Restangular
            .one('campaign')
            .one(campaignId)
            .one(active ? 'active' : 'inactive')
            .customPOST();
    }

    /**
     * Calls for edit campaign
     *
     * @method putCampaign
     * @param {Object} editedCampaign
     * @returns {Promise}
     */
    putCampaign(editedCampaign) {
        let self = this;

        return editedCampaign
            .customPUT({campaign: self.Restangular.stripRestangular(self.EditableMap.campaign(editedCampaign))});
    }

    /**
     * Calls for visible customers list
     *
     * @method getVisibleCustomers
     * @param campaignId
     * @param params
     * @returns {Promise}
     */
    getVisibleCustomers(campaignId, params = {}) {
        return this.Restangular
            .one('campaign')
            .one(campaignId)
            .one('customers')
            .all('visible')
            .getList(params);
    }

    /**
     * Calls for redeemed campaign rewards
     *
     * @method getRedeemedCampaignRewards
     * @param {Object} params
     * @returns {Promise}
     */
    getRedeemedCampaignRewards(params = {}) {
        return this.Restangular
            .one('campaign')
            .all('bought')
            .getList(params);
    }

    getBoughtReport(params = {}) {
        return this.Restangular
            .all('campaign')
            .all('bought')
            .all('export')
            .one('csv')
            .withHttpConfig({responseType: 'blob'}).customGET("", params);
    }

    postBuyCampaignManually(params){
        return this.Restangular
            .one('admin')
            .one('customer', params.customerId)
            .one('campaign', params.campaignId)
            .one('buy')
            .customPOST(
                {
                    withoutPoints: params.withoutPoints,
                    transactionId: params.transactionId,
                    quantity: params.quantity
                }
            )
    }

    /**
     * Calls for delivery statuses
     *
     * @method getDeliveryStatuses
     * @returns {Promise}
     */
    getDeliveryStatuses() {
        return this.Restangular.one('settings').one('choices').one('deliveryStatus').get();
    }


    /**
     * Change delivery status
     *
     * @method putDeliveryStatus
     * @param {Object} deliveryStatus
     * @param {Integer} customerId
     * @param {Integer} couponId
     * @returns {Promise}
     */
    putDeliveryStatus(deliveryStatus, customerId, couponId) {
        let self = this;

        return self.Restangular.one('admin').one('customer', customerId).one('bought').one('coupon', couponId).one('changeDeliveryStatus')
            .customPUT({ deliveryStatus: { status: deliveryStatus} });
    }

    /**
     * Calls for campaign categories
     *
     * @method getCategories
     * @returns {Promise}
     */
    getCategories(params = {}) {
        return this.Restangular.all('campaignCategory').getList(params);
    }


    /**
     * Calls single category details
     *
     * @method getCategory
     * @param {String} campaignCategoryId
     * @returns {Promise}
     */
    getCategory(campaignCategoryId) {
        return this.Restangular.one('campaignCategory', campaignCategoryId).get();
    }

    /**
     * Calls for edit category
     *
     * @method putCategory
     * @param {Object} editedCategory
     * @returns {Promise}
     */
    putCategory(campaignCategoryId, editedCategory) {
        let self = this;

        return self.Restangular.one('campaignCategory', campaignCategoryId)
            .customPUT({campaign_category: self.Restangular.stripRestangular(self.EditableMap.campaignCategory(editedCategory))});
    }

    /**
    * Calls to set category state
    *
    * @method setCategoryState
    * @param {Integer} campaignCategoryId
    * @param {Boolean} active
    * @returns {Promise}
    */
    setCategoryState(campaignCategoryId, active) {
        return this.Restangular
            .one('campaignCategory', campaignCategoryId)
            .one('active')
            .customPOST({active: active})
    }

    /**
     * Calls for get earninig rule
     *
     * @method getConnectTypeEarningRule
     * @param {String} earningRuleType
     * @returns {Promise}
     */
    getConnectTypeEarningRule(earningRuleType) {
        let params = {
            "type": earningRuleType,
            "paginated": 0
        };
        return this.Restangular.all('earningRule').getList(params);
    }
}

CampaignService.$inject = ['Restangular', 'EditableMap'];
