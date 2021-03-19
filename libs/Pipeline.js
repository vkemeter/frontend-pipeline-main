const ConfigLoader = require('./ConfigLoader');

class Pipeline {
    static DEFAULT_CONFIG_FILEPATH = 'config.js';

    static _configLoader = new ConfigLoader(this.DEFAULT_CONFIG_FILEPATH);
    static _config;

    /**
     * @param {string,Object} config
     */
    static setConfig(config) {
        if (typeof config === 'string') {
            this._configLoader = new ConfigLoader(config);
            this._config = undefined;
        } else if (typeof config === 'object' && config !== null) {
            this._config = config;
        }
    }

    static get(path, defaultValue = undefined) {
        const config = this._getCurrentConfig();
        if (path) {
            return this._getObjectPropertyByPath(config, path, defaultValue);
        }
        return config;
    }

    static _getCurrentConfig() {
        if (this._config) {
            return this._config;
        }
        return this._configLoader.load();
    }

    static _getObjectPropertyByPath(object, path, defaultValue = undefined) {
        return path.split('.').reduce((output, pathSegment) => {
            if (output) {
                return output[pathSegment];
            }
            return defaultValue;
        }, object);
    }
}

module.exports = Pipeline;
