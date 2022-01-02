import { renderReactToString } from '../dicts/render'
import { FC } from 'react'
import { IDictResult, ViewPorps } from './IDictResult'

export interface IPageFetch {
    // 从外部接口获取原始网络释义
    getPageResult(word: string): Promise<string> | Promise<any>
}

export interface IPlugin extends IPageFetch {
    // 插件加载完成
    onload?(): boolean

    // 获取释义并解析成对应的纯文本结果，可能会是html文本
    fetch(uuid: string, word: string, srclang?: string, destlang?: string): IDictResult | Promise<IDictResult>

    // 解析原始网络释义
    parsePageResult(pageResult: any, searchWord: string | undefined): any
}

export abstract class HtmlDictPlugin implements IPlugin {
    abstract getPageResult(word: string, srclang?: string, destlang?: string): Promise<any>

    abstract parsePageResult(pageResult: any, searchWord: string | undefined): any

    // react jsx 专用
    abstract htmlTemplate(): FC<ViewPorps<any>>

    async fetch(uuid: string, word: string): Promise<IDictResult> {
        const pageResult = await this.getPageResult(word)
        const parseResult = await this.parsePageResult(pageResult, word)
        const exp = renderReactToString(this.htmlTemplate(), parseResult.result, uuid)
        return { uuid, word, exp }
    }
}