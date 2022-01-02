import flyio from "flyio"
import { IPageFetch } from "../../interface/IPlugin"

export class WebsterlearnerPageFetch implements IPageFetch {
    async getPageResult(word: string): Promise<string> {
        const url = 'http://www.learnersdictionary.com/definition/' + word.toLocaleLowerCase().replace(/[^A-Za-z0-9]+/g, '-')
        const response = await flyio.get(url)
        return response.data
    }
}