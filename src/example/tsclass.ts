/* 
  Typescript中类的用法
  1. 访问修饰符
      public：任何地方都可见，默认是public
      protected：类内部或子类中可见
      private：只在类内部可见
  2.readonly
      只能通过构造方法赋值一次
  3.抽象类
      可以包含抽象方法，不能创建实例
      抽象方法：有abstract/没有方法体
      实现方法：没有abstract/ 有方法体
*/
class A {
  m1: string
  public readonly m2: string
  protected m3: string
  private m4: string
  
  constructor(m1: string, m2: string, m3: string, m4: string) {
    this.m1 = m1
    this.m2 = m2
    this.m3 = m3
    this.m4 = m4
  }

  toString() {
    // this.m2 = 'a' // 不能重新赋值
    return `${this.m1}-${this.m2}-${this.m3}-${this.m4}`
  }
}

// 抽象类
abstract class AAA {
  m1: string
  test1() {}
  abstract test2(): void
}