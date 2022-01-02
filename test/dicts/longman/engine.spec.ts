import { LongmanPlugin, LongmanResult, LongmanResultLex, LongmanResultRelated } from '../../../src/dicts/longman/index'
import { DictSearchResult } from '../../../src/dicts/helpers'


describe('Longman', () => {
    it('should parse lex result (love) correctly', () => {
        const word = 'love'
        const plugin = new LongmanPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<LongmanResult>
            expect(searchResult.audio && typeof searchResult.audio.uk).toBe(
                'string'
            )
            expect(searchResult.audio && typeof searchResult.audio.us).toBe(
                'string'
            )

            const result = searchResult.result as LongmanResultLex
            expect(result.type).toBe('lex')

            expect(result.wordfams.length).toBeGreaterThanOrEqual(1)
            expect(result.contemporary).toHaveLength(2)
            expect(result.bussiness).toHaveLength(0)

            result.contemporary.forEach(entry => {
                expect(entry.title.HWD.length).toBeGreaterThan(0)
                expect(entry.title.HYPHENATION.length).toBeGreaterThan(0)
                expect(entry.title.HOMNUM.length).toBeGreaterThan(0)
                expect(entry.senses.length).toBeGreaterThan(0)
                expect(typeof entry.phsym).toBe('string')
                expect(typeof entry.pos).toBe('string')
                expect(entry.freq).toHaveLength(2)
                expect(entry.level).toBeDefined()
                expect((entry.level as any).rate).toBe(3)
                expect(entry.prons).toHaveLength(2)
            })

            expect(typeof result.contemporary[0].grammar).toBe('string')
            expect(typeof result.contemporary[0].thesaurus).toBe('string')
            expect(result.contemporary[0].examples).toHaveLength(3)
            expect(result.contemporary[0].topic).toBeUndefined()

            expect(typeof result.contemporary[0].collocations).toBe('string')
            expect(typeof result.contemporary[0].thesaurus).toBe('string')
            expect(result.contemporary[1].examples).toHaveLength(4)
        })
    })

    it('should parse lex result (profit) correctly', () => {
        const word = 'profit'
        const plugin = new LongmanPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<LongmanResult>
            expect(searchResult.audio && typeof searchResult.audio.uk).toBe(
                'string'
            )
            expect(searchResult.audio && typeof searchResult.audio.us).toBe(
                'string'
            )

            const result = searchResult.result as LongmanResultLex
            expect(result.type).toBe('lex')

            expect(result.bussinessFirst).toBe(false)
            expect((result.wordfams as string).length).toBeGreaterThan(0)
            expect(result.contemporary).toHaveLength(2)
            expect(result.bussiness).toHaveLength(2)

            result.contemporary.forEach(entry => {
                expect(entry.title.HWD.length).toBeGreaterThan(0)
                expect(entry.title.HYPHENATION.length).toBeGreaterThan(0)
                expect(entry.title.HOMNUM.length).toBeGreaterThan(0)
                expect(entry.senses.length).toBeGreaterThan(0)
                expect(typeof entry.phsym).toBe('string')
                expect(typeof entry.pos).toBe('string')
                expect(entry.prons).toHaveLength(2)
            })

            result.bussiness.forEach(entry => {
                expect(entry.title.HWD.length).toBeGreaterThan(0)
                expect(entry.title.HYPHENATION.length).toBeGreaterThan(0)
                expect(entry.title.HOMNUM.length).toBeGreaterThan(0)
                expect(entry.senses.length).toBeGreaterThan(0)
                expect(typeof entry.phsym).toBe('string')
                expect(typeof entry.pos).toBe('string')
                expect(entry.freq).toHaveLength(0)
                expect(entry.level).toBeUndefined()
                expect(entry.prons).toHaveLength(0)
            })

            expect(result.contemporary[0].level).toBeDefined()
            expect((result.contemporary[0].level as any).rate).toBe(3)
            expect(typeof result.contemporary[0].collocations).toBe('string')
            expect(typeof result.contemporary[0].thesaurus).toBe('string')
            expect(result.contemporary[0].freq).toHaveLength(2)
            expect(result.contemporary[0].examples).toHaveLength(2)
            expect(typeof result.contemporary[0].topic).toBeTruthy()

            expect(result.contemporary[1].freq).toHaveLength(0)
            expect(result.contemporary[1].examples).toHaveLength(3)
            expect(result.contemporary[1].level).toBeDefined()
            expect((result.contemporary[1].level as any).rate).toBe(1)
        })
    })

    it('should parse related result correctly', () => {
        const word = 'jumblish'
        const plugin = new LongmanPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<LongmanResult>
            expect(searchResult.audio).toBeUndefined()

            const result = searchResult.result as LongmanResultRelated
            expect(result.type).toBe('related')
            expect(typeof result.list).toBe('string')
        })
    })
})
