import assert from "assert"
import fs from "fs"
import path from "path"
import rimraf from "rimraf"
import { getAllFilesFromArray, isFile } from "@Src/utils"

import { resolvePath, asyncWebpack } from "./utils"

const TEST_ROOT = resolvePath("./test-dist")

function resolveTestRoot(...p: string[]) {
  return resolvePath(TEST_ROOT, ...p)
}

const SRC_ROOT = resolveTestRoot("src")
const FONT_SRC_ROOT = resolveTestRoot("src/fonts")
const OUTPUT_ROOT = resolveTestRoot("output")
const FONTS_OUTPUT_ROOT = resolveTestRoot("output/fonts")

describe("FontPackerWebpackLoader", () => {
  beforeEach((done) => {
    rimraf(OUTPUT_ROOT, done)
  })

  it("success load", async () => {
    const [, stats] = await asyncWebpack({
      mode: "production",
      entry: [
        resolveTestRoot("src/index.js"),
      ],
      output: {
        path: OUTPUT_ROOT,
        filename: "[name].bundle.js",
      },
      module: {
        rules: [
          // ...
          {
            test: /\.ttf(\?.*)?$/i,
            include: SRC_ROOT,
            use: [
              // 正常 ttf 文件需要的 loader
              {
                loader: "url-loader",
                options: {
                  limit: 1,
                  name: "fonts/compressed-[name].[ext]",
                },
              },
              // 在下面新增本 loader
              {
                loader: resolvePath("./dist/index.js"),
                options: {
                  texts: [
                    "这是可选的、需要额外提取的文本",
                  ],
                  filesOrDirs: [
                    // 示例是 src 目录, 你可以配置任何文件或目录, 将会将该 文件/目录 中的文本提取到 .ttf 文件中
                    SRC_ROOT,
                  ],
                },
              },
            ],
          },
        ],
      },
    })

    // 确保不存在编译错误
    assert.strictEqual(stats.hasErrors(), false, `webpack 存在编译错误: ${stats}`)

    const originFonts = getAllFilesFromArray([FONT_SRC_ROOT])
    // 已压缩字体文件
    const compressedFonts = originFonts.map((item) => path.join(OUTPUT_ROOT, `fonts/compressed-${path.basename(item)}`))

    compressedFonts.forEach((item) => {
      // 确保文件存在
      assert(isFile(item), `is not file: ${item}`)
      const size = fs.statSync(item)?.size || Infinity
      // 确保文件尺寸小于 20k
      assert(size < 20 * 1024, `size great than 20k: ${size}`)
    })
  })

  it("rimraf output and do nothing", () => {
    rimraf(OUTPUT_ROOT, () => null)
  })
})
