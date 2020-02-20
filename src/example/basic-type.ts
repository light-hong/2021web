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