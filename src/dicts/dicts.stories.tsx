import React, { FC } from 'react'
import { withKnobs, text } from '@storybook/addon-knobs'
import { addons } from '@storybook/addons';
import { storiesOf } from '@storybook/react'
import { BingPlugin } from './bing'
import { DictBing } from './bing/View'
import { DictCambridge } from './base/cambridge/View'
import { IPlugin } from '../interface/IPlugin'
import { ViewPorps } from '../interface/IDictResult'
import '../../eudic/main.css'
import { CobuildPlugin } from './cobuild'
import { DictCobuild } from './cobuild/View'
import { EtymonlinePlugin } from './etymonline'
import { DictEtymonline } from './etymonline/View'
import { CambridgeEn2EnPlugin } from './cambridge_en2en'
import { CambridgeEn2ZhPlugin } from './cambridge_en2zh'
import { DictJukuu } from './base/jukuu/View'
import { JukuuJp2EnPlugin } from './jukuu_jp2en'
import { JukuuZh2EnPlugin } from './jukuu_zh2en'
import { JukuuZh2JpPlugin } from './jukuu_zh2jp'
import { LongmanPlugin } from './longman'
import { DictLongman } from './longman/View'
import { MacmillanUsPlugin } from './macmillan_us'
import { DictMacmillan } from './base/macmillan/View'
import { MacmillanUkPlugin } from './macmillan_uk'
import { WebsterlearnerPlugin } from './websterlearner'
import { DictWebsterLearner } from './websterlearner/View'

addons.setConfig({
    isFullscreen: true,
    layout: 'fullscreen',
    showNav: true,
    showPanel: true,
    panelPosition: 'bottom',
    enableShortcuts: true,
    isToolshown: true,
    theme: undefined,
    selectedPanel: undefined,
    initialActive: 'sidebar',
    sidebar: {
      showRoots: false,
      collapsedRoots: ['other'],
    },
    toolbar: {
      title: { hidden: false, },
      zoom: { hidden: false, },
      eject: { hidden: false, },
      copy: { hidden: false, },
      fullscreen: { hidden: false, },
    },
  });

class StoryItem {
    plugin: IPlugin
    view: React.FC<ViewPorps<any>>

    constructor(plugin: IPlugin, view: React.FC<ViewPorps<any>>) {
        this.plugin = plugin
        this.view = view
    }
}

export const TranslateTemplate: FC<ViewPorps<string>> = ({ result }) => {
    return <div>{{ result }}</div>
}

const allDictPlugins = {
    bing: new StoryItem(new BingPlugin, DictBing),
    cambridge_en2en: new StoryItem(new CambridgeEn2EnPlugin, DictCambridge),
    cambridge_en2zh: new StoryItem(new CambridgeEn2ZhPlugin, DictCambridge),
    cobuild: new StoryItem(new CobuildPlugin, DictCobuild),
    etymonline: new StoryItem(new EtymonlinePlugin, DictEtymonline),
    jukuu_jp2en: new StoryItem(new JukuuJp2EnPlugin, DictJukuu),
    jukuu_zh2en: new StoryItem(new JukuuZh2EnPlugin, DictJukuu),
    jukuu_zh2jp: new StoryItem(new JukuuZh2JpPlugin, DictJukuu),
    longman: new StoryItem(new LongmanPlugin, DictLongman),
    macmillan_us: new StoryItem(new MacmillanUsPlugin, DictMacmillan),
    macmillan_uk: new StoryItem(new MacmillanUkPlugin, DictMacmillan),
    websterlearner: new StoryItem(new WebsterlearnerPlugin, DictWebsterLearner),
}

const anyWindow = window as any
const storyStore = anyWindow.__STORYBOOK_STORY_STORE__

async function generateAllParseResult(): Promise<any> {
    const resultPlugins: any = {}
    const allKeys = Object.keys(allDictPlugins)
    for (const item of allKeys) {
        const storyItem = allDictPlugins[item as keyof (typeof allDictPlugins)]
        //词典解释
        let htmlResult: any
        try {
            htmlResult = require(`../../test/dicts/${item}/response/index.html`)
        } catch (error) {
            console.warn(`当前模型${item}下，待解析文档不存在，您可能需要先运行 yarn fixtures`)
            continue
        }
        const plugin = storyItem.plugin as any
        if (!plugin.parsePageResult) {
            continue
        }
        try {
            const parseResult = await plugin.parsePageResult(htmlResult.default)
            resultPlugins[item] = parseResult.result
        } catch (error) {
            console.warn(`当前模型${item}下，解析文档失败: ${error}`)
        }
    }
    return resultPlugins
}



generateAllParseResult().then(resultPlugins => {
    const dictStories = storiesOf('Dicts', module)
        .addDecorator(withKnobs)
        .addDecorator(story => {
            const theme = text('theme', 'sepia')
            return (
                <body className={theme}>
                <div id="sb-theme-content" className={theme}>
                    <div id="dic_banner" className="dic_banner ios_statusbar">
                        <div id="leftBtn">
                            <div className="backArrow"></div><span id="headWord" className="dicHeadWord"></span>
                        </div>

                        <div id="right">
                            <div className="eudic_addword_box" id="eudic_addword_box">
                                <i id="eudic_addword_button" className="eudic_addword_icon_0"></i>
                            </div>
                        </div>
                        <div id="wordInfoHead">
                        </div>
                    </div>
                    <div id="expBody" className="expBody">
                        <div id="olnid1">
                            <div id="@DicID" className="explain_wrap" style={{ width: '100%' }}>
                                <div className="expHead">
                                    <button>第三方词典标题</button>
                                    <span className="arrow arrSideDown"></span>
                                    <span className="arrow arrDown"></span>
                                </div>
                                <div id="@DicIDchild" className="expDiv">
                                    {story()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </body>
            )
        })
    storyStore.startConfiguring()
    const allKeys = Object.keys(resultPlugins)
    for (const item of allKeys) {
        const storyItem = allDictPlugins[item as keyof (typeof allDictPlugins)]
        dictStories.add(item, () => (
            <storyItem.view result={resultPlugins[item]} />
        ))
    }
    storyStore.finishConfiguring()
})
