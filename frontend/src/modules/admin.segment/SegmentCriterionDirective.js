import StaticPagesDirective from "../../component/global/pages/StaticPagesDirective";

export default class SegmentCriterionDirective {
    constructor() {
        this.restrict = 'E';
        this.scope = {
            criterionType: '=',
            parentIndex: '=',
            segmentIndex: '=',
            validate: '='
        };
        this.template = '<ng-include src="$parent.getTemplateUrl()"/>';
        this.controller = ['$scope', '$element', '$compile', '$timeout', '$filter', 'CustomerService', 'ParamsMap', ($scope, $element, $compile, $timeout, $filter, CustomerService, ParamsMap) => {
            $scope.segment = $scope.$parent.segmentModel;
            $scope.skusConfig = {
                delimiter: ',',
                plugins:['remove_button'],
                persist: false,
                create: function (input) {
                    return {
                        value: input,
                        text: input
                    }
                }
            };
            $scope.makersConfig = {
                delimiter: ',',
                plugins:['remove_button'],
                persist: false,
                create: function (input) {
                    return {
                        value: input,
                        text: input
                    }
                }
            };
            $scope.posDndConfig = {
                sort: false,
                animation: 150,
                draggable: ".item",
                group: 'pos-dnd'
            };
            $scope.percentPosSelect = {
                valueField: 'posId',
                labelField: 'name',
                create: false,
                sortField: 'name',
                maxItems: 1,
            };
            $scope.anniversaryTypeSelect = {
                valueField: 'value',
                labelField: 'name',
                create: false,
                sortField: 'name',
                maxItems: 1,
            };
            $scope.anniversaryType = [
                {
                    name: 'Birthday',
                    value: 'birthday'
                },
                {
                    name: 'Registration',
                    value: 'registration'
                }
            ];

            $scope.customerListConfig = {
                valueField: 'customerId',
                preload: true,
                render: {
                    option: (item, escape) => {
                        return '<div>'+(item.email ? escape(item.email) : '')+' ('+escape(item.phone)+')</div>';
                    },
                    item: (item, escape) => {
                        return '<div>'+(item.email ? escape(item.email) : '')+' ('+escape(item.phone)+')</div>';
                    }
                },
                plugins: ['remove_button'],
                sortField: 'email',
                searchField: ['phone', 'email'],
                placeholder: $filter('translate')('global.start_typing_an_email_or_phone'),
                onChange: () => {
                    $scope.clientSearch = 0;
                },
                load: (query, callback) => {
                    if (!query.length) return callback();

                    $scope.clientSearch = 1;

                    CustomerService.getCustomers(ParamsMap.params({
                        'filter[emailOrPhone]': query,
                        'filter[silenceQuery]': true
                    }))
                        .then(
                            res => {
                                $scope.clientSearch = 0;
                                callback(res)
                            },
                            () => {
                                callback();
                            }
                        );
                }
            };

            $scope.egSkus = ['SKU123'];
            $scope.egMaker = ['Example'];

            $scope.addLabel = () => {
                if (!$scope.segment.labels) {
                    $scope.segment.labels = [];
                }
                $scope.segment.labels.push({key: '', value: ''})
            };

            $scope.removeLabel = index => {
                let labels = $scope.segment.labels;
                $scope.segment.labels = _.difference(labels, [labels[index]]);
            };

            $scope.$watch('criterionType', () => {
                let content = $compile('<ng-include src="$parent.getTemplateUrl()"/>')($scope);
                $element.html(content);
                $scope.percentPos = angular.copy($scope.$parent.$parent.$parent.pos);

                $timeout(()=> {
                    if (!$scope.pos) {
                        $scope.pos = angular.copy($scope.$parent.$parent.$parent.pos);
                    }
                    if ($scope.$parent.segmentModel.posIds && $scope.$parent.segmentModel.posIds.length) {
                        let ids = $scope.$parent.segmentModel.posIds;
                        var poses = [];

                        for (let i in ids) {
                            let toRemove = _.find($scope.pos, o => {
                                return o.posId === ids[i];
                            });
                            if (toRemove) {
                                _.remove($scope.pos, o => {
                                    return o.posId === ids[i]
                                });
                                poses.push(toRemove);
                            }
                        }
                        $scope.$parent.segmentModel.posIds = poses;
                    } else {
                        $scope.$parent.segmentModel.posIds = []
                    }

                }, 200)

            }, true);
        }];
    }
}

StaticPagesDirective.$inject = ['$scope', '$element', '$compile', '$timeout', '$filter', 'CustomerService', 'ParamsMap'];

