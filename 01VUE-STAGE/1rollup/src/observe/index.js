import { isObject } from "../utils"

// 监测数据变化
class Observer{
  constructor(data) { // 对对象中的所有属性进行劫持
    this.walk(data)
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

// vue2 会对对象进行遍历 将每个属性用defineProperty重新定义 性能差
function defineReactive(data, key, value) { // value有可能是对象
  observe(value) // 本身用户默认值是对象套对象 需要递归处理
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) { // 如果用户赋值一个新对象 需要将这个对象进行劫持
      observe(newVal)
      value = newVal
    }
  })
}


export function observe(data) {
  if (!isObject(data)) {
    return
  }
  // 默认最外层的data必须是一个对象
  return new Observer(data)
}