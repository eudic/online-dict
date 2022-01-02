import { ViewPorps } from '../interface/IDictResult'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export function renderReactToString<T>(ViewItem: React.FC<ViewPorps<T>>, doc: T, uuid: string) {
    const element: JSX.Element = <ViewItem result={doc} />
    const htmlResult = ReactDOMServer.renderToStaticMarkup(element)
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlResult
    //替换全部a链接
    const allATagList = tempDiv.getElementsByTagName('a')
    for (const tagItem of allATagList) {
        if (tagItem.className === 'eudic-onlinedict-Speaker') {
            tagItem.href = `audio:${tagItem.href}`
        } else {
            tagItem.href = `dic://${tagItem.textContent}`
        }
    }
    const elementInnerHtml = tempDiv.innerHTML
    return `
    <div id="eudic-onlinedict-section-${uuid}">
        <link rel="stylesheet" href="file://index.css" />
        <script defer src="file://dict.js?id=${uuid}" charset="utf-8" type="text/javascript"></script>
        ${elementInnerHtml}
    </div>
    `
}