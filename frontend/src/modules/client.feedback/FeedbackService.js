export default class FeedbackService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getCustomer(id) {
        return this.Restangular.one('customer', id).get();
    }
}

FeedbackService.$inject = ['Restangular', 'EditableMap'];