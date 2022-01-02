import { HtmlDictPlugin } from '../../interface/IPlugin'
import { DictWebsterLearner } from './View'
import { getInnerHTML, handleNoResult, HTMLString, DictSearchResult } from '../helpers'
import { WebsterlearnerPageFetch } from './pagefetch'


const HOST = 'http://www.learnersdictionary.com'

interface WebsterLearnerResultItem {
    title: HTMLString
    pron?: string

    infs?: HTMLString
    infsPron?: string

    labels?: HTMLString
    senses?: HTMLString
    phrases?: HTMLString
    derived?: HTMLString
    arts?: string[]
}

export interface WebsterLearnerResultLex {
    type: 'lex'
    items: WebsterLearnerResultItem[]
}

export interface WebsterLearnerResultRelated {
    type: 'related'
    list: HTMLString
}

export type WebsterLearnerResult =
    | WebsterLearnerResultLex
    | WebsterLearnerResultRelated

type WebsterLearnerSearchResult = DictSearchResult<WebsterLearnerResult>
type WebsterLearnerSearchResultLex = DictSearchResult<WebsterLearnerResultLex>

export class WebsterlearnerPlugin extends HtmlDictPlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new WebsterlearnerPageFetch()
        return await fetch.getPageResult(word)
    }

    parsePageResult(data: any, searchWord: string | undefined): WebsterLearnerSearchResult | Promise<WebsterLearnerSearchResult> {
        const doc = new DOMParser().parseFromString(data, 'text/html')
        const $alternative = doc.querySelector<HTMLAnchorElement>(
            '[id^="spelling"] .links'
        )
        if (!$alternative) {
            return handleDOM(doc)
        } else {
            return {
                result: {
                    type: 'related',
                    list: getInnerHTML(HOST, $alternative)
                }
            }
        }
        return handleNoResult()
    }


    htmlTemplate() {
        return DictWebsterLearner
    }
}


function handleDOM(
    doc: Document
): WebsterLearnerSearchResultLex | Promise<WebsterLearnerSearchResultLex> {
    doc.querySelectorAll('.d_hidden').forEach(el => el.remove())

    const result: WebsterLearnerResultLex = {
        type: 'lex',
        items: []
    }
    const audio: { us?: string } = {}

    doc.querySelectorAll('.entry').forEach($entry => {
        const entry: WebsterLearnerResultItem = {
            title: ''
        }

        const $headword = $entry.querySelector('.hw_d')
        if (!$headword) {
            return
        }
        const $pron = $headword.querySelector<HTMLAnchorElement>('.play_pron')
        if ($pron) {
            const path = ($pron.dataset.lang || '').replace('_', '/')
            const dir = $pron.dataset.dir || ''
            const file = $pron.dataset.file || ''
            entry.pron = `http://media.merriam-webster.com/audio/prons/${path}/mp3/${dir}/${file}.mp3`
            audio.us = entry.pron
            $pron.remove()
        }
        entry.title = getInnerHTML(HOST, $headword)

        const $headwordInfs = $entry.querySelector('.hw_infs_d')
        if ($headwordInfs) {
            const $pron = $headwordInfs.querySelector<HTMLAnchorElement>('.play_pron')
            if ($pron) {
                const path = ($pron.dataset.lang || '').replace('_', '/')
                const dir = $pron.dataset.dir || ''
                const file = $pron.dataset.file || ''
                entry.infsPron = `http://media.merriam-webster.com/audio/prons/${path}/mp3/${dir}/${file}.mp3`
                $pron.remove()
            }
            entry.infs = getInnerHTML(HOST, $headwordInfs)
        }

        entry.labels = getInnerHTML(HOST, $entry, '.labels')

        entry.senses = getInnerHTML(HOST, $entry, '.sblocks')

        entry.phrases = getInnerHTML(HOST, $entry, '.dros')

        entry.derived = getInnerHTML(HOST, $entry, '.uros')

        entry.arts = Array.from(
            $entry.querySelectorAll<HTMLImageElement>('.arts img')
        ).map($img => $img.src)

        if (
            entry.senses ||
            entry.phrases ||
            entry.derived ||
            (entry.arts && entry.arts.length > 0)
        ) {
            result.items.push(entry)
        }
    })

    if (result.items.length > 0) {
        return { result, audio }
    }

    return handleNoResult()
}
