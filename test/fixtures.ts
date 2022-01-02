// 提前下载好需要渲染的解释网页数据，然后交给 storybook 渲染
import glob from 'glob'
import path from 'path'
import fs from 'fs-extra'
import { IPageFetch } from '../src/interface/IPlugin'

const testWord = 'apple'

async function downloadPageFetch(moduleName: string, pageFetchItem: IPageFetch) {
    try {
        console.log(`正在下载模块: ${moduleName} 的专用调试文档`)
        const pageContent = await pageFetchItem.getPageResult(testWord)
        const responseFolder = path.join(__dirname, `./dicts/${moduleName}/response`)
        if (!fs.existsSync(responseFolder)) {
            fs.mkdirSync(responseFolder, { recursive: true });
        }
        fs.writeFileSync(path.join(responseFolder, 'index.html'), pageContent)
        console.log(`模块: ${moduleName} 的专用调试文档下载完成`)
    } catch (error) {
        console.warn(`模块: ${moduleName} 未实现 getPageResult 方法，或下载出现错误: ${JSON.stringify(error)}`)
    }
}

async function downloadAll() {
    console.log('正在下载各模块的调试用文档')
    const allTestList = glob.sync(path.join(__dirname, '../src/dicts/**/pagefetch.ts'))
    const downloadTaskList: Promise<void>[] = []

    for (const testPath of allTestList) {
        const testModule = await import(testPath)
        const list = testPath.split('/')
        list.pop()
        const moduleName = list.pop()
        let classname = moduleName.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
        //多语种适配
        if (classname.includes('_')) {
            const classnameList = classname.split('_')
            if (classnameList.length === 2) {
                const lastname = classnameList[1]
                const lastnamelist = lastname.split('2')
                const newclassnameList: string[] = []
                for (const classnameItem of lastnamelist) {
                    const newlastnameItem = classnameItem.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
                    newclassnameList.push(newlastnameItem)
                }
                const joinText = lastnamelist.length === 1 ? '' : '2'
                const langName = newclassnameList.join(joinText)
                classname = classnameList[0] + langName
            }
        }
        classname = `${classname}PageFetch`
        const classModule = testModule[classname]
        const pageFetchItem = new classModule() as IPageFetch
        const task = downloadPageFetch(moduleName, pageFetchItem)
        downloadTaskList.push(task)
    }
    await Promise.all(downloadTaskList)
    console.log('各模块的调试用文档下载完成')
}

downloadAll()
