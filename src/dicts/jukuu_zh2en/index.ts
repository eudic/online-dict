
import { JukuuZh2EnPageFetch } from './pagefetch'
import { JukuuPlugin } from '../base/jukuu'


export class JukuuZh2EnPlugin extends JukuuPlugin {

    async getPageResult(word: string): Promise<string> {
        if (word.includes(' ')) {
            return ''
        }
        const fetch = new JukuuZh2EnPageFetch()
        return await fetch.getPageResult(word)
    }
}