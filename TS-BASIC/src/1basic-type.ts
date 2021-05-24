/*
 * @Descripttion: ts基础数据类型
 * @Date: 2021-05-24 23:16:54
 */
let married:boolean = true
let age:number = 10
let first_name:string = 'tom'
let arr1:number[] = [1, 2]
let arr2:Array<number> = [3, 4, 5]
// 元组类型tuple 数量和类型已知的数组
let temp_tuple:[string, number] = ['hhh', 1235]
// 普通枚举
enum Gender{
  BOY,
  GIRL
}
console.log(Gender['BOY'], Gender[0])
console.log(Gender['GIRL'], Gender[1])
// 常量枚举
const enum Colors{
  RED,YELLOW,BLUE
}
console.log(Colors.RED, Colors.YELLOW, Colors.BLUE)
// 任意类型 any
let root:any = document.getElementById('root')
let root1:(HTMLElement|null) = document.getElementById('root')
// null undefined 是其他类型的子类型
// 如果tsconfig中strictNullChecks的值设置为true, 则undefined和null不能赋值给其他类型
let x:number
x = 22
x = null
x = undefined

