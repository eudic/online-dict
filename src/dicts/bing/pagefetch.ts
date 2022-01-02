import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

const DICT_LINK = 'https://cn.bing.com/dict/clientsearch?mkt=zh-CN&setLang=zh&form=BDVEHC&ClientVer=BDDTV3.5.1.4320&q='
export class BingPageFetch implements IPageFetch {
    async getPageResult(word: string): Promise<string> {
        const url = DICT_LINK + encodeURIComponent(word.replace(/\s+/g, ' '))
        const response = await flyio.get(url)
        return response.data
    }
}