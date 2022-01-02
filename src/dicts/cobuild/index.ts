import { HtmlDictPlugin } from '../../interface/IPlugin'
import { DictCobuild } from './View'
import { getInnerHTML, handleNoResult, HTMLString, externalLink, DictSearchResult } from '../helpers'
import { CobuildPageFetch } from './pagefetch'
import { getStaticSpeaker } from '../../components/Speaker'

export interface COBUILDCibaResult {
    type: 'ciba'
    title: string
    defs: HTMLString[]
    level?: string
    star?: number
    prons?: Array<{
        phsym: string
        audio: string
    }>
}

export interface COBUILDColResult {
    type: 'collins'
    sections: Array<{
        id: string
        className: string
        type: string
        title: string
        num: string
        content: HTMLString
    }>
}

export type COBUILDResult = COBUILDCibaResult | COBUILDColResult

export class CobuildPlugin extends HtmlDictPlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new CobuildPageFetch()
        return await fetch.getPageResult(word)
    }

    parsePageResult(pageResult: string, searchWord: string | undefined): DictSearchResult<COBUILDColResult> | Promise<DictSearchResult<COBUILDColResult>> {
        const doc = new DOMParser().parseFromString(pageResult, 'text/html')
        const result: COBUILDColResult = {
            type: 'collins',
            sections: []
        }
        const audio: { uk?: string; us?: string } = {}

        result.sections = [
            ...doc.querySelectorAll<HTMLDivElement>(`[data-type-block]`)
        ]
            .filter($section => {
                const type = $section.dataset.typeBlock || ''
                return (
                    type &&
                    type !== 'Video' &&
                    type !== 'Trends' &&
                    type !== '英语词汇表' &&
                    type !== '趋势'
                )
            })
            .map($section => {
                const type = $section.dataset.typeBlock || ''
                const title = $section.dataset.titleBlock || ''
                const num = $section.dataset.numBlock || ''
                const id = type + title + num
                const className = $section.className || ''

                if (type === 'Learner') {
                    //   const $frequency = $section.querySelector<HTMLSpanElement>('.word-frequency-img')
                    //   if ($frequency) {
                    //     const star = Number($frequency.dataset.band)
                    //     if (star) {
                    //       result.star = star
                    //     }
                    //   }
                    if (!audio.uk) {
                        const mp3 = getAudio($section)
                        if (mp3) {
                            audio.uk = mp3
                        }
                    }
                } else if (type === 'English') {
                    audio.uk = getAudio($section)
                } else if (type === 'American') {
                    audio.us = getAudio($section)
                }

                const $video = $section.querySelector<HTMLDivElement>('#videos .video')
                if ($video) {
                    const $youtubeVideo = $video.querySelector<HTMLDivElement>(
                        '.youtube-video'
                    )
                    if ($youtubeVideo && $youtubeVideo.dataset.embed) {
                        const panelWidth = 320
                        const width = panelWidth - 25
                        const height = (width / 560) * 315
                        return {
                            id,
                            className,
                            type,
                            title,
                            num,
                            content: `<iframe width="${width}" height="${height}" src="https://www.youtube-nocookie.com/embed/${$youtubeVideo.dataset.embed}" frameborder="0" allow="accelerometer; encrypted-media"></iframe>`
                        }
                    }
                }

                $section
                    .querySelectorAll<HTMLAnchorElement>('.audio_play_button')
                    .forEach($speaker => {
                        $speaker.replaceWith(getStaticSpeaker($speaker.dataset.srcMp3))
                    })

                // so that clicking won't trigger in-panel search
                $section
                    .querySelectorAll<HTMLAnchorElement>('a.type-thesaurus')
                    .forEach(externalLink)

                return {
                    id,
                    className,
                    type,
                    title,
                    num,
                    content: getInnerHTML('https://www.collinsdictionary.com', $section)
                }
            })

        if (result.sections.length > 0) {
            return { result, audio }
        }

        return handleNoResult()
    }


    htmlTemplate() {
        return DictCobuild
    }
}

function getAudio($section: HTMLElement): string | undefined {
    const $audio = $section.querySelector<HTMLAnchorElement>(
        '.pron .audio_play_button'
    )
    if ($audio) {
        const src = $audio.dataset.srcMp3
        if (src) {
            return src
        }
    }
}
