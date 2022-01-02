import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

//cobuild柯林斯虽然有英汉，但解释很少，因此不加
export class CobuildPageFetch implements IPageFetch {
    async getPageResult(word: string): Promise<string> {
        const url = `https://www.collinsdictionary.com/dictionary/english/` + encodeURIComponent(word.replace(/\s+/g, '-'))
        const response = await flyio.get(url)
        return response.data
    }
}