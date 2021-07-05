import path from "path"
import webpack from "webpack"

/**
 * @example
 * ``` typescript
 * await sleep(500)
 * ```
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

/**
 * @example
 * ``` typescript
 * const [err, stats] = await asyncWebpack(webpackConfig)
 * // do more...
 * ```
 */
export async function asyncWebpack(webpackConfig: webpack.Configuration | webpack.ConfigurationFactory): Promise<[Error, webpack.Stats]> {
  return new Promise((resolve) => {
    webpack(webpackConfig, (err, stats) => {
      resolve([err, stats])
    })
  })
}

/**
 * 将输入路径调用 path.resolve 处理成绝对路径, 并将路径分隔符全部替换成 "/"
 */
export function resolvePath(...p: string[]): string {
  return path.resolve(...p)
}
