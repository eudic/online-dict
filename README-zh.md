# Eudic-Online-Dict 欧路词典在线查词引擎

使用该模块可以方便的为欧路词典扩充各种在线资源。 

<img src="example/preview.jpg" width="396px">

## 前置步骤

- `Node`版本需要 >14
- 使用 `yarn` 来安装依赖

## 调试词典

- `yarn fixtures` 下载一些必要的 html
- `yarn storybook` 直接调试在手机版欧路词典界面中的样式
- 主题调试: 运行 storybook 后，点击 Addons，在 theme 里填写需要调试的主题名即可
- `eudic/main.css` 包含了词典框架css，以便模拟当前词典在软件内的形式

## 打包安装

- `yarn build` 或 `yarn buildonly`
- 打包完成后，会在`dist`生成词库文件，每个词库一个目录
- 将需要的词库目录完整复制到欧路词典中（可以使用词典自带的WIFI文件传输）
- 打开词库管理，即可看到新安装的词库

## 开发新词典

- 新建一本词典来解析，新建文件夹位于 `src/dicts/[词典名]`
- 内部必须包含 `eudic_config.json`, `index.ts`
- 其中 `index.ts` 为插件主模块，`pagefetch.ts` 内含解释内容下载逻辑，因为 `yarn fixtures` 会使用该模块来预下载

## 开发约定

- 词库插件类名，必须首字母大写，后面全部为小写 + `Plugin` 的形式。比如 `BingPlugin`
- 如果一本词典包含多个语种的互翻，或多个语种，那么将这个词库的主要解析放入 `src/dicts/base`，并以`语种2语种`的形式命名，语种首字母需大写。比如 `JukuuEn2JpPlugin`；如果只是单对多，那么以`类型`的形式命名。例如macmillan有英音和美音，此时就是 `macmillan_uk` 和 `macmillan_us`

## 已知问题

- 暂时不支持词库内部的 js 动态交互，例如绑定点击事件

## 特别感谢

- [Saladict](https://github.com/crimx/ext-saladict)
