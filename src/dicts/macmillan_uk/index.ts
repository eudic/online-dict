
import { MacmillanUkPageFetch } from './pagefetch'
import { MacmillanPlugin } from '../base/macmillan'


export class MacmillanUkPlugin extends MacmillanPlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new MacmillanUkPageFetch()
        return await fetch.getPageResult(word)
    }
}