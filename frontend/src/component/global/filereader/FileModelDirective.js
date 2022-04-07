/**
 * Defines filereader directive
 *
 * @class FileModelDirective
 * @constructor
 */
export default class FileModelDirective {
    constructor($parse) {
        this.restrict = 'A';
        this.replace = true;
        this.transclude = true;
        this.templateUrl = require('./templates/file-upload.html');
        this.link = (scope, element, attrs) => {
            let model = $parse(attrs.fileModel);
            let modelSetter = model.assign;
            let input = element.find('input[type="file"]');

            scope.fieldName = attrs.name;

            scope.openFileDialog = () => {
                input.trigger('click');
            };

            input.bind('change', () => {
                scope.$apply(() => {
                    if (input[0].files[0]) {
                        modelSetter(scope, input[0].files[0]);
                        scope.fileName = input[0].files[0].name;
                    }
                });
            });
        }
    }

    static create() {
        return new FileModelDirective(...arguments);
    }
}

FileModelDirective.create.$inject = ['$parse'];

