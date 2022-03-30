# Theme

Obelisk fully understood everyone's personalized needs, so it added support for the theme from the beginning.

## Built in themes

At present, Obelisk has built-in willow and coco themes (since the author is not a professional designer after all, please forgive me if you think the style is not to your taste). To use the built-in theme, you only need to pass the theme name to the theme parameter, as shown below.

```shell
obelisk build -v /folder/to/vault -o /folder/to/output -t willow
```

Obelisk's built-in themes are placed on [GitHub](http://github.com/cuigh/obelisk). You can improve them or add new themes by submitting PR. Obelisk will update the built-in themes synchronously every time it releases a new version.

## Custom theme

In addition to using Obelisk's built-in themes, you can also use external themes. The theme of obelisk is a folder containing page templates, styles, scripts and other resources. The typical theme directory structure is as follows.

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

Only `templates/page.html` and `theme.yml` are required. The latter is the configuration file of the theme, which contains the configuration information such as theme name and author.

```yaml
name: Willow
author: cuigh
url: github.com/cuigh/obelisk
assets:
  - assets
```

| Property | Description            |
| -------- | ---------------------- |
| name     | Theme name             |
| author   | Theme author           |
| url      | Theme homepage         |
| assets   | Resource files to copy | 

Using a custom theme is not much different from using a built-in theme. You only need to take the path of the theme folder as the theme parameter, as shown below.

```shell
obelisk build -v /folder/to/vault -o /folder/to/output -t /folder/to/theme
```

> [!TIP]
> If you plan to create your own theme, it is a convenient solution to modify it based on the built-in theme.

## Template

Obelisk is developed in Go language, and the page template in its theme also adopts go's HTML template syntax. You can visit [html/template](https://pkg.go.dev/html/template) to learn detail about its syntax.

### Functions

In addition to the built-in functions of the Go template, Obelisk also adds the following functions to the template engine.

| Function | Description                          |
| -------- | ------------------------------------ |
| wrap     | wrap a value with context            |
| url      | convert relative url to corrent path | 
