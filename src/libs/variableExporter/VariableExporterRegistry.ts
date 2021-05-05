import {AbstractVariableExporter} from './AbstractVariableExporter';
import * as fs from 'fs';
import * as path from 'path';

export class VariableExporterRegistry {
    private static readonly DEFAULT_EXPORTER_PATH = path.join(__dirname, 'impl');

    defaultExporterLoaded = false;
    registeredExporter: Record<string, typeof AbstractVariableExporter> = {};

    register(Exporter: typeof AbstractVariableExporter) {
        if (!AbstractVariableExporter.isPrototypeOf(Exporter)) {
            console.error('Registered Exporter must extend AbstractVariableExporter');
            return;
        }
        if (Exporter.TARGET_EXPORT_KEY === AbstractVariableExporter.TARGET_EXPORT_KEY) {
            console.warn('Registered Exporter does not contain a valid TARGET_EXPORT_KEY');
            return;
        }
        if (this.registeredExporter.hasOwnProperty(Exporter.TARGET_EXPORT_KEY)) {
            console.warn(`Target Key ${Exporter.TARGET_EXPORT_KEY} is already registered`);
            return;
        }
        this.registeredExporter[Exporter.TARGET_EXPORT_KEY] = Exporter;
    }

    get(key: string) {
        if (!this.registeredExporter.hasOwnProperty(key)) {
            console.warn(`Used key ${key} has no registered Exporter`);
        }
        return this.registeredExporter[key];
    }

    loadDefaultExporter() {
        if (this.defaultExporterLoaded) {
            return;
        }
        const defaultExporterPathEntries = fs.readdirSync(VariableExporterRegistry.DEFAULT_EXPORTER_PATH);
        for (const exporterFilename of defaultExporterPathEntries) {
            const exporterFilepath = path.join(VariableExporterRegistry.DEFAULT_EXPORTER_PATH, exporterFilename);
            const Exporter = require(exporterFilepath);
            this.register(Exporter);
        }
        this.defaultExporterLoaded = true;
    }
}
