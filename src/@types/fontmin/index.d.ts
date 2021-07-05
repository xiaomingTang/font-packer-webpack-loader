type FileOrPaths = string | string[] | Buffer

declare module "fontmin" {
  /**
   * 这个类型具体是什么要去研究源码
   */
  type Plugin = unknown

  /**
   * 类型并不完善, 有待后来者补充
   *
   * 官方仓库中的类型说明是错的, 这些类型都是我一个一个试出来的
   *
   * 有些我用不上的就懒得试了, 还有些比较复杂(我不知道)就直接以 any / unknown 作为类型了
   */
  class Fontmin {
    src(file: FileOrPaths): this

    dest(dir: string): this

    use(plugin: Plugin): this

    /**
     * cb 第二个参数 files 很复杂, 懒得写了
     */
    run(cb?: (err: Error | undefined | null, files: {
      history: string[];
      cwd: string;
      base: string;
      /**
       * 可能当 src 的参数是 string 的时候, 这个 stat 是 fs.Stat 吧, 懒得试了
       */
      stat: null;
      _contents: Buffer;
      _isVinyl: boolean;
      ttfObject: {
        version: number,
        numTables: number,
        searchRenge: number,
        entrySelector: number,
        rengeShift: number,
        head: unknown[],
        maxp: unknown[],
        cmap: unknown[],
        glyf: unknown[],
        name: unknown[],
        hhea: unknown[],
        post: unknown[],
        "OS/2": unknown[],
        gasp: unknown[],
        searchRange: number,
        rangeShift: number
      };
    }[]) => void): unknown

    static glyph(opt?: {
      text?: string;
      basicText?: boolean;
      hinting?: boolean;
      use?: Plugin;
    }): Plugin

    static ttf2eot(opt?: {
      clone?: boolean;
    }): Plugin

    static ttf2woff(opt?: {
      clone?: boolean;
      deflate?: boolean;
    }): Plugin

    static ttf2woff2(opt?: {
      clone?: boolean;
    }): Plugin

    static ttf2svg(opt?: {
      clone?: boolean;
    }): Plugin

    static css(opt?: {
      glyfh?: boolean;
      base64?: boolean;
      iconPrefix?: string;
      /**
       * 文档中提示还有一种可选类型是 FontFamilyTransform, 我没有找到他的定义
       */
      fontFamily?: string;
    }): Plugin

    /**
     * opt 被直接作为外部函数的参数, 所以还有一堆可选属性, 感兴趣的自己去看[fonteditor-core 的 TTFWriter](https://github.com/kekee000/fonteditor-core/)
     */
    static svg2ttf(opt?: {
      clone?: boolean;
      hinting?: boolean;
    }): Plugin

    /**
     * opt 被直接作为外部函数的参数, 所以还有一堆可选属性, 感兴趣的自己去看[源码](https://github.com/ecomfe/fontmin/blob/master/plugins/svgs2ttf.js)
     */
    static svgs2ttf(file: string, opt?: {
      hinting?: boolean;
      fontName?: string;
    }): Plugin

    /**
     * opt 被直接作为外部函数的参数, 所以还有一堆可选属性, 感兴趣的自己去看[源码](https://github.com/ecomfe/fontmin/blob/master/plugins/otf2ttf.js)
     */
    static otf2ttf(opt?: {
      clone?: boolean;
      hinting?: boolean;
      text?: string;
      basicText?: boolean;
    }): Plugin
  }

  export default Fontmin
}
