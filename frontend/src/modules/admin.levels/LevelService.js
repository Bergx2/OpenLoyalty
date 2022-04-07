export default class LevelService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getLevels(params) {
        return this.Restangular.all('level').getList(params);
    }

    getLevel(levelId) {
        return this.Restangular.one('level', levelId).get();
    }

    postLevel(newLevel) {
        return this.Restangular.one('level').one('create').customPOST({level: newLevel})
    }

    getLevelCustomers(params, levelId) {
        if(!params) {
            params = {}
        }
        return this.Restangular.one('level', levelId).all('customers').getList();
    }
    getFile(levelId) {
        return this.Restangular.one('csv').one('level', levelId).get();
    }
    putLevel(editedLevel) {
        let self = this;

        return editedLevel.customPUT({level: self.EditableMap.level(editedLevel)});
    }

    postActivateLevel(state, levelId) {
        let self = this;

        return this.Restangular.one('level').one(levelId).one('activate').customPOST({active: state})
    }

    /**
     * Calls for post image to level
     *
     * @method postLevelImage
     * @param {Integer} levelId
     * @param {Object} data
     * @returns {Promise}
     */
    postLevelImage(levelId, data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('level', levelId)
            .one('photo')
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    /**
     * Calls for level image
     *
     * @method getLevelImage
     * @param {Integer} levelId
     * @returns {Promise}
     */
    getLevelImage(levelId) {
        return this.Restangular.one('level', levelId).one('photo').get();
    }

    /**
     * Calls to remove level photo
     *
     * @method deleteLevelImage
     * @param {Integer} levelId
     * @returns {Promise}
     */
    deleteLevelImage(levelId) {
        return this.Restangular
            .one('level', levelId)
            .one('photo')
            .remove()
    }
}

LevelService.$inject = ['Restangular', 'EditableMap'];
