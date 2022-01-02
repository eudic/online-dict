import { WebsterlearnerPlugin, WebsterLearnerResult, WebsterLearnerResultLex } from '../../../src/dicts/websterlearner/index'
import { DictSearchResult } from '../../../src/dicts/helpers'


describe('WebsterLearner', () => {
    it('should parse lex result correctly', () => {
        const word = 'house'
        const plugin = new WebsterlearnerPlugin()
        return plugin.getPageResult(word).then(async pageResult => {
            const searchResult = await plugin.parsePageResult(pageResult, word) as DictSearchResult<WebsterLearnerResult>
            expect(searchResult.audio && typeof searchResult.audio.us).toBe(
                'string'
            )

            const result = searchResult.result as WebsterLearnerResultLex
            expect(result.type).toBe('lex')
            expect(result.items).toHaveLength(2)

            expect(typeof result.items[0].title).toBe('string')
            expect(result.items[0].title).toBeTruthy()

            expect(typeof result.items[0].pron).toBe('string')
            expect(result.items[0].pron).toBeTruthy()

            expect(typeof result.items[0].infs).toBe('string')
            expect(result.items[0].infs).toBeTruthy()

            expect(typeof result.items[0].infsPron).toBe('string')
            expect(result.items[0].infsPron).toBeTruthy()

            expect(result.items[0].labels).toBeFalsy()

            expect(typeof result.items[0].senses).toBe('string')
            expect(result.items[0].senses).toBeTruthy()

            expect(result.items[0].arts).toHaveLength(1)

            expect(typeof result.items[0].phrases).toBe('string')
            expect(result.items[0].phrases).toBeTruthy()

            expect(typeof result.items[0].derived).toBe('string')
            expect(result.items[0].derived).toBeTruthy()

            // 2
            expect(typeof result.items[1].title).toBe('string')
            expect(result.items[1].title).toBeTruthy()

            expect(typeof result.items[1].pron).toBe('string')
            expect(result.items[1].pron).toBeTruthy()

            expect(typeof result.items[1].infs).toBe('string')
            expect(result.items[1].infs).toBeTruthy()

            expect(result.items[1].infsPron).toBeFalsy()

            expect(typeof result.items[1].labels).toBe('string')
            expect(result.items[1].labels).toBeTruthy()

            expect(typeof result.items[1].senses).toBe('string')
            expect(result.items[1].senses).toBeTruthy()

            expect(result.items[1].arts).toHaveLength(0)

            expect(result.items[1].phrases).toBeFalsy()

            expect(result.items[1].derived).toBeFalsy()
        })
    })

})
