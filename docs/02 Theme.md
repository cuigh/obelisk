# 主题

Obelisk 充分理解大家的个性化需求，故从一开始就添加了对主题的支持。

## 内置主题

目前 Obelisk 内置了 Willow 和 Coco 两款主题 (鉴于作者毕竟不是专业的设计师且时间有限，如果觉得页面样式不合口味也请多多包涵)。使用内置主题只需要把主题名称传递给 theme 参数即可，如下所示：

```shell
obelisk build -v /folder/to/vault -o /folder/to/output -t willow
```

Obelisk 内置的主题都放在 [GitHub](http://github.com/cuigh/obelisk) 上，你可以通过提交 PR 来完善它们或添加新的主题，Obelisk 每次发布新版会同步更新内置主题。

## 自定义主题

除了使用 Obelisk 内置的主题外，你也可以使用外部主题。Obelisk 的主题是一个包含页面模版、样式、脚本等资源的文件夹，典型的主题目录结构如下。

```
├── assets
│   ├── css
│   │   └── app.css
│   └── js
│       └── app.js
├── templates
│   └── page.html
└── theme.yml
```

只有 `templates/page.html` 和 `theme.yml` 是必须的，其中后者是主题的配置文件，包含主题名称、作者等配置信息。

```yaml
name: Willow
author: cuigh
url: github.com/cuigh/obelisk
assets:
  - assets
```

| 属性   | 说明             |
| ------ | ---------------- |
| name   | 主题名称         |
| author | 主题作者         |
| url    | 主题的网址       |
| assets | 要复制的资源文件 |

使用自定义主题跟使用内置主题没有太大的差别，只需要把主题文件夹的路径作为主题参数即可，如下所示

```shell
obelisk build -v /folder/to/vault -o /folder/to/output -t /folder/to/theme
```

> [!TIP]
> 如果你打算创建你自己的主题，在内置主题的基础上进行修改不失为一个便捷的方案。

## 模版

Obelisk 是使用 Go 语言开发的，其主题中的页面模版也采用了 Go 的 HTML 模版语法，你可以在访问 [html/template](https://pkg.go.dev/html/template) 页面了解语法规则。

### 内置函数

除了 Go 模版内置的函数之外，Obelisk 还添加了如下函数以方便模版的编写。

| Function | Description                          |
| -------- | ------------------------------------ |
| wrap     | wrap a value with context            |
| url      | convert relative url to corrent path | 
