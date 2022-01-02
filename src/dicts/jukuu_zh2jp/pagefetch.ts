import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class JukuuZh2JpPageFetch implements IPageFetch {

    async getPageResult(word: string): Promise<string> {
        const text = encodeURIComponent(word.replace(/\s+/g, '+'))
        const url = 'http://www.jukuu.com/jcsearch.php?q=' + text
        const response = await flyio.get(url)
        return response.data
    }
}