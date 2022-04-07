/**
 * Defines admin fieldset block
 *
 * @class AdminFieldsetBlockDirective
 * @constructor
 */
export default class AdminFieldsetBlockDirective {
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
        this.scope = {
            fieldsetLabel: '@',
            togglable: '@?',
            togglableActive: '@?'
        };
        this.link = function (scope, element, attrs) {
            if (scope.togglable === 'true') {
                scope.togglableId = 'admin-fieldset-id-' + Math.floor(Math.random() * Math.floor(500));
            }
        };
        this.templateUrl = require('./templates/fieldset.html');
    }
}

AdminFieldsetBlockDirective.$inject = [];
