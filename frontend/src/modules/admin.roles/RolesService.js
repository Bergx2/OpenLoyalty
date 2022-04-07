export default class RolesService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getRolesList() {
        return this.Restangular.one('admin').one('acl').one('role').get();
    }

    getRole(role) {
        return this.Restangular.one('admin').one('acl').one('role', role).get();
    }

    getAccesses() {
        return this.Restangular.one('admin').one('acl').one('accesses').get();
    }

    getResources() {
        return this.Restangular.one('admin').one('acl').one('resources').get();
    }

    postRole(newRole) {
        return this.Restangular.one('admin').one('acl').one('role').customPOST({ role: newRole });
    }

    postDeleteRole(roleId){
        return this.Restangular.one('admin').one('acl').one('role').customDELETE(roleId);
    }

    putRole(roleId, editedRole) {
        let self = this;
        return this.Restangular.one('admin').one('acl').one('role', roleId).customPUT({ role: self.Restangular.stripRestangular(self.EditableMap.role(editedRole)) });
    }

}

RolesService.$inject = ['Restangular', 'EditableMap'];