export interface VariableConfig {
    config: Record<string, VariableConfigurationEntry>
}

export interface VariableConfigurationEntry {
    export: Record<string, VariableExportConfig>
    values: VariableValues[]
}

export interface VariableExportConfig {
    name: string,
    file: string,
    additional?: string,
    typecast?: string
}

export interface VariableValues {
    key: string,
    value: string
}
