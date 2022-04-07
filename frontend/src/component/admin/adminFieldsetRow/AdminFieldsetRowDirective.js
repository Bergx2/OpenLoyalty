/**
 * Defines admin row within a fieldset
 *
 * @class AdminFieldsetRow
 * @constructor
 */
export default class AdminFieldsetRowDirective {
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = false;
        this.scope = {
            isRequired: '@?',
            inputType: '@?',
            rowLabel: '@',
            rowPrompt: '@?',
            inputModel: '=',
            validateBy: '='
        };
        this.link = function (scope, element, attrs) {
            scope.rowLabel = attrs.rowLabel ? attrs.rowLabel : 'Default label';
            scope.inputType = attrs.inputType ? attrs.inputType : 'text';
            scope.newModel = '';
            scope.$watch('inputModel', function (value) {
                scope.newModel = value;
            });
            scope.onInputValueChange = function (value) {
                scope.inputModel = value;
            };
        };
        this.templateUrl = require('./templates/row.html');
    }
}

AdminFieldsetRowDirective.$inject = [];
