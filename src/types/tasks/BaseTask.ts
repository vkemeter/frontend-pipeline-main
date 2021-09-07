export interface TaskConfig {
    src: string,
    dest: string,
    enabled?: boolean
}

export interface WatchableTaskConfig extends TaskConfig {
    watchGlob: string
}
