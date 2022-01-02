import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class CambridgeEn2ZhPageFetch implements IPageFetch {
    async getPageResult(word: string): Promise<string> {
        const url = 'https://dictionary.cambridge.org/zhs/%E6%90%9C%E7%B4%A2/direct/?datasetsearch=english-chinese-simplified&q=' + encodeURIComponent(word)
        const response = await flyio.get(url)
        return response.data
    }
}