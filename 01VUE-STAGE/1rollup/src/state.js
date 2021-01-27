import { observe } from "./observe/index"
import { isFunction } from "./utils"

export function initState(vm) { // 状态的初始化
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  /* if (opts.computed) {
    initComputed()
  }
  if (opts.watch) {
    initWatch()
  } */
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}

function initData(vm) {
  let data = vm.$options.data
  // vue2中会将data中的所有数据 进行数据劫持 Object.defineProperty
  // 这个时候vm和data没有任何关系 通过_data进行关联
  data = vm._data = isFunction(data) ? data.call(vm) : data
  for (const key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}
