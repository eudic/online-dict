
import { JukuuJp2EnPageFetch } from './pagefetch'
import { JukuuPlugin } from '../base/jukuu'


export class JukuuJp2EnPlugin extends JukuuPlugin {

    async getPageResult(word: string): Promise<string> {
        if (word.includes(' ')) {
            return ''
        }
        const fetch = new JukuuJp2EnPageFetch()
        return await fetch.getPageResult(word)
    }
}