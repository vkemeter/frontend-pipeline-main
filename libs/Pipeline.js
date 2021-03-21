const ConfigLoader = require('./ConfigLoader');
const VariableExporterRegistry = require('./variableExporter/VariableExporterRegistry');
const path = require('path');

class Pipeline {
    static DEFAULT_CONFIG_FILEPATH = 'config.js';

    static _initialized = false;
    static _configLoader = new ConfigLoader(this.DEFAULT_CONFIG_FILEPATH);
    static _config;

    static _init() {
        if (this._initialized) {
            return;
        }
        VariableExporterRegistry.loadDefaultExporter();
        this._loadAllUserExporter();
        this._initialized = true;
    }

    static _loadAllUserExporter() {
        const config = this._getCurrentConfig();
        let additionalExporter = this._getObjectPropertyByPath(config, 'config.additionalExporter');

        if (!additionalExporter) {
            return;
        }
        if (typeof additionalExporter === 'string') {
            additionalExporter = additionalExporter.split(',').map(exporter => exporter.trim());
        }
        if (Array.isArray(additionalExporter)) {
            additionalExporter.forEach(this._loadUserExporter.bind(this));
        } else {
            console.warn('Invalid config "config.additionalExporter" will be ignored');
        }
    }

    /**
     * @param {string | AbstractVariableExporter } exporter
     * @private
     */
    static _loadUserExporter(exporter) {
        if(typeof exporter === 'string') {
            if (!path.isAbsolute(exporter)) {
                exporter = path.join(process.cwd(), exporter);
            }
            try {
                exporter = require(exporter);
            } catch(e) {
                console.error(`Invalid exporter definition ${exporter}`);
                return;
            }
        }
        VariableExporterRegistry.register(exporter);
    }

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
        this._initialized = false;
    }

    static get(path, defaultValue = undefined) {
        this._init();
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
        return this._configLoader.get();
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
