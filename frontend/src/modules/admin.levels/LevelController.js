export default class LevelController {
    constructor($scope, $state, $timeout, AuthService, LevelService, Flash, NgTableParams, $q, ParamsMap, $stateParams, EditableMap, Validation, $filter, DataService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            AuthService.logout();
        }
        this.$scope = $scope;
        this.LevelService = LevelService;
        this.$state = $state;
        this.AuthService = AuthService;
        this.Flash = Flash;
        this.levelId = $stateParams.levelId || null;
        this.levelName = $stateParams.levelName || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.EditableMap = EditableMap;
        this.$q = $q;
        this.Validation = Validation;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.config = DataService.getConfig();
        this.DataService = DataService;
        this.$scope.fileValidate = {};
        // If 'required: true' it will only
        // be required on default language
        this.$scope.translatableFields = [
            {
                key: 'name',
                label: 'level.name',
                prompt: 'level.name_prompt',
                required: true
            },
            {
                key: 'description',
                label: 'level.description',
                prompt: 'level.description_prompt',
                required: false
            }
        ];
        this.$scope.availableFrontendTranslations = this.DataService.getAvailableFrontendTranslations();
        this.active = [
            {
                name: this.$filter('translate')('global.active'),
                type: 1
            },
            {
                name: this.$filter('translate')('global.inactive'),
                type: 0
            }
        ];
        this.activeConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1
        };
        this.loaderStates = {
            levelList: true,
            levelDetails: true,
            userList: true,
            coverLoader: true
        }
    }

    getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();

                self.loaderStates.levelList = true;
                self.LevelService.getLevels(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.$scope.levels = res;
                            params.total(res.total);
                            self.loaderStates.levelList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.resolve(res);
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_levels_list.error');
                            self.Flash.create('danger', message);
                            self.loaderStates.levelList = false;
                            self.loaderStates.coverLoader = false;
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    getLevelCustomersData() {
        let self = this;

        if (self.levelId) {
            self.tableCustomerParams = new self.NgTableParams({}, {
                getData: function (params) {
                    let dfd = self.$q.defer();
                    self.loaderStates.userList = true;

                    self.LevelService.getLevelCustomers(self.ParamsMap.params(params.url()), self.levelId)
                        .then(
                            function (res) {
                                self.$scope.customers = res;
                                params.total(res.total);
                                self.loaderStates.userList = false;
                                self.loaderStates.coverLoader = false;
                                dfd.resolve(res);
                            },
                            function () {
                                let message = self.$filter('translate')('xhr.get_level_customers.error');
                                self.Flash.create('danger', message);
                                self.loaderStates.userList = false;
                                self.loaderStates.coverLoader = false;
                                dfd.reject();
                            }
                        );

                    return dfd.promise;
                }
            });
        } else {
            self.$state.go('admin.levels-list');
            let message = self.$filter('translate')('xhr.get_level_customers.no_id');
            self.Flash.create('warning', message);
            self.loaderStates.userList = false;
            self.loaderStates.coverLoader = false;
        }
    }

    getLevelData() {
        let self = this;

        if (self.levelId) {
            self.LevelService.getLevel(self.levelId)
                .then(
                    res => {
                        self.$scope.level = res;
                        self.$scope.editableFields = self.EditableMap.humanizeLevel(res)
                        self.loaderStates.coverLoader = false;
                    },
                    () => {
                        let message = self.$filter('translate')('xhr.get_levels_list.error');
                        self.Flash.create('danger', message);
                        self.loaderStates.coverLoader = false;
                    }
                );

            self.LevelService.getLevelImage(self.levelId)
                .then(
                    res => {
                        self.$scope.levelImagePath = true;
                    }
                )
                .catch(
                    err => {
                        self.$scope.levelImagePath = false;
                    }
                );

        } else {
            self.$state.go('admin.levels-list');
            let message = self.$filter('translate')('xhr.get_single_level.no_id');
            self.Flash.create('warning', message);
            self.loaderStates.coverLoader = false;
        }
    }

    getLevelCsvData(levelId, levelName) {
        let self = this;
        if (levelId) {
            self.LevelService.getFile(levelId)
                .then(
                    function (res) {
                        let date = new Date();
                        let filename = levelName.replace(" ", "-") + "-" + date.toISOString().substring(0, 10) + ".csv";
                        let blob = new Blob([res], {type: 'text/csv'});
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob);
                            return;
                        }

                        const data = window.URL.createObjectURL(blob);

                        let link = document.createElement('a');
                        link.href = data;
                        link.download = filename;
                        self.$timeout(function() { link.dispatchEvent(new MouseEvent('click')); }, 2000);
                    }
                );
        }
    }

    addLevel(newLevel) {
        let self = this;

        self.LevelService.postLevel(newLevel)
            .then(
                res => {
                    if (self.$scope.levelImage) {
                        self.$scope.fileValidate = {};

                        self.LevelService.postLevelImage(res.id, self.$scope.levelImage)
                            .then(
                                res2 => {
                                    self.$state.go('admin.levels-list', {levelId: self.levelId});
                                    let message = self.$filter('translate')('xhr.post_single_level.success');
                                    self.Flash.create('success', message);
                                }
                            )
                            .catch(
                                err => {
                                    self.$scope.fileValidate = self.Validation.mapSymfonyValidation(err.data);
                                    self.LevelService.storedFileError = self.$scope.fileValidate;

                                    let message = self.$filter('translate')('xhr.post_single_level.warning');
                                    self.Flash.create('warning', message);

                                    self.$state.go('admin.edit-level', {levelId: res.id});
                                }
                            );

                    } else {

                        self.$state.go('admin.levels-list');
                        let message = self.$filter('translate')('xhr.post_single_level.success');
                        self.Flash.create('success', message);
                    }
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.post_single_level.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    editLevel(editedLevel) {
        let self = this;

        self.LevelService.putLevel(editedLevel)
            .then(
                res => {

                    if (self.$scope.levelImage) {
                        self.$scope.fileValidate = {};

                        self.LevelService.postLevelImage(self.levelId, self.$scope.levelImage)
                            .then(
                                res2 => {
                                    self.$state.go('admin.levels-list', {levelId: self.levelId});
                                    let message = self.$filter('translate')('xhr.put_single_level.success');
                                    self.Flash.create('success', message);
                                }
                            )
                            .catch(
                                err => {
                                    self.$scope.fileValidate = self.Validation.mapSymfonyValidation(err.data);
                                    self.LevelService.storedFileError = self.$scope.fileValidate;

                                    let message = self.$filter('translate')('xhr.put_single_level.warning');
                                    self.Flash.create('warning', message);

                                    self.$state.go('admin.edit-level', {levelId: self.levelId});
                                }
                            );

                    } else {
                        let message = self.$filter('translate')('xhr.put_single_level.success');
                        self.Flash.create('success', message);
                        self.$state.go('admin.levels-list');
                    }
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.put_single_level.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    addSpecialReward(edit) {
        let self = this;
        let level;

        if (!edit) {
            level = self.$scope.newLevel;
        } else {
            level = self.$scope.editableFields;
        }

        level.specialRewards.push({
            active: 0,
            startAt: '',
            endAt: ''
        })
    }

    removeSpecialReward(index, edit) {
        let self = this;
        let level;

        if (!edit) {
            level = self.$scope.newLevel;
        } else {
            level = self.$scope.editableFields;
        }

        level.specialRewards = _.difference(level.specialRewards, [level.specialRewards[index]])
    }

    setLevelState(state, levelId) {
        let self = this;

        self.LevelService.postActivateLevel(state, levelId)
            .then(
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_level.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_level.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Deletes photo
     *
     * @method deletePhoto
     */
    deletePhoto() {
        let self = this;

        this.LevelService.deleteLevelImage(this.levelId)
            .then(
                res => {
                    self.$scope.levelImagePath = false;
                    let message = self.$filter('translate')('xhr.delete_level_image.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_level_image.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Generating photo route
     *
     * @method generatePhotoRoute
     * @returns {string}
     */
    generatePhotoRoute() {
        return this.config.apiUrl + '/level/' + this.levelId + '/photo'
    }
}

LevelController.$inject = ['$scope', '$state', '$timeout', 'AuthService', 'LevelService', 'Flash', 'NgTableParams', '$q', 'ParamsMap', '$stateParams', 'EditableMap', 'Validation', '$filter', 'DataService'];
