import { HtmlDictPlugin } from '../../../interface/IPlugin'
import { DictCambridge } from './View'
import { getText, getInnerHTML, handleNoResult, getFullLink, HTMLString, externalLink, removeChild, SearchErrorType, DictSearchResult } from '../../helpers'
import { getStaticSpeaker } from '../../../components/Speaker'

const HOST = 'https://dictionary.cambridge.org'

type CambridgeResultItem = {
    id: string
    html: HTMLString
}

export type CambridgeResult = CambridgeResultItem[]

type CambridgeSearchResult = DictSearchResult<CambridgeResult>

export abstract class CambridgePlugin extends HtmlDictPlugin {

    htmlTemplate() {
        return DictCambridge
    }

    parsePageResult(pageResult: string, searchWord: string | undefined): CambridgeSearchResult | Promise<CambridgeSearchResult> {
        const doc = new DOMParser().parseFromString(pageResult, 'text/html')
        const result: CambridgeResult = []
        const catalog: NonNullable<CambridgeSearchResult['catalog']> = []
        const audio: { us?: string; uk?: string } = {}

        doc.querySelectorAll('.trans').forEach(($entry) => {
            $entry.classList.remove('trans')
            $entry.classList.add('cambridge-trans')
        })

        //移除 See more results »
        doc.querySelectorAll('.had.tb').forEach(($entry) => {
            $entry.remove()
        })

        doc.querySelectorAll('.entry-body__el').forEach(($entry, i) => {
            if (!getText($entry, '.headword')) {
                return
            }

            const $posHeader = $entry.querySelector('.pos-header')
            if ($posHeader) {
                $posHeader.querySelectorAll('.dpron-i').forEach($pron => {
                    const $daud = $pron.querySelector<HTMLSpanElement>('.daud')
                    if (!$daud) return
                    const $source = $daud.querySelector<HTMLSourceElement>(
                        'source[type="audio/mpeg"]'
                    )
                    if (!$source) return

                    const src = getFullLink(HOST, $source, 'src')

                    if (src) {
                        $daud.replaceWith(getStaticSpeaker(src))

                        if (!audio.uk && $pron.classList.contains('uk')) {
                            audio.uk = src
                        }

                        if (!audio.us && $pron.classList.contains('us')) {
                            audio.us = src
                        }
                    }
                })
                removeChild($posHeader, '.share')
            }

            sanitizeEntry($entry)

            const entryId = `d-cambridge-entry${i}`

            result.push({
                id: entryId,
                html: getInnerHTML(HOST, $entry)
            })

            catalog.push({
                key: `#${i}`,
                value: entryId,
                label:
                    '#' + getText($entry, '.di-title') + ' ' + getText($entry, '.posgram')
            })
        })

        if (result.length <= 0) {
            // check idiom
            const $idiom = doc.querySelector('.idiom-block')
            if ($idiom) {
                removeChild($idiom, '.bb.hax')

                sanitizeEntry($idiom)

                result.push({
                    id: 'd-cambridge-entry-idiom',
                    html: getInnerHTML(HOST, $idiom)
                })
            }
        }

        if (result.length <= 0) {
            const $link = doc.querySelector('link[rel=canonical]')
            if (
                $link &&
                /dictionary\.cambridge\.org\/([^/]+\/)?spellcheck\//.test(
                    $link.getAttribute('href') || ''
                )
            ) {
                const $related = doc.querySelector('.hfl-s.lt2b.lmt-10.lmb-25.lp-s_r-20')
                if ($related) {
                    result.push({
                        id: 'd-cambridge-entry-related',
                        html: getInnerHTML(HOST, $related)
                    })
                }
            }
        }

        if (result.length > 0) {
            return { result, audio, catalog }
        }

        return handleNoResult()
    }
}

function sanitizeEntry<E extends Element>($entry: E): E {
    // expand button,直接展开，避免无法点击
    $entry.querySelectorAll('.daccord_h').forEach($btn => {
        $btn.parentElement!.classList.add('amp-accordion')
        $btn.parentElement!.classList.add('open')
    })

    //移除展开按钮的+-符号
    $entry.querySelectorAll('.i.i-plus.ca_hi').forEach($btn => {
        $btn.remove()
    })

    // replace amp-img
    $entry.querySelectorAll('amp-img').forEach($ampImg => {
        const $img = document.createElement('img')

        $img.setAttribute('src', getFullLink(HOST, $ampImg, 'src'))

        const attrs = ['width', 'height', 'title']
        for (const attr of attrs) {
            const val = $ampImg.getAttribute(attr)
            if (val) {
                $img.setAttribute(attr, val)
            }
        }

        $ampImg.replaceWith($img)
    })

    // replace amp-audio
    $entry.querySelectorAll('amp-audio').forEach($ampAudio => {
        const $source = $ampAudio.querySelector('source')
        if ($source) {
            const src = getFullLink(HOST, $source, 'src')
            if (src) {
                $ampAudio.replaceWith(getStaticSpeaker(src))
                return
            }
        }
        $ampAudio.remove()
    })

    // See more results
    $entry.querySelectorAll<HTMLAnchorElement>('a.had').forEach(externalLink)

    return $entry
}