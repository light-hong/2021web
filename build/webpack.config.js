const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: './src/index.ts', // 打包入口文件
  output: {
    filename: 'main.js' // 打包后文件名
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'] // 引入依赖去掉后缀
  },
  module: {
    rules: [
      { // 配置ts-loader模块: npm i ts-loader -D
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  // 配置调试source-map
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  // 本地服务器配置
  devServer: {
    contentBase: './dist', // 启动目录
    stats: 'errors-only', // 启动时打印的信息
    compress: false, // 压缩
    host: 'localhost', // 地址
    port: 8089 // 端口号
  },
  // 插件配置clean-webpack-plugin(编译前清理文件、文件夹) html-webpack-plugin(指定编译的HTML模板)
  // npm i clean-webpack-plugin html-webpack-plugin -D
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./dist'] // 编译前清理
    }),
    new HtmlWebpackPlugin({
      template: './src/template/index.html' // 指定编译模板
    })
  ]
}