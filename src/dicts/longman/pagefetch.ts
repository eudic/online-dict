import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class LongmanPageFetch implements IPageFetch {
    async getPageResult(word: string): Promise<string> {
        const url = `https://www.ldoceonline.com/dictionary/${word
            .trim()
            .split(/\s+/)
            .join('-')}`
        const response = await flyio.get(url)
        return response.data
    }
}