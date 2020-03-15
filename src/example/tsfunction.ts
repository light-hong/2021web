// 1.函数声明
function fn1(x: string, y: number): number {
  return 2
}
// 2.函数表达式
const fn2 = function (x: string, y: number): string {
  return 'abc'
}

const fn3 = (x: string, y: number): string => {
  return 'abc'
}
// 3.可选参数
function fn4(x: string, y?: number): void {
  console.log('fn4', x, y)
}
fn4('abc', 12)
fn4('abcd')
// 4.形参默认值
function fn5(x: string, y: number=3) {
  console.log('fn5', x, y)
}
fn5('abc')
// 5.剩余参数
function fn6(x: string, ...args: any[]) {
  console.log('fn5', x, ...args)
}
fn6('abc', 2, 'abcd', true)