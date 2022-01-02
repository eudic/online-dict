import { HtmlDictPlugin } from '../../../interface/IPlugin'
import { DictJukuu } from './View'
import { getInnerHTML, HTMLString, getText, removeChildren, DictSearchResult, handleNoResult } from '../../helpers'


export type JukuuLang = 'engjp' | 'zhjp' | 'zheng'

interface JukuuTransItem {
    trans: HTMLString
    original: string
    src: string
}

export interface JukuuResult {
    lang: JukuuLang
    sens: JukuuTransItem[]
}

export interface JukuuPayload {
    lang?: JukuuLang
}

type JukuuSearchResult = DictSearchResult<JukuuResult>

export abstract class JukuuPlugin extends HtmlDictPlugin {


    parsePageResult(pageResult: any, searchWord: string | undefined): JukuuSearchResult | Promise<JukuuSearchResult> {
        if (!pageResult) {
            return handleNoResult()
        }
        const doc = new DOMParser().parseFromString(pageResult, 'text/html')
        const senns = [...doc.querySelectorAll('tr.e')]
            .map($e => {
                const $trans = $e.lastElementChild
                if (!$trans) {
                    return
                }
                removeChildren($trans, 'img')

                const $original = $e.nextElementSibling
                if (!$original || !$original.classList.contains('c')) {
                    return
                }

                const $src = $original.nextElementSibling

                return {
                    trans: getInnerHTML('http://www.jukuu.com', $trans),
                    original: getText($original).replaceAll('</b>', ''),
                    src:
                        $src && $src.classList.contains('s')
                            ? getText($src).replace(/^[\s-]*/, '')
                            : ''
                }
            })
            .filter((item): item is JukuuTransItem => Boolean(item && item.trans))
        return senns.length > 0 ? { result: { lang: 'zhjp', sens: senns } } : handleNoResult()
    }


    htmlTemplate() {
        return DictJukuu
    }
}
