import path from 'path'
import fs from 'fs-extra'


async function parseTestResult() {
    const reportFilePath = path.resolve(__dirname, './dicts/dicts_test_result.json')
    if (!fs.existsSync(reportFilePath)) {
        console.error(`测试报告文件不存在`)
        return
    }
    const reportFileContent = fs.readJsonSync(reportFilePath)
    const testResults = reportFileContent.testResults
    for (const resultItem of testResults) {
        const name = resultItem.name as string
        const status = resultItem.status as string
        const moduleNameList = name.split('/')
        moduleNameList.pop()
        const moduleName = moduleNameList.pop()
        const eudicConfigPath = path.resolve(__dirname, `../src/dicts/${moduleName}/eudic_config.json`)
        const eudicConfigContent = fs.readJsonSync(eudicConfigPath)
        if (status === 'passed') {
            eudicConfigContent.enabled = true
            console.log(`模型 ${moduleName} 测试通过，已启用`)
        } else {
            eudicConfigContent.enabled = false
            console.log(`模型 ${moduleName} 测试未通过，已禁用`)
        }
        fs.writeJsonSync(eudicConfigPath, eudicConfigContent, { spaces: 4 })
    }
}

parseTestResult()