import path from "path"

import { isStringArray } from "@Src/utils"

export interface Options {
  /**
   * 额外需要包含的文字
   *
   * @example: [ "锄禾日当午", "李", "白", "楚河汉界" ]
   * @default []
   */
  texts?: string[];
  /**
   * 包含需要打包的文字的文件 / 目录列表(会自动忽略二进制文件)
   *
   * @example: [ path.resolve("./src"), path.resolve("./dist/my-custom-texts.txt") ]
   * @default []
   */
  filesOrDirs?: string[],
}

export function geneOptions(options: Options = {}): Required<Options> {
  const result: Required<Options> = {
    texts: [],
    filesOrDirs: [],
    ...options,
  }

  const {
    texts, filesOrDirs,
  } = result

  if (!isStringArray(texts)) {
    throw new Error("arguments error: options.texts must be string[]")
  }
  if (!isStringArray(filesOrDirs)) {
    throw new Error("arguments error: options.filesOrDirs must be string[]")
  }

  return result
}

/**
 * 常用配置
 *
 * 不能闭着眼睛选这个, 先看看这些内容, 确认是不是符合自己的需要
 *
 * 如果不符合, 需要手动配置
 *
 * ``` typescript
 * export const simpleOptions: Options = {
 *   texts: [],
 *   filesOrDirs: [
 *     path.resolve("src"),
 *   ],
 * }
 * ```
 */
export const simpleOptions: Options = {
  texts: [],
  filesOrDirs: [
    path.resolve("src"),
  ],
}
