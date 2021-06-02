export interface TaskConfig {
    src: string,
    dest: string
}

export interface WatchableTaskConfig extends TaskConfig {
    watchGlob: string
}
