export interface VariableConfig {
    readonly SCHEMA: 'VariableConfiguration'
    config: {
        [key: string]: VariableConfigurationEntry
    }
}

export interface VariableConfigurationEntry {
    export: {
        [key: string]: VariableExport
    },
    values: VariableValue[]
}

export interface VariableExport {
    name: string,
    file: string,
    additional?: string,
    typecast?: string
}

export interface VariableValue {
    key: string,
    value: string
}
