export interface VariableConfiguration {
    config: Record<string, VariableConfigurationEntry>
}

export interface VariableConfigurationEntry {
    export: Record<string, VariableExport>,
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
