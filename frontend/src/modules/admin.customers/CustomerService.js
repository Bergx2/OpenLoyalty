export default class CustomerService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getCustomers(params) {
        if(!params) {
            params = {};
        }

        return this.Restangular.all('customer').getList(params);
    }
    getReferredCustomers(params) {
        if(!params) {
            params = {};
        }

        return this.Restangular.all('invitations').getList(params);
    }

    postCustomer(newCustomer) {
        return this.Restangular.one('customer').one('register').customPOST({customer:newCustomer})
    }

    getCustomer(customerId) {
        return this.Restangular.one('customer', customerId).get();
    }

    getCustomerStatus(customerId) {
        return this.Restangular.one('admin').one('customer', customerId).one('status').get();
    }

    getCustomerTransactions(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.all('transaction').getList(params);
    }

    getCustomerTransfers(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('points').all('transfer').getList(params);
    }

    getCustomerAvailableCampaigns(params, customerId) {
        params.customerId = customerId;

        return this.Restangular.one('admin').one('customer', customerId).one('campaign').all('available').getList(params);
    }

    getCustomerBoughtCampaigns(params, customerId) {
        params.customerId = customerId;
        params.includeDetails = true;

        return this.Restangular.one('admin').one('customer', customerId).one('campaign').all('bought').getList(params);
    }

    putCustomer(editedCustomer) {
        let self = this;

        let result = self.EditableMap.customer(editedCustomer);
        if(editedCustomer.birthDate === undefined)
        {
            result.birthDate = null;
        }

        return editedCustomer.customPUT({customer: result });
    }

    postLevel(editedCustomer, levelId) {
        return editedCustomer.customPOST({levelId: levelId}, 'level')
    }

    postPos(editedCustomer, posId) {
        return editedCustomer.customPOST({posId: posId}, 'pos')
    }

    deactivateCustomer(customerId) {
        return this.Restangular.one('admin').one('customer', customerId).one('deactivate').customPOST();
    }

    activateCustomer(customerId) {
        return this.Restangular.one('admin').one('customer', customerId).one('activate').customPOST();
    }

    postUsage(customerId, campaignId, code, couponId, usage) {
        return this.Restangular.one('admin').one('campaign').one('coupons').one('mark_as_used').customPOST({
            'coupons': [
                {
                    customerId: customerId,
                    used: usage,
                    campaignId: campaignId,
                    code: code,
                    couponId: couponId
                }
            ]
        });
    }

    removeManuallyLevel(customerId) {
        return this.Restangular.one('customer', customerId).one('remove-manually-level').customPOST();
    }

    postImportCustomers(file) {
        var formData = new FormData();
        formData.append('file[file]', file);

        return this.Restangular
            .one('admin')
            .one('customer')
            .one('import')
            .withHttpConfig({
                transformRequest: angular.identity,
                timeout: 0
            })
            .customPOST(formData, '', undefined, {'Content-Type': undefined})
    }
}

CustomerService.$inject = ['Restangular', 'EditableMap'];
