export interface IDictResult {
    uuid: string
    word: string
    exp: string
    srclang?: string
    destlang?: string
    errMsg?: string
}

export const DictNoResult: IDictResult = { uuid: '-1', word: '', exp: '' }

export interface ViewPorps<T> {
    result: T
}
