export default class TransactionService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getTransactions(params) {
        return this.Restangular.all('transaction').getList(params);
    }

    postTransaction(newTransaction) {
        return this.Restangular.one('transaction').customPOST({transaction: newTransaction})
    }

    postImportTransaction(file) {
        var formData = new FormData();
        formData.append('file[file]', file);

        return this.Restangular
            .one('admin')
            .one('transaction')
            .one('import')
            .withHttpConfig({
                transformRequest: angular.identity,
                timeout: 0
            })
            .customPOST(formData, '', undefined, {'Content-Type': undefined})
    }

    postAssign(linked) {
        return this.Restangular
            .one('admin')
            .one('transaction')
            .one('customer')
            .one('assign')
            .customPOST({assign: linked})
    }

    postLabels(transactionId, obj) {
        return this.Restangular
            .one('admin')
            .one('transaction')
            .one('labels')
            .customPOST({transaction_labels: {transactionId: transactionId, labels: obj.labels}})
    }

}

TransactionService.$inject = ['Restangular', 'EditableMap'];
