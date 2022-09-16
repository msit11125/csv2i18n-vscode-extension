# csv2i18n README

Convert your csv file to i18n json file, support multiple language transfer. 
Apply to devextreme localization extendMessages.

## Example
Csv Template (for 3 language):
```json
key|en|zh-tw|zh-cn
System.User|User|使用者|用户
System.App|Application|應用程式|应用程序
```
Execute ctrl+shift+p: Csv2i18n: Convert it

It will convert to three part of files:

en.json 
```json
{
    "en": {
        "System.User": "User",
        "System.App": "Application",
    }
}
```
zh-tw.json
```json
{
    "zh-tw": {
        "System.User": "使用者",
        "System.App": "應用程式",
    }
}
```
zh-cn.json
```json
{
    "zh-cn": {
        "System.User": "用户",
        "System.App": "应用程序",
    }
}
```


## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1
Initial release

### 1.0.0
Update README
