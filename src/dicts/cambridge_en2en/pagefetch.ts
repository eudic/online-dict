import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"
export class CambridgeEn2EnPageFetch implements IPageFetch {

    async getPageResult(word: string): Promise<string> {
        const url = 'https://dictionary.cambridge.org/search/direct/?datasetsearch=english&q=' +
            encodeURIComponent(
                word
                    .trim()
                    .split(/\s+/)
                    .join('-')
            )
        const response = await flyio.get(url)
        return response.data
    }
}