# font-packer-webpack-loader
模板来自 [quick-scaffold template-package-node](https://github.com/xiaomingTang/quick-scaffold)

### description
字体打包的 webpack loader

会提取配置中涉及的所有文本, 提取到 .ttf 文件; 生成的 .ttf 文件仅会包含配置中所涉及的文本

目前仅支持源文件为 .ttf 的提取

(不支持源文件为 .woff 或其他格式的提取, 对于不支持的文件会自动跳过)

如果你只有 .woff 文件, 那就手动转成 .ttf 再来吧

不知道怎么转的, 可以试试这个 https://convertio.co/zh/woff-ttf/ (随便百度的一个)

### Install
```yarn add -D font-packer-webpack-loader```

### Usage
``` javascript
// webpack.config.js

const SRC = path.resolve("src")

module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.ttf(\?.*)?$/i,
        include: SRC,
        use: [
          // 正常 .ttf 文件需要的 loader
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "p-f-[name].[contenthash:5].[ext]",
            },
          },
          // 在下面新增本 loader
          {
            loader: "font-packer-webpack-plugin",
            options: {
              texts: [
                "这是可选的、需要额外提取的文本",
              ],
              filesOrDirs: [
                // 可选
                // 示例是 src 目录, 你可以配置任何文件或目录, 会将该 文件/目录 中的文本提取到 .ttf 文件中
                SRC,
              ],
            },
          },
        ],
      },
    ],
  },
}
```
### 项目特点
- `typescript`
