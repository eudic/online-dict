import path from 'path'
import fs from 'fs-extra'
import { mainConfig, generateConfigSettings } from './webpack.config'

const argv = require('yargs').argv
const isAnalyze = argv.analyze || argv.analyse

const distPath = path.resolve(__dirname, '../dist')
if (fs.pathExistsSync(distPath)) {
    fs.rmdirSync(distPath, { recursive: true })
}

const entryObject: any = {}
const copyCfgList: any[] = []
generateConfigSettings(__dirname, entryObject, copyCfgList)
module.exports = mainConfig(__dirname, __dirname, entryObject, copyCfgList, isAnalyze)
