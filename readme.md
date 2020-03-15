--src  源码目录
  --api  接口请求模块
  --assets  公共资源模块
  --config  配置模块
  --tools  与业务无关纯工具函数模块
  --utils  业务相关可复用方法
--typings  ts模块生命文件
--build  开发配置

npm全局安装typescript和tslint
初始化ts配置: tsc --init

本地开发环境安装webpack、webpack-cli、webpack-dev-server依赖
npm i webpack webpack-cli webpack-dev-server -D

安装cross-env可以获取脚本配置的环境参数
npm i cross-env -D

package.json启动脚本
"start": "cross-env NODE_ENV=development webpack-dev-server --config ./build/webpack.config.js"
"build": "cross-env NODE_ENV=production webpack --config ./build/webpack.config.js"

build目录下添加webpack配置文件webpack.config.js

环境搭建方法二：
  1.全局下载ts:npm i typescript -g
  2.查看版本:ts -v
  3.编译ts自动生成js文件:tsc index.ts
  4.vscode自动化编译
    a.生成配置文件:tsconfig.json
      tsc --init
    b.修改配置
      "module": "amd",
      "outDir": "./js",
      // "strict": true
    c.启动监视任务
      终端 -> 运行任务 -> 监视tsconfig.json