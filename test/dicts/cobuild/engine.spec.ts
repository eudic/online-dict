import { CobuildPlugin, COBUILDResult } from '../../../src/dicts/cobuild/index'
import { DictSearchResult } from '../../../src/dicts/helpers'


describe('COBUILD', () => {
    it('should parse result correctly', () => {
        const word = 'love'
        const plugin = new CobuildPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<COBUILDResult>
            expect(searchResult.result).toBeTruthy()
        })
    })
})
