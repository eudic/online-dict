import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class JukuuZh2EnPageFetch implements IPageFetch {

    async getPageResult(word: string): Promise<string> {
        const text = encodeURIComponent(word.replace(/\s+/g, '+'))
        const url = 'http://www.jukuu.com/search.php?q=' + text
        const response = await flyio.get(url)
        return response.data
    }
}