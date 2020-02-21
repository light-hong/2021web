// 布尔类型
let bool1: boolean = false
let bool2: boolean
bool2 = false
// bool2 = 123

// 数值类型（浮点数）
let num: number = 123
// num = 'abc'
num = 0b1111011
num = 0o173
num = 0x7b

// 字符串类型
let str: string = 'abc'
str = `数值是${num}`

// 数组类型
let arr1: number[]
arr1 = [3, 4]
// arr1 = ['a', { name: 'Tom' }]

let arr2: Array<number>
arr2 = [5, 60]
let arr3: Array<string | number>
arr3 = ['f', 123]
let arr4: (string | number)[]
arr4 = [14, 'b']

// 元祖类型(确定长度和类型的数组)
let tuple: [string, number, boolean]
tuple = ['sss', 222, true]

// 枚举类型(序列号可以指定，自增)
enum Roles {
  SUPER_ADMIN,
  ADMIN = 6,
  USER
}
console.log(Roles.ADMIN)
console.log(Roles[7])

// any类型
let value: any
value = 123
value = 'aaa'

// void类型
const test = (text: string): void => {
  console.log(text)
}
test('abc')

// null和undefined 是所有其他类型的子类型
let u: undefined
u = undefined
// u = 123 报错
let n: null
n = null
// n = 123 报错
value = undefined
value = null

// never类型 never 是其它类型（包括 null 和 undefined）的子类型，代表从不会出现的值
const errorFunc = (message: string): never => {
  throw new Error(message)
}
const infiniteFunc = (): never => {
  while (true) {}
}

// object
let obj = {
  name: 'Tom'
}
function getObj(obj: object): void {
  console.log(obj)
}
getObj(obj)

// 类型断言 类型不确定时用于指定类型 两种方式1. <type>变量;2. 变量 as type
const getLength = (target: string | number): number => {
  if ((<string>target).length || (target as string).length === 0) {
    return (<string>target).length
  } else {
    return target.toString().length
  }
}
