export default class FeedbackService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getUsers(params) {
        if (!params) {
            params = {};
        }

        return this.Restangular.all('admin').getList(params);
    }


}

FeedbackService.$inject = ['Restangular', 'EditableMap'];