import { CambridgeEn2EnPlugin } from '../../../src/dicts/cambridge_en2en'
import { CambridgeResult } from '../../../src/dicts/base/cambridge'
import { DictSearchResult } from '../../../src/dicts/helpers'


describe('Cambridge_en2en', () => {
    it('should parse result (en) correctly', () => {
        const word = 'love'
        const plugin = new CambridgeEn2EnPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const { result, audio } = await plugin.parsePageResult(pageResult, word) as DictSearchResult<CambridgeResult>
            expect(audio && typeof audio.uk).toBe('string')
            expect(audio && typeof audio.us).toBe('string')

            expect(result.length).toBeGreaterThanOrEqual(1)
        })
    })
})
