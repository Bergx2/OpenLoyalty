export default class RolesController {
    constructor($scope, $state, AuthService, RolesService, Flash, NgTableParams, $q, ParamsMap, $stateParams, EditableMap, DataService, Validation, $filter) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            AuthService.logout();
        }
        this.$scope = $scope;
        this.RolesService = RolesService;
        this.$state = $state;
        this.Flash = Flash;
        this.AuthService = AuthService;
        this.$scope.newRole = { permissions: [] };
        this.$scope.editableFields = {};
        this.roleId = $stateParams.roleId || null;
        this.NgTableParams = NgTableParams;
        this.ParamsMap = ParamsMap;
        this.EditableMap = EditableMap;
        this.$q = $q;
        this.Validation = Validation;
        this.$filter = $filter;
        this.config = DataService.getConfig();
        this.$scope.frontValidate = {
            name: '@assert:not_blank'
        };

        this.loaderStates = {
            rolesList: true,
            roleDetails: true,
            removeRole: false
        }

        this.accessesConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.resourcesConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
    }

    getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
                getData: function (params) {
                    let dfd = self.$q.defer();

                    self.loaderStates.rolesList = true;
                    self.RolesService.getRolesList()
                        .then(
                            res => {
                                self.$scope.rolesList = res.roles;
                                params.total(res.total);
                                self.loaderStates.rolesList = false;
                                dfd.resolve(res);
                            },
                            () => {
                                let message = self.$filter('translate')('xhr.get_roles_list.error');
                                self.Flash.create('danger', message);
                                self.loaderStates.rolesList = false;
                                dfd.reject();
                            }
                        );

                    return dfd.promise;
                }
            });
    }

    getAccesses() {
        let self = this;

            self.RolesService.getAccesses()
                .then(
                    res => {
                        self.accesses = res.accesses;
                    },
                    () => {
                        let message = self.$filter('translate')('xhr.get_accesses.error');
                        self.Flash.create('danger', message);
                    }
                )
        }

    getResources() {
        let self = this;

        self.RolesService.getResources()
            .then(
                res => {
                    self.resources = res.resources;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_resources.error');
                    self.Flash.create('danger', message);
                }
            )
    }


    getRoleData() {
        let self = this;
        self.loaderStates.roleDetails = true;
        if (self.roleId) {
            self.RolesService.getRole(self.roleId)
                .then(
                    res => {
                        self.$scope.role = res;
                        self.$scope.editableFields = res;
                        self.loaderStates.roleDetails = false;
                    },
                    () => {
                        let message = self.$filter('translate')('xhr.get_role.error');
                        self.Flash.create('danger', message);
                        self.loaderStates.roleDetails = false;
                    }
                )
        } else {
            self.$state.go('admin.role-list');
            let message = self.$filter('translate')('xhr.get_role.no_id');
            self.Flash.create('warning', message);
            self.loaderStates.roleDetails = false;
        }
    }

    editRole(editedRole) {
        let self = this;
        let validateFields = angular.copy(self.$scope.frontValidate);
        let frontValidation = self.Validation.frontValidation(editedRole, validateFields);
        self.loaderStates.roleDetails = true;

        if (_.isEmpty(frontValidation)) {
            self.RolesService.putRole(self.roleId, editedRole)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.put_role.success');
                        self.Flash.create('success', message);
                        self.$state.go('admin.roles-list')
                        self.loaderStates.rolesDetails = false;
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.put_role.error');
                        self.Flash.create('danger', message);
                        self.loaderStates.rolesDetails = false;
                    }
                )
        } else {
            self.$scope.validate = frontValidation;
            let message = self.$filter('translate')('xhr.put_role.error');
            self.Flash.create('danger', message);
            self.loaderStates.rolesDetails = false;
        }
    }

    addRole(newRole) {
        let self = this;
        let validateFields = angular.copy(self.$scope.frontValidate);
        let frontValidation = self.Validation.frontValidation(newRole, validateFields);
        self.loaderStates.roleDetails = true;

        if (_.isEmpty(frontValidation)) {
            self.RolesService.postRole(newRole)
                .then(
                    res => {
                        let message = self.$filter('translate')('xhr.post_role.success');
                        self.Flash.create('success', message);
                        self.$state.go('admin.roles-list')
                        self.loaderStates.roleDetails = false;
                    },
                    res => {
                        self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                        let message = self.$filter('translate')('xhr.post_role.error');
                        self.Flash.create('danger', message);
                        self.loaderStates.roleDetails = false;
                    }
                );
        } else {
            self.$scope.validate = frontValidation;
            let message = self.$filter('translate')('xhr.post_role.error');
            self.Flash.create('danger', message);
            self.loaderStates.roleDetails = false;
        }
    }

    addPermission(edit) {
        if (edit) {
            if (!(this.$scope.editableFields.permissions instanceof Array)) {
                this.$scope.editableFields.permissions = [];
            }
            this.$scope.editableFields.permissions.push({
                access: '',
                resource: ''
            })
        } else {
            this.$scope.newRole.permissions.push({
                access: '',
                resource: ''
            })
        }
    }

    removePermission(index, edit) {
        let self = this;
        let role;

        if (!edit) {
            role = self.$scope.newRole;
        } else {
            role = self.$scope.editableFields;
        }

        role.permissions = _.difference(role.permissions, [role.permissions[index]])
    }

    removeRole(roleId) {
        let self = this;
        self.loaderStates.removeRole = true;

        self.RolesService.postDeleteRole(roleId)
            .then(
                () => {
                    let message = self.$filter('translate')('xhr.post_delete_role.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                    self.loaderStates.removeRole = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_delete_role.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.removeRole = false;
                }
            )
    }

}

RolesController.$inject = ['$scope', '$state', 'AuthService', 'RolesService', 'Flash', 'NgTableParams', '$q', 'ParamsMap', '$stateParams', 'EditableMap', 'DataService', 'Validation', '$filter'];
