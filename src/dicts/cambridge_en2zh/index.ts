
import { CambridgeEn2ZhPageFetch } from './pagefetch'
import { CambridgePlugin } from '../base/cambridge'


export class CambridgeEn2ZhPlugin extends CambridgePlugin {

    async getPageResult(word: string): Promise<string> {
        const fetch = new CambridgeEn2ZhPageFetch()
        return await fetch.getPageResult(word)
    }
}