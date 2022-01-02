import { EtymonlinePlugin, EtymonlineResult } from '../../../src/dicts/etymonline/index'
import { DictSearchResult } from '../../../src/dicts/helpers'


describe('Etymonline', () => {
    it('should parse result correctly', () => {
        const word = 'love'
        const plugin = new EtymonlinePlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<EtymonlineResult>
            expect(searchResult.audio).toBeUndefined()

            const result = searchResult.result
            expect(result.length).toBeGreaterThanOrEqual(1)
            expect(typeof result[0].title).toBe('string')
            expect(typeof result[0].href).toBe('string')
            expect(typeof result[0].def).toBe('string')
        })
    })
})
