import { BingPlugin, BingResult, BingResultLex, BingResultMachine, BingResultRelated } from '../../../src/dicts/bing/index'
import { DictSearchResult } from '../../../src/dicts/helpers'

describe('Bing', () => {
    it('should parse lex result correctly', () => {
        const word = 'love'
        const plugin = new BingPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<BingResult>
            expect(searchResult.audio).toHaveProperty(
                'us',
                expect.stringContaining('mp3')
            )
            expect(searchResult.audio).toHaveProperty(
                'uk',
                expect.stringContaining('mp3')
            )

            const result = searchResult.result as BingResultLex
            expect(result.type).toBe('lex')
            expect((result.phsym as any).length).toBeGreaterThan(0)
            expect((result.cdef as any).length).toBeGreaterThan(0)
            expect((result.infs as any).length).toBeGreaterThan(0)
            expect(result.sentences.length).toBeGreaterThanOrEqual(1)
        })
    })

    it('should parse machine result correctly', () => {
        const word = 'lose yourself in the dark'
        const plugin = new BingPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<BingResult>
            expect(searchResult.audio).toBeUndefined()

            const result = searchResult.result as BingResultMachine
            expect(result.type).toBe('machine')
            expect(typeof result.mt).toBe('string')
            expect(result.mt.length).toBeGreaterThan(0)
        })
    })

    it('should parse related result correctly', () => {
        const word = 'lovxx'
        const plugin = new BingPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<BingResult>
            expect(searchResult.audio).toBeUndefined()

            const result = searchResult.result as BingResultRelated
            expect(result.type).toBe('related')
            expect(result.defs.length).toBeGreaterThan(0)
        })
    })
})
