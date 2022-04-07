export default class SettingsService {
    constructor(Restangular, $q, EditableMap) {
        this.Restangular = Restangular;
        this.$q = $q;
        this.EditableMap = EditableMap;
        this.settings = null;
        this._logoFileError = {};
        this._smallLogoFileError = {};
    }

    /**
     * Gets stored logo file error
     *
     * @method storedFileError
     */
    get storedFileError() {
        return this._logoFileError
    }

    /**
     * Sets stored logo file error
     *
     * @method storedFileError
     */
    set storedFileError(error) {
        this._logoFileError = error;
    }

    getSettingsData() {
        let self = this;
        let dfd = self.$q.defer();

        self.Restangular.one('settings').get()
            .then(
                res => {
                    self.settings = self._toObject(res.settings);
                    dfd.resolve();
                },
                () => {
                    dfd.reject();
                }
            );

        return dfd.promise;
    }

    postSettings(editedSettings) {
        let self = this;
        let data = self.EditableMap.settings(editedSettings);

        return self.Restangular.one('settings').customPOST({ settings: data });
    }

    getSettings() {
        return this.settings;
    }

    /**
     * Calls for post Admin Cockpit logo
     *
     * @method postLogo
     * @param {Object} data
     * @returns {Promise}
     */
    postLogo(data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('settings')
            .one('photo')
            .one('logo')
            .withHttpConfig({ transformRequest: angular.identity })
            .customPOST(fd, '', undefined, { 'Content-Type': undefined });
    }

    /**
     * Calls for post post conditions file
     *
     * @method postConditionsFile
     * @param {Object} data
     * @returns {Promise}
     */
    postConditionsFile(data) {
        let fd = new FormData();

        fd.append('conditions[file]', data);

        return this.Restangular
            .one('settings')
            .one('conditions-file')
            .withHttpConfig({ transformRequest: angular.identity })
            .customPOST(fd, '', undefined, { 'Content-Type': undefined });
    }

    /**
     * Calls for post hero image
     *
     * @method postHeroImage
     * @param {Object} data
     * @returns {Promise}
     */
    postHeroImage(data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('settings')
            .one('photo')
            .one('hero-image')
            .withHttpConfig({ transformRequest: angular.identity })
            .customPOST(fd, '', undefined, { 'Content-Type': undefined });
    }

    /**
     * Calls for post Client Cockpit small logo
     *
     * @method postSmallLogo
     * @param {Object} data
     * @returns {Promise}
     */
    postSmallLogo(data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('settings')
            .one('photo')
            .one('small-logo')
            .withHttpConfig({ transformRequest: angular.identity })
            .customPOST(fd, '', undefined, { 'Content-Type': undefined });
    }

    /**
     * Calls for post Client Cockpit big logo
     *
     * @method postBigLogo
     * @param {Object} data
     * @returns {Promise}
     */
    postBigLogo(data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('settings')
            .one('photo')
            .one('client-cockpit-logo-big')
            .withHttpConfig({
                transformRequest: angular.identity
            })
            .customPOST(fd, '', undefined, {
                'Content-Type': undefined
            });
    }

    /**
     * Calls for Admin Cockpit logo
     *
     * @method getLogo
     * @returns {Promise}
     */
    getLogo() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('logo')
            .get()
    }

    /**
     * Calls for Client Cockpit small logo
     *
     * @method getSmallLogo
     * @returns {Promise}
     */
    getSmallLogo() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('small-logo')
            .get()
    }

    /**
     * Calls for Client Cockpit big logo
     *
     * @method getBigLogo
     * @returns {Promise}
     */
    getBigLogo() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('client-cockpit-logo-big')
            .get()
    }

    /**
     * Calls for conditions file
     *
     * @method getConditionsFile
     * @returns {Promise}
     */
    getConditionsFile() {
        return this.Restangular
            .one('settings')
            .one('conditions-file')
            .get()
    }

    /**
     * Calls for conditions url
     *
     * @method getConditionsUrl
     * @returns {Promise}
     */
    getConditionsUrl() {
        return this.Restangular
            .one('settings')
            .one('conditions-url')
            .get()
    }

    /**
     * Calls for hero image
     *
     * @method getHeroImage
     * @returns {Promise}
     */
    getHeroImage() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('hero-image')
            .get()
    }

    /**
     * Calls to remove logo
     *
     * @method deleteLogo
     * @returns {Promise}
     */
    deleteLogo() {
        return this.Restangular
            .one('settings')
            .one('logo')
            .remove()
    }

    /**
     * Calls to remove small logo
     *
     * @method deleteSmallLogo
     * @returns {Promise}
     */
    deleteSmallLogo() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('small-logo')
            .remove()
    }

    /**
     * Calls to remove big logo
     *
     * @method deleteBigLogo
     * @returns {Promise}
     */
    deleteBigLogo() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('client-cockpit-logo-big')
            .remove()
    }

    /**
     * Calls to remove small logo
     *
     * @method deleteSmallLogo
     * @returns {Promise}
     */
    deleteHeroImage() {
        return this.Restangular
            .one('settings')
            .one('photo')
            .one('hero-image')
            .remove()
    }

    /**
     * Calls to remove small logo
     *
     * @method deleteSmallLogo
     * @returns {Promise}
     */
    deleteConditionsFile() {
        return this.Restangular
            .one('settings')
            .one('conditions-file')
            .remove()
    }

    _toObject(data) {
        let res = {};
        for (let i in data) {
            res[i] = data[i]
        }

        return res;
    }

}

SettingsService.$inject = ['Restangular', '$q', 'EditableMap'];
