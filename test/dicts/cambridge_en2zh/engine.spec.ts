import { CambridgeEn2ZhPlugin } from '../../../src/dicts/cambridge_en2zh'
import { CambridgeResult } from '../../../src/dicts/base/cambridge'
import { DictSearchResult } from '../../../src/dicts/helpers'


describe('Cambridge_en2zh', () => {
    it('should parse result (zhs) correctly', () => {
        const word = 'house'
        const plugin = new CambridgeEn2ZhPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const { result, audio } = await plugin.parsePageResult(pageResult, word) as DictSearchResult<CambridgeResult>
            expect(audio && typeof audio.uk).toBe('string')
            expect(audio && typeof audio.us).toBe('string')

            expect(result.length).toBeGreaterThanOrEqual(1)
        })
    })
})
