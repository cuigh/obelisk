# Quick start

## Download

You can download the lastest version from here: [Obelisk](https://github.com/cuigh/obelisk/releases). Obelisk does not rely on any third-party tools or class libraries at runtime, so you only need to download its binary executable.

## Usage

After downloading Obelisk and decompressing it to the system ==PATH== directory, you can generate static HTML pages from the markdown document vault with the following command.

```shell
obelisk build -v /folder/to/vault -o /folder/to/output
```

The complete parameters of the `build` command are shown in the following table.

| Argument  | Description                                          | 
| --------- | ---------------------------------------------------- |
| v, vault  | document vault path, required                        |
| t, theme  | internal theme name or external theme path, optional |
| o, output | output path, required                                |
| h, help   | show help                                            |

If you want to set the style of the generated pages, you can refer to the chapter [[02 Theme|Theme]].

## Convention

In order to simplify use, Obelisk follows the principle that convention is higher than configuration.

### Navigation

By default, navigation menus are sorted by file name, but this is probably not what you want. When the name of a file or folder starts with a number, Obelisk will automatically extract the number as the sequence number, and then sort it in ascending order. The serial number of all file names that do not start with a number is set to 999 by default. After extracting the sequence number, Obelisk will also carefully remove the sequence number from the title to make the navigation menu and URL look more comfortable. Examples are as follows:

| Source Name         | Target Name        |
| ------------------- | ------------------ |
| 00 Home.md          | home.html          |
| 01 Reading Notes.md | reading-notes.html |

### URL

By default, Obelisk will convert file and folder names according to kebab style. For example, ==Reading Notes== will be converted to ==reading-notes==. In addition, you can specify the page URL in other ways.

- Add `slug` attribute in document metadata
- Add path mapping in vault configuration file (obelisk.yml)
```yaml
paths:  
  - Reading Notes: reading-notes
```

### Favicon

Obelisk will check whether the following files exist in the document library in turn. If it can be found, it will be automatically set as the favicon of the website.

- assets/favicon.ico
- assets/favicon.png
- assets/favicon.svg
- assets/logo.png
- assets/logo.svg

### Logo

Similar to favicon, Obelisk will check whether the following image files exist in the document library in turn. Once found, Obelisk will automatically set it as the logo of the website.

- assets/logo.png
- assets/logo.svg

### Ignore Path

You may want to hide some directories or files of the document library when publishing, such as unfinished drafts or attachments. Obelisk supports ignoring the specified folders. The files in these directories will not be output as documents into HTML pages or appear in the navigation menu (but will not affect the reference of other pages to it as resource files). If you do not configure the document library, Obelisk will ignore the following directories by default.

- assets
- templates
- attachments
