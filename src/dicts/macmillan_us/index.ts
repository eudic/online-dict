
import { MacmillanUsPageFetch } from './pagefetch'
import { MacmillanPlugin } from '../base/macmillan'


export class MacmillanUsPlugin extends MacmillanPlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new MacmillanUsPageFetch()
        return await fetch.getPageResult(word)
    }
}