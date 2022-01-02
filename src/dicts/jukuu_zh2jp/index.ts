
import { JukuuZh2JpPageFetch } from './pagefetch'
import { JukuuPlugin } from '../base/jukuu'


export class JukuuZh2JpPlugin extends JukuuPlugin {

    async getPageResult(word: string): Promise<string> {
        if (word.includes(' ')) {
            return ''
        }
        const fetch = new JukuuZh2JpPageFetch()
        return await fetch.getPageResult(word)
    }
}