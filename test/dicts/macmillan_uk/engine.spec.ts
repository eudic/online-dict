import { MacmillanUkPlugin } from '../../../src/dicts/macmillan_uk/index'
import { DictSearchResult } from '../../../src/dicts/helpers'
import { MacmillanResult, MacmillanResultLex, MacmillanResultRelated } from '../../../src/dicts/base/macmillan'


describe('MacmillanUK', () => {
    it('should parse lex result correctly', () => {
        const word = 'love'
        const plugin = new MacmillanUkPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<MacmillanResult>
            expect(searchResult.audio && typeof searchResult.audio.uk).toBe(
                'string'
            )

            const result = searchResult.result as MacmillanResultLex
            expect(result.type).toBe('lex')
            expect(typeof result.title).toBe('string')
            expect(typeof result.senses).toBe('string')
            expect(typeof result.pos).toBe('string')
            expect(typeof result.sc).toBe('string')
            expect(typeof result.phsym).toBe('string')
            expect(typeof result.pron).toBe('string')
            expect(typeof result.ratting).toBe('number')
        })
    })

    it('should parse related result correctly', () => {
        const word = 'jumblish'
        const plugin = new MacmillanUkPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<MacmillanResult>
            expect(searchResult.audio).toBeUndefined()

            const result = searchResult.result as MacmillanResultRelated
            expect(result.type).toBe('related')
            expect(result.list instanceof Array).toBe(true)
        })
    })
})
