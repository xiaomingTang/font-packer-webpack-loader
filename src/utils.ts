import fs from "fs"
import path from "path"
import chalk from "chalk"

export const LOADER_NAME = "font-packer-webpack-plugin"

interface Stringable {
  toString: () => string;
}

export const log = {
  info(...text: Stringable[]): void {
    console.log(chalk.cyan(`[${LOADER_NAME} info]: `, ...text))
  },
  success(...text: Stringable[]): void {
    console.log(chalk.green(`[${LOADER_NAME} success]: `, ...text))
  },
  warn(...text: Stringable[]): void {
    console.log(chalk.yellow(`[${LOADER_NAME} warn]: `, ...text))
  },
  error(...text: Stringable[]): void {
    console.log(chalk.red(`[${LOADER_NAME} error]: `, ...text))
  },
  whispered(...text: Stringable[]): void {
    console.log(chalk.gray(`[${LOADER_NAME} whispered]: `, ...text))
  },
}

export function isStringArray(arr: unknown): arr is string[] {
  if (Array.isArray(arr) && arr.every((item) => typeof item === "string")) {
    return true
  }
  return false
}

export function isFile(p: string): boolean {
  return fs.existsSync(p) && fs.statSync(p).isFile()
}

export function isDir(p: string): boolean {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

/**
 * 非目录时, 返回空数组
 */
function getChildren(dirPath: string): string[] {
  if (!isDir(dirPath)) {
    return []
  }
  return fs.readdirSync(dirPath).map((child) => path.resolve(dirPath, child))
}

interface AnalyzedChildrenInfo {
  files: string[];
  dirs: string[];
}

/**
 * 分析目录下的直属下级的文件和目录情况
 */
function analyzeDir(dirPath: string): AnalyzedChildrenInfo {
  const result: AnalyzedChildrenInfo = {
    files: [],
    dirs: [],
  }

  getChildren(dirPath).forEach((child) => {
    if (isFile(child)) {
      result.files.push(child)
    } else {
      result.dirs.push(child)
    }
  })

  return result
}

/**
 * 输入父目录路径, 返回该目录下所有文件路径
 *
 * 当 dirPath 为文件时, 返回 [ dirPath ]
 *
 * !!! 警告, 路径会被 path.resolve 处理成绝对路径
 */
function getAllFiles(dirPath: string): string[] {
  if (isFile(dirPath)) {
    return [dirPath]
  }
  const rootInfo = analyzeDir(dirPath)
  const allDirs = [...rootInfo.dirs]
  const allFiles = [...rootInfo.files]
  let curIdx = 0
  while (curIdx < allDirs.length) {
    const info = analyzeDir(allDirs[curIdx])
    allDirs.push(...info.dirs)
    allFiles.push(...info.files)
    curIdx += 1
  }
  return allFiles
}

export function getAllFilesFromArray(paths: string[]): string[] {
  const init: string[] = []
  return paths.reduce((prev, cur) => (
    [...prev, ...getAllFiles(cur)]
  ), init)
}
