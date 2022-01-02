declare module NodeJS {
    interface Global {
        dsBridge: any
        eudic_platform: string
        eudic_bridge: any
        eudic_native: any
        eudic_dicts: any
        webkit: any
    }
}
