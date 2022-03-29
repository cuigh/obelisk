# 快速上手

## 下载

你可以从这里下载最新版本的 [Obelisk](https://github.com/cuigh/obelisk/releases)。

## 使用

下载 Obelisk 并把它解压到系统 PATH 目录后，就可以通过下面的命令把 Markdown 文档仓库生成静态 HTML 页面。

```shell
obelisk build -v /folder/to/vault -o /folder/to/output
```

build 命令的完整参数见下表。

| 参数      | 说明                                                 |
| --------- | ---------------------------------------------------- |
| v, vault  | document vault path, required                        |
| t, theme  | internal theme name or external theme path, optional |
| o, output | output path, required                                |
| h, help   | show help                                            |

如果你希望设置生成页面的样式，你可以参考 [[02 Theme]] 章节。

## 约定

为简化使用，Obelisk 遵循约定高于配置的原则。

### 导航排序

默认情况下，导航菜单以文件名进行排序，但这很可能不是你想要的。当文件或文件夹的名称以数字开头时，Obelisk 会自动提取数字作为顺序号，然后用升序进行排序，所有不以数字开头的文件名的序号都默认为 999。在提取顺序号之后，Obelisk 还会贴心的把顺序号从标题中移除，以便让导航菜单和 URL 看起来更舒服。示例如下：

| 源文件名            | 目标文件名         |
| ------------------- | ------------------ |
| 00 Home.md          | home.html          |
| 01 Reading notes.md | reading-notes.html |

### URL

默认情况下，Obelisk 会按照 Kebe 方式对文件和文件夹名称进行转换，比如 Test Aaa 会转换成 test-aaa。除此之外，你也可以通过其它方式来指定页面 URL。

- 通过在文档 metadata 中添加 slug 属性
- 在仓库配置文件中添加路径映射。注意路径映射只

### Favicon

### Logo

### Ignore Path

你可能希望在发布时隐藏文档库的部分目录或文件，比如未完工的草稿文件夹或附件文件夹。Obelisk 支持忽略指定的文件夹，这些目录下的文件将不会作为文档输出成 HTML 页面，也不会出现在导航菜单中（但不会影响其它页面对它作为资源文件的引用）。如果你不对文档库进行配置，Obelisk 默认会忽略如下目录：

- assets
- templates
- attachments
