interface IPerson {
  readonly id: number // readonly 属性只读 不可改
  name: string
  age: number
  sex?: string // 加? 属性可有可无
}

const p1: IPerson = {
  id: 1,
  name: 'tom',
  age: 18,
  sex: 'man'
}
const p2: IPerson = {
  id: 2,
  name: 'tom',
  age: 18
}
// p2.id = 3