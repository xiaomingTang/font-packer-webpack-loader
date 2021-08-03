import fs from "fs"
import { loader } from "webpack"
import { getOptions } from "loader-utils"
import Fontmin from "fontmin"
import { isText } from "istextorbinary"

import { geneOptions, Options } from "@Src/options"
import { getAllFilesFromArray, log } from "@Src/utils"

function getTextsFromOptions({
  texts, filesOrDirs,
}: Required<Options>): string {
  const finalTexts = [
    ...texts,
  ]
  const allFiles = getAllFilesFromArray(filesOrDirs)
  allFiles.forEach((p) => {
    const buffer = fs.readFileSync(p)
    if (!isText(p, buffer)) {
      return
    }
    finalTexts.push(fs.readFileSync(p, "utf8"))
  })

  const set = new Set(finalTexts.join(""))

  return Array
    .from(set)
    // 移除所有空白字符
    .filter((item) => (!/\s/g.test(item)))
    .join("")
}

/**
 * 字体提取和转换
 */
function pickFrom(str: string, buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    new Fontmin()
      .src(buffer)
      .use(
        Fontmin.glyph({
          text: str,
          hinting: false,
        }),
      )
      .run((err, files) => {
        if (err) {
          reject(err)
        } else {
          // eslint-disable-next-line no-underscore-dangle
          resolve(files[0]._contents)
        }
      })
  })
}

const fontPackerWebpackLoader: loader.Loader = function fontPackerWebpackLoader(source) {
  const callback = this.async() as loader.loaderCallback

  try {
    const options = geneOptions(getOptions(this))
    const { resourcePath } = this
    if (resourcePath.endsWith(".ttf")) {
      const str = getTextsFromOptions(options)
      if (str.length === 0) {
        log.warn(`该配置没有匹配任何字符: ${JSON.stringify(options, null, 2)}`)
        callback(null, source)
        return
      }
      pickFrom(str, source as Buffer)
        .then((buffer) => {
          callback(null, buffer)
        })
        .catch((err) => {
          log.error(`${err.message}`)
          callback(null, source)
        })
    } else {
      log.warn(`${resourcePath} is not .ttf file`)
      callback(null, source)
    }
  } catch (err) {
    log.error(`${err.message}`)
    callback(null, source)
  }
}

fontPackerWebpackLoader.raw = true

// export default 导出的是 exports.default = ***
// 此处在此声明 export default, 完全是为了正确生成类型, 其实不会产生任何效果
export default fontPackerWebpackLoader

// 这儿不能用 export default, 导出的是 exports.default = ***, 不能被 require 正确引入
module.exports = fontPackerWebpackLoader
