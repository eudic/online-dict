import { JukuuZh2JpPlugin } from '../../../src/dicts/jukuu_zh2jp/index'
import { DictSearchResult } from '../../../src/dicts/helpers'
import { JukuuResult } from '../../../src/dicts/base/jukuu'


describe('Jukuu_Jp2En', () => {
    it('should parse result correctly', () => {
        const word = 'love'
        const plugin = new JukuuZh2JpPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<JukuuResult>
            expect(typeof searchResult.result.lang).toBe('string')
            expect(searchResult.result.sens.length).toBeGreaterThan(0)
            expect(typeof searchResult.result.sens[0].trans).toBe('string')
            expect(searchResult.result.sens[0].trans.length).toBeGreaterThan(0)
        })
    })
})
