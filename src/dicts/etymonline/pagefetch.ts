import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class EtymonlinePageFetch implements IPageFetch {
    async getPageResult(word: string): Promise<string> {
        try {
            //优先读取word，因为word的解释比较全面
            const url = `http://www.etymonline.com/word/${word}`
            const response = await flyio.get(url)
            return response.data
        } catch (error) {

        }
        const url = `http://www.etymonline.com/search?q=${word}`
        const response = await flyio.get(url)
        return response.data
    }
}