import { HtmlDictPlugin } from '../../interface/IPlugin'
import { DictEtymonline } from './View'
import { getInnerHTML, handleNoResult, SearchErrorType, HTMLString, externalLink, getText, getFullLink, DictSearchResult } from '../helpers'
import { EtymonlinePageFetch } from './pagefetch'

const HOST = 'https://www.etymonline.com'

type EtymonlineResultItem = {
    id: string
    title: string
    def: HTMLString
    href?: string
    chart?: string
}

export type EtymonlineResult = EtymonlineResultItem[]

type EtymonlineSearchResult = DictSearchResult<EtymonlineResult>

export class EtymonlinePlugin extends HtmlDictPlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new EtymonlinePageFetch()
        return await fetch.getPageResult(word)
    }

    parsePageResult(pageResult: string, searchWord: string | undefined): EtymonlineSearchResult | Promise<EtymonlineSearchResult> {
        const doc = new DOMParser().parseFromString(pageResult, 'text/html')
        const result: EtymonlineResult = []
        const catalog: NonNullable<EtymonlineSearchResult['catalog']> = []
        const $items = Array.from(doc.querySelectorAll('[class*="word--"]'))

        for (let i = 0; i < $items.length; i++) {
            const $item = $items[i]

            const title = getText($item, '[class*="word__name--"]')
            if (!title) {
                continue
            }

            let def = ''
            const $def = $item.querySelector('[class*="word__defination--"]>*')
            if ($def) {
                $def.querySelectorAll('.crossreference').forEach($cf => {
                    const word = getText($cf)

                    const $a = document.createElement('a')
                    $a.target = '_blank'
                    $a.href = `https://www.etymonline.com/word/${word}`
                    $a.textContent = word

                    $cf.replaceWith($a)
                })
                def = getInnerHTML(HOST, $def)
            }
            if (!def) {
                continue
            }

            const href = getFullLink(HOST, $item, 'href')

            let chart = ''
            const $chart = $item.querySelector<HTMLImageElement>(
                '[class*="chart--"] img'
            )
            if ($chart) {
                chart = getFullLink(HOST, $chart, 'src')
            }

            const id = `d-etymonline-entry${i}`

            result.push({ id, href, title, def, chart })

            catalog.push({
                key: `#${i}`,
                value: id,
                label: `#${title}`
            })
        }

        if (result.length > 0) {
            return { result, catalog }
        }

        return handleNoResult()
    }


    htmlTemplate() {
        return DictEtymonline
    }
}
