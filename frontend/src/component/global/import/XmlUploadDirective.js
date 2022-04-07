export default class XmlUploadDirective {
    constructor() {
        this.restrict = 'A';
        this.scope = {ngModel: "=?"};
        this.replace = true;
        this.transclude = true;
        this.templateUrl = require('./templates/xml-upload.html');
        this.controller = ['$scope', '$element', ($scope, $element) => {
            $scope.fileName = '';
            $scope.chosenFile = '';
            $scope.error = '';
            $scope.showError = '';
            $scope.openFileDialog = () => {
                $element.find('input[type="file"]').trigger('click');
            };

            $scope.fileChanged = () => {

                let file = $element.find('input[type="file"]');
                $scope.file = file.get(0).files[0];

                if ($scope.file.type != 'text/xml') {
                    $scope.showError = true;
                    $scope.error = 'Only XML files are accepted';
                    $scope.ngModel = null;
                    $scope.$apply()
                } else {
                    $scope.showError = false;
                    $scope.fileName = $scope.file.name;
                    $scope.ngModel = $scope.file;
                    $scope.$apply()
                }
            }
        }]
    }
}

XmlUploadDirective.$inject = [];
