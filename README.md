# 广告后台管理系统

## 发布流程

1. `git checkout master`
2. `npm run build`
3. `npm run release`
4. `git push origin master`
5. `git push --tags origin master`

* 正常发布版本：`npm run release`
* 第一次发布版本：`npm run release -- --first-release`
* 预发布版本：`npm run release -- --prerelease`
* 发布指定版本：`npm run release -- --release-as 1.1.0`

## 版本规范

本项目严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

版本格式：主版本号.次版本号.修订号，版本号递增规则如下：

* 主版本号：当你做了不兼容的 API 修改，
* 次版本号：当你做了向下兼容的功能性新增，
* 修订号：当你做了向下兼容的问题修正。
  
先行版本号及版本编译元数据可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

`git commit` 中的不同类型将会影响正常发布的版本号，`fix`类型将增加**修订号**，`feat`类型将增加**次版本号**

## 开发

1. `npm install`
3. `npm run start:no-mock`

# 链接

- [更新日志](./CHANGELOG.md)
