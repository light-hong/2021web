/* 
  当使用第三方库时，我们需要引用它的声明文件，才能获得对应得代码补全、接口提示等功能。
  声明语句：如果需要ts对新的语法进行检查，需要加载对应得类型说明代码
    declare var jQuery: (selector: string) => any;
  声明文件：把声明语句放到一个单独的文件(jQuery.d.ts)中，ts会自动解析到项目中所有声明文件
  下载声明文件：npm install @types/jquery --save-dev 在库名前加@types/
*/
jQuery('abc')