export default class CustomerRegistrationService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    postCustomer(newCustomer, invitationToken) {
        newCustomer = this.EditableMap.customer(newCustomer);
        if (invitationToken) {
            newCustomer.invitationToken = invitationToken;
        }

        return this.Restangular.one('customer').one('self_register').customPOST({customer:newCustomer})
    }

    postActivate(token) {
        return this.Restangular.one('customer').one('activate').one(token).customPOST({})
    }

    postActivateSms(token) {
        return this.Restangular.one('customer').one('activate-sms').one(token).customPOST({})
    }

    resendActivationCode(phone) {
        return this.Restangular.one('customer').one('customer-phone').one('send-sms-code').customPOST({
            phone: phone
        });
    }
}

CustomerRegistrationService.$inject = ['Restangular', 'EditableMap'];