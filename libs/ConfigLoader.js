const path = require('path');
const read = require('read-data');
const fs = require('fs');

class ConfigLoader {
    static DEFAULT_EXTENSION_HIERARCHY = ['.js', '.json', '.yaml', '.yml'];

    /**
     * @private
     * @type {Array<string>|undefined}
     */
    _extensionHierarchy;
    /**
     * @private
     * @type {string | undefined}
     */
    _configFilepath;
    /**
     * @private
     * @type {Object | undefined}
     */
    _cachedConfig;

    /**
     * @param {string} configFilepath
     * @param {Object} options
     * @param {Array<string>} options.extensionHierarchy
     */
    constructor(configFilepath, {extensionHierarchy} = {}) {
        this._configFilepath = this._getAbsoluteFilepath(configFilepath);
        this._extensionHierarchy = this._getExtensionHierarchyOrDefault(extensionHierarchy);
    }

    /**
     * @param {Array<string> | undefined} extensionHierarchy
     * @return {Array<string>}
     * @private
     */
    _getExtensionHierarchyOrDefault(extensionHierarchy) {
        if (Array.isArray(extensionHierarchy)) {
            return extensionHierarchy;
        }
        return ConfigLoader.DEFAULT_EXTENSION_HIERARCHY;
    }

    /**
     * @param {string | undefined} relativeOrAbsoluteFilepath
     * @return {string}
     * @private
     */
    _getAbsoluteFilepath(relativeOrAbsoluteFilepath) {
        if (path.isAbsolute(relativeOrAbsoluteFilepath)) {
            return relativeOrAbsoluteFilepath;
        }
        const executionPath = process.cwd();
        return path.join(executionPath, relativeOrAbsoluteFilepath);
    }

    /**
     * @param {string} configFilepath
     * @return {Object}
     * @private
     */
    _loadConfig(configFilepath) {
        const fileExtension = path.extname(configFilepath);
        if (fileExtension) {
            return this._loadConfigFile(configFilepath);
        }
        const foundConfigFilepath = this._findHighestOrderConfigFile(configFilepath);
        return this._loadConfigFile(foundConfigFilepath);
    }

    /**
     * @param {string} configFilepath
     * @return {Object}
     * @private
     */
    _loadConfigFile(configFilepath) {
        const extension = path.extname(configFilepath);
        if (!this._extensionHierarchy.includes(extension)) {
            throw new Error(`Cannot load ${configFilepath}. Extension ${extension} is not allowed`);
        }
        if (extension === '.js') {
            return this._loadJsConfigFile(configFilepath);
        }
        return this._loadJsonOrYamlConfigFile(configFilepath);
    }

    /**
     * @param {string} configFilepath - Absolute path to JS-File
     * @return {Object}
     * @private
     */
    _loadJsConfigFile(configFilepath) {
        let configuration = require(configFilepath);
        if (configuration && typeof configuration === 'function') {
            configuration = configuration();
        }
        return configuration;
    }

    /**
     * @param {string} configFilepath
     * @return {Object}
     * @private
     */
    _loadJsonOrYamlConfigFile(configFilepath) {
        return read.sync(configFilepath);
    }

    /**
     * @param {string} configFilepath
     * @return {string}
     * @private
     */
    _findHighestOrderConfigFile(configFilepath) {
        const foundConfigFiles = this._findConfigFilesInPath(configFilepath);
        const highestOrderConfigFile = this._findHighestOrderConfigFileInFiles(foundConfigFiles);
        if (!highestOrderConfigFile) {
            throw new Error(`Cannot find any config files with valid extension in ${directoryPath}`);
        }
        return path.format({
            dir: path.dirname(configFilepath),
            base: highestOrderConfigFile
        });
    }

    /**
     * @param {ParsedPath[]} foundConfigFiles
     * @return {string}
     * @private
     */
    _findHighestOrderConfigFileInFiles(foundConfigFiles) {
        for (let extension of this._extensionHierarchy) {
            const configFile = foundConfigFiles.find(file => file.ext === extension);
            if (configFile) {
                return configFile.base;
            }
        }
        return null;
    }

    /**
     * @param {string} configFilepath
     * @return ParsedPath[]>
     * @private
     */
    _findConfigFilesInPath(configFilepath) {
        const directoryPath = path.dirname(configFilepath);
        const filename = path.basename(configFilepath)
        const srcPathEntries = fs.readdirSync(directoryPath, {withFileTypes: true});
        return srcPathEntries
            .filter(entry => entry.isFile())
            .map(entry => path.parse(entry.name))
            .filter(entry => entry.name === filename && this._extensionHierarchy.includes(entry.ext));
    }

    /**
     * @return {Object}
     */
    forceLoadFromDisk() {
        this._cachedConfig = this._loadConfig(this._configFilepath);
        return this._cachedConfig;
    }

    /**
     * @return {Object}
     */
    load() {
        if (!this._cachedConfig) {
            return this.forceLoadFromDisk();
        }
        return this._cachedConfig;
    }
}

module.exports = ConfigLoader;
