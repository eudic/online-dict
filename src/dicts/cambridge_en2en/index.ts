
import { CambridgeEn2EnPageFetch } from './pagefetch'
import { CambridgePlugin } from '../base/cambridge'


export class CambridgeEn2EnPlugin extends CambridgePlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new CambridgeEn2EnPageFetch()
        return await fetch.getPageResult(word)
    }
}