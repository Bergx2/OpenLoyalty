export default class SellerCustomerService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    search(data) {
        return this.Restangular
            .one('pos')
            .one('search')
            .one('customer')
            .customPOST({search: data})
    }

    getCustomers(params) {
        if (!params) {
            params = {};
        }

        return this.Restangular.all('customer').getList(params);
    }

    postCustomer(newCustomer) {
        let self = this;

        return this.Restangular.one('seller').one('customer').one('register').customPOST({customer: self.EditableMap.newCustomer(newCustomer)})
    }

    getLevels(params) {
        return this.Restangular.one('seller').all('level').getList(params);
    }

    getPosSeller(sellerId) {
        return this.Restangular.one('seller', sellerId).get();
    }

    getPosList(params) {
        return this.Restangular.one('seller').all('pos').getList(params);
    }

    getCustomer(customerId) {
        return this.Restangular.one('customer', customerId).get();
    }

    putCustomer(editedCustomer) {
        let self = this;

        return editedCustomer.customPUT({customer: self.EditableMap.customer(editedCustomer, true)});
    }

    postLevel(editedCustomer, levelId) {
        return editedCustomer.customPOST({levelId: levelId}, 'level')
    }

    postPos(editedCustomer, posId) {
        return editedCustomer.customPOST({posId: posId}, 'pos')
    }

    getLevel(levelId) {
        return this.Restangular.one('seller').one('level', levelId).get();
    }

    getPos(pos) {
        return this.Restangular.one('seller').one('pos', pos).get();
    }

    getCustomerTransactions(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('seller').all('transaction').getList(params);
    }

    postPosAddTransfer(newTransfer) {
        return this.Restangular.one('pos').one('points').one('transfer').one('add').customPOST({transfer:newTransfer});
    }

    postPosSpendTransfer(newTransfer) {
        return this.Restangular.one('pos').one('points').one('transfer').one('spend').customPOST({transfer:newTransfer});
    }

    getCustomerTransfers(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('seller').one('points').all('transfer').getList(params);
    }

    getCustomerAvailableCampaigns(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('seller').one('customer', customerId).one('campaign').all('available').getList(params);
    }

    getCustomerBoughtCampaigns(params, customerId) {
        params.customerId = customerId;
        params.includeDetails = true;

        return this.Restangular.one('seller').one('customer', customerId).one('campaign').all('bought').getList(params);
    }

    getCustomerStatus(customerId) {
        return this.Restangular.one('seller').one('customer', customerId).one('status').get();
    }

    deactivateCustomer(customerId) {
        return this.Restangular.one('seller').one('customer', customerId).one('deactivate').customPOST();
    }

    activateCustomer(customerId, token) {
        return this.Restangular.one('customer').one('activate-sms', token).customPOST();
    }

    resendActivationCode(customerId) {
        return this.Restangular.one('seller').one('customer', customerId).one('send-sms-code').customPOST();
    }
}

SellerCustomerService.$inject = ['Restangular', 'EditableMap'];
