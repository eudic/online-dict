import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class MacmillanUkPageFetch implements IPageFetch {

    async getPageResult(word: string): Promise<string> {
        const lang = 'british'
        const url = `http://www.macmillandictionary.com/dictionary/${lang}/` + encodeURIComponent(word.toLocaleLowerCase().replace(/[^A-Za-z0-9]+/g, '-'))
        const response = await flyio.get(url)
        return response.data
    }
}