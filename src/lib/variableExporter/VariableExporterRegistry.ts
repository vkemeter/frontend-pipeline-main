import {AbstractVariableExporter} from './AbstractVariableExporter'
import * as fs from 'fs'
import * as path from 'path'
import {VariableExportConfig} from '../../types/config/VariableConfig'

type ExporterImplementation =
    (new (exportConfig: VariableExportConfig) => AbstractVariableExporter)
    & typeof AbstractVariableExporter;

export class VariableExporterRegistry {
    private static readonly DEFAULT_EXPORTER_PATH = path.join(__dirname, 'impl')

    defaultExporterLoaded = false
    registeredExporter: Record<string, ExporterImplementation> = {}

    register (Exporter: ExporterImplementation | any) {
        if (!(Exporter.prototype instanceof AbstractVariableExporter)) {
            console.error(`Registered Exporter must extend ${AbstractVariableExporter.name}`)
            return
        }
        if (!Exporter.TARGET_EXPORT_KEY) {
            console.warn('Registered Exporter does not contain a valid TARGET_EXPORT_KEY')
            return
        }
        if (this.registeredExporter.hasOwnProperty(Exporter.TARGET_EXPORT_KEY)) {
            console.warn(`Target Key ${Exporter.TARGET_EXPORT_KEY} is already registered`)
            return
        }
        this.registeredExporter[Exporter.TARGET_EXPORT_KEY] = Exporter
    }

    get (key: string, variableExport: VariableExportConfig): AbstractVariableExporter | void {
        const Exporter = this.registeredExporter[key]
        if (Exporter) {
            return new Exporter(variableExport)
        }
    }

    loadDefaultExporter () {
        if (this.defaultExporterLoaded) {
            return
        }

        fs.readdirSync(VariableExporterRegistry.DEFAULT_EXPORTER_PATH)
            .filter(entry => path.extname(entry).toLowerCase() === '.js')
            .forEach(entry => {
                const exporterFilepath = path.join(VariableExporterRegistry.DEFAULT_EXPORTER_PATH, entry)
                const Exporter = require(exporterFilepath)
                this.register(Exporter)
            })

        this.defaultExporterLoaded = true
    }
}
