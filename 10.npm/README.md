## 初始化包
package.jaon
```bash
npm init
```
## 下载包
全局安装
我要写一个全局包
fish-pack 这个命令 package.json 里面bin 配置
npm link 
出来下面这个
/usr/local/bin/fish-pack -> /usr/local/lib/node_modules/fish-pack/bin/www.js
/usr/local/lib/node_modules/fish-pack -> /Users/zouyu/Desktop/node-zy/10.npm

- 本地安装
```js
npm install jquery --save / -S
npm install webpack --save-dev 只开发用 / -D
```
默认不给--save 默认安装到dependencies 表示上线跟开发的时候都需要
> 区别有一天模块发布了 --别人会安装你发布的模块 
你的模块中的dependencies 会默认一起下载 -devdependencies 不会被下载
```js
npm cache clean --force
```
peerDependencies vue vue-template-complier

```js
npm install --production 只安装dependencies

peerDependencies 只会提示你安装依赖模块指定版本号

bundleDependencies: ['jquery'] //打包要不要打进去 npm pack

optionalDependencies 如果找不到 不会影响npm下载
```
## 版本问题
- npm 1.0.0 第一位如果变了 表示不兼容老代码 大规模的更新
```js
npm version patch
npm version major
npm version minor 更改版本号

2.1.0-beta.1 测试版   alpha beta rc 版本测试
license
```
## script 配置执行脚本
echo XXX 
执行node_modules下面的bin的文件
npm run 会把当前目录的node_modules下面的.bin放到系统变量中
所以 npm run 可以执行.bin下的文件

## npx 直接执行node_modlues下面的命令 不需要要配置script
用完就销毁 npx create-react-app 每次都是用最新的 本地不用下载
## 发包
```js
@vue/cli @vue/service 作用域包
npm init --scope=@my-username
npm publish --access publish
切换到全局下 cat ~/.npmrc 配置文件
nrm 可以切换源
npm install nrm -g
nrm ls 
nrm use npm
npm login
npm addUser
npm publish
```