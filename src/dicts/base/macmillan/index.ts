import { HtmlDictPlugin } from '../../../interface/IPlugin'
import { DictMacmillan } from './View'
import { getInnerHTML, handleNoResult, HTMLString, getText, getFullLink, DictSearchResult, removeChildren, getOuterHTML, removeChild, externalLink } from '../../helpers'


const HOST = 'http://www.macmillandictionary.com'

export interface MacmillanResultLex {
    type: 'lex'
    title: string
    senses: HTMLString
    /** part of speech */
    pos?: string
    /** syntax coding */
    sc?: string
    phsym?: string
    pron?: string
    ratting?: number
    toggleables: HTMLString[]
    relatedEntries: Array<{
        title: string
        href: string
    }>
}

export interface MacmillanResultRelated {
    type: 'related'
    list: Array<{
        title: string
        href: string
    }>
}

export type MacmillanResult = MacmillanResultLex | MacmillanResultRelated

type MacmillanSearchResult = DictSearchResult<MacmillanResult>

export interface MacmillanPayload {
    href?: string
}

export abstract class MacmillanPlugin extends HtmlDictPlugin {

    parsePageResult(data: any, searchWord: string | undefined): MacmillanSearchResult | Promise<MacmillanSearchResult> {
        const doc = new DOMParser().parseFromString(data, 'text/html')
        //移除展开收起按钮，默认就展开
        doc.querySelectorAll('button.toggle-open, button.toggle-close, a.moreButton').forEach($btn => {
            $btn.remove()
        })
        //移除省略号
        doc.querySelectorAll('.col-xs-6').forEach($div => {
            if ($div.innerHTML === '...') {
                $div.remove()
            }
        })
        doc.querySelectorAll('.toggleable').forEach($toggleable => {
            if ($toggleable.classList.contains('toggleable') && $toggleable.classList.contains('closed')) {
                $toggleable.classList.remove('closed')
            }
        })
        if (doc.querySelector('.senses')) {
            return handleDOM(doc)
        } else {
            const alternatives = [
                ...doc.querySelectorAll<HTMLAnchorElement>('.display-list li a')
            ].map($a => ({
                title: getText($a),
                href: getFullLink(HOST, $a, 'href')
            }))
            if (alternatives.length > 0) {
                return {
                    result: {
                        type: 'related',
                        list: alternatives
                    }
                }
            }
        }
        return handleNoResult()
    }


    htmlTemplate() {
        return DictMacmillan
    }
}


function handleDOM(
    doc: Document
): MacmillanSearchResult | Promise<MacmillanSearchResult> {
    const $entry = doc.querySelector('#entryContent .left-content')
    if (!$entry) {
        return handleNoResult()
    }

    const result: MacmillanResultLex = {
        type: 'lex',
        title: getText($entry, '.big-title .BASE'),
        senses: '',
        toggleables: [],
        relatedEntries: []
    }

    if (!result.title) {
        return handleNoResult()
    }

    $entry
        .querySelectorAll<HTMLAnchorElement>('a.moreButton')
        .forEach(externalLink)

    result.senses = getInnerHTML(HOST, $entry, '.senses')

    if (!result.senses) {
        return handleNoResult()
    }

    removeChild($entry, '.senses')

    result.pos = getText($entry, '.entry-pron-head .PART-OF-SPEECH')
    result.sc = getText($entry, '.entry-pron-head .SYNTAX-CODING')
    result.phsym = getText($entry, '.entry-pron-head .PRON')
    result.ratting = $entry.querySelectorAll('.entry-red-star').length

    $entry.querySelectorAll('.toggleable').forEach($toggleable => {
        result.toggleables.push(getOuterHTML(HOST, $toggleable))
    })

    doc
        .querySelectorAll<HTMLAnchorElement>('.related-entries-item a')
        .forEach($a => {
            const $pos = $a.querySelector('.PART-OF-SPEECH')
            if ($pos) {
                $pos.textContent = getText($pos).toUpperCase()
            }

            result.relatedEntries.push({
                title: getText($a),
                href: getFullLink(HOST, $a, 'href')
            })
        })

    const audio: { uk?: string } = {}

    const $sound = $entry.querySelector<HTMLDivElement>(
        '.entry-pron-head .PRONS .sound'
    )
    if ($sound && $sound.dataset.srcMp3) {
        result.pron = $sound.dataset.srcMp3
        audio.uk = result.pron
    }

    return { result, audio }
}

