import { HtmlDictPlugin } from '../../interface/IPlugin'
import { DictLongman } from './View'
import { getInnerHTML, handleNoResult, HTMLString, getText, getFullLink, DictSearchResult } from '../helpers'
import { LongmanPageFetch } from './pagefetch'
import { getStaticSpeaker } from '../../components/Speaker'

const HOST = 'https://www.ldoceonline.com'

export interface LongmanResultEntry {
    title: {
        HWD: string
        HYPHENATION: string
        HOMNUM: string
    }
    senses: HTMLString[]
    prons: Array<{
        lang: string
        pron: string
    }>
    topic?: {
        title: string
        href: string
    }
    phsym?: string
    level?: {
        rate: number
        title: string
    }
    freq?: Array<{
        title: string
        rank: string
    }>
    pos?: string
    collocations?: HTMLString
    grammar?: HTMLString
    thesaurus?: HTMLString
    examples?: HTMLString[]
}

export interface LongmanResultLex {
    type: 'lex'
    bussinessFirst: boolean
    contemporary: LongmanResultEntry[]
    bussiness: LongmanResultEntry[]
    wordfams?: HTMLString
}

export interface LongmanResultRelated {
    type: 'related'
    list: HTMLString
}

export type LongmanResult = LongmanResultLex | LongmanResultRelated

type LongmanSearchResult = DictSearchResult<LongmanResult>
type LongmanSearchResultLex = DictSearchResult<LongmanResultLex>
type LongmanSearchResultRelated = DictSearchResult<LongmanResultRelated>


export class LongmanPlugin extends HtmlDictPlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new LongmanPageFetch()
        return await fetch.getPageResult(word)
    }

    parsePageResult(data: any, searchWord: string | undefined): LongmanSearchResult | Promise<LongmanSearchResult> {
        const doc = new DOMParser().parseFromString(data, 'text/html')
        if (doc.querySelector('.dictentry')) {
            return handleDOMLex(doc)
        } else {
            return handleDOMRelated(doc)
        }
    }


    htmlTemplate() {
        return DictLongman
    }
}


function handleDOMLex(
    doc: Document
): LongmanSearchResultLex | Promise<LongmanSearchResultLex> {
    const result: LongmanResultLex = {
        type: 'lex',
        bussinessFirst: false,
        contemporary: [],
        bussiness: []
    }

    const audio: { uk?: string; us?: string } = {}

    doc
        .querySelectorAll<HTMLSpanElement>('.speaker.exafile')
        .forEach($speaker => {
            const mp3 = $speaker.dataset.srcMp3
            if (mp3) {
                const parent = $speaker.parentElement
                $speaker.replaceWith(getStaticSpeaker(mp3))
                if (parent && parent.classList.contains('EXAMPLE')) {
                    parent.classList.add('withSpeaker')
                }
            }
        })

    result.wordfams = getInnerHTML(HOST, doc, '.wordfams')

    const $dictentries = doc.querySelectorAll('.dictentry')
    let currentDict: 'contemporary' | 'bussiness' | '' = ''
    for (let i = 0; i < $dictentries.length; i++) {
        const $entry = $dictentries[i]
        const $intro = $entry.querySelector('.dictionary_intro')
        if ($intro) {
            const dict = $intro.textContent || ''
            if (dict.includes('Contemporary')) {
                currentDict = 'contemporary'
            } else if (dict.includes('Business')) {
                currentDict = 'bussiness'
            } else {
                currentDict = ''
            }
        }

        if (!currentDict) {
            continue
        }

        const entry: LongmanResultEntry = {
            title: {
                HWD: '',
                HYPHENATION: '',
                HOMNUM: ''
            },
            prons: [],
            senses: []
        }

        const $topic = $entry.querySelector<HTMLAnchorElement>('a.topic')
        if ($topic) {
            entry.topic = {
                title: $topic.textContent || '',
                href: getFullLink(HOST, $topic, 'href')
            }
        }

        const $head = $entry.querySelector('.Head')
        if (!$head) {
            continue
        }

        entry.title.HWD = getText($head, '.HWD')
        entry.title.HYPHENATION = getText($head, '.HYPHENATION')
        entry.title.HOMNUM = getText($head, '.HOMNUM')

        entry.phsym = getText($head, '.PronCodes')

        const $level = $head.querySelector('.LEVEL') as HTMLSpanElement
        if ($level) {
            const level = {
                rate: 0,
                title: ''
            }

            level.rate = (($level.textContent || '').match(/●/g) || []).length
            level.title = $level.title

            entry.level = level
        }

        entry.freq = Array.from(
            $head.querySelectorAll<HTMLSpanElement>('.FREQ')
        ).map($el => ({
            title: $el.title,
            rank: $el.textContent || ''
        }))

        entry.pos = getText($head, '.POS')

        $head.querySelectorAll<HTMLSpanElement>('.speaker').forEach($pron => {
            let lang: 'us' | 'uk' = 'us'
            const title = $pron.title
            if (title.includes('British')) {
                lang = 'uk'
            }
            const pron = $pron.getAttribute('data-src-mp3') || ''

            audio[lang] = pron
            entry.prons.push({ lang, pron })
        })

        entry.senses = Array.from($entry.querySelectorAll('.Sense')).map($sen =>
            getInnerHTML(HOST, $sen)
        )

        entry.collocations = getInnerHTML(HOST, $entry, '.ColloBox')

        entry.grammar = getInnerHTML(HOST, $entry, '.GramBox')

        entry.thesaurus = getInnerHTML(HOST, $entry, '.ThesBox')

        entry.examples = Array.from(
            $entry.querySelectorAll('.exaGroup')
        ).map($exa => getInnerHTML(HOST, $exa))

        result[currentDict].push(entry)
    }

    if (result.contemporary.length <= 0 && result.bussiness.length <= 0) {
        return handleNoResult()
    }

    return { result, audio }
}

function handleDOMRelated(
    doc: Document
): LongmanSearchResultRelated | Promise<LongmanSearchResultRelated> {
    const $didyoumean = doc.querySelector('.didyoumean')
    if ($didyoumean) {
        return {
            result: {
                type: 'related',
                list: getInnerHTML(HOST, $didyoumean)
            }
        }
    }
    return handleNoResult()
}

