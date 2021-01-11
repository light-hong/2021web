import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 支持amd和common js规范 设置name属性会向全局暴露该属性 window.Vue
    name: 'Vue',
    file: 'dist/vue.js',
    sourcemap: true, // es5 -> es6源代码
  },
  plugins: [
    babel({ // 使用babel进行转换 排除node_modules
      exclude: 'node_modules/**' // glob 语法
    })
  ]
}
