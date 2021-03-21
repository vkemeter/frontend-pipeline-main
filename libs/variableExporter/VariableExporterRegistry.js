const AbstractVariableExporter = require('./AbstractVariableExporter');
const fs = require('fs');
const path = require('path');

class VariableExporterRegistry {
    static _DEFAULT_EXPORTER_PATH = path.join(__dirname, 'impl');

    static _defaultExporterLoaded = false;
    static _registeredExporter = {};

    static register(Exporter) {
        if (!AbstractVariableExporter.isPrototypeOf(Exporter)) {
            console.error('Registered Exporter must extend AbstractVariableExporter');
            return;
        }
        if (Exporter.TARGET_EXPORT_KEY === AbstractVariableExporter.TARGET_EXPORT_KEY) {
            console.warn('Registered Exporter does not contain a valid TARGET_EXPORT_KEY');
            return;
        }
        if (this._registeredExporter.hasOwnProperty(Exporter.TARGET_EXPORT_KEY)) {
            console.warn(`Target Key ${Exporter.TARGET_EXPORT_KEY} is already registered`);
            return;
        }
        this._registeredExporter[Exporter.TARGET_EXPORT_KEY] = Exporter;
    }

    static get(key) {
        if (!this._registeredExporter.hasOwnProperty(key)) {
            console.warn(`Used key ${key} has no registered Exporter`);
        }
        return this._registeredExporter[key];
    }

    static loadDefaultExporter() {
        if (this._defaultExporterLoaded) {
            return;
        }
        const defaultExporterPathEntries = fs.readdirSync(VariableExporterRegistry._DEFAULT_EXPORTER_PATH);
        for (const exporterFilename of defaultExporterPathEntries) {
            const exporterFilepath = path.join(VariableExporterRegistry._DEFAULT_EXPORTER_PATH, exporterFilename);
            const Exporter = require(exporterFilepath);
            this.register(Exporter);
        }
        this._defaultExporterLoaded = true;
    }
}

module.exports = VariableExporterRegistry;
