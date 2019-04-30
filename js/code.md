<!-- more -->

### 代码技巧

1. ES2015+ 新特性写法

熟练使用 ES6 新特性可以优化代码，更加简洁，代码对比
```
// 箭头函数
function foo(){
  console.log('hello world')
}

const foo = () => console.log('hello world')

// 数组去重
const formatArray = arr => [...new Set(arr)]

// 数组合并
const newArr = [...arr1, ...arr2, 'value']

// 创建数组
a = [...Array(4).keys()]  // [0, 1, 2, 3]

// 对象浅拷贝
const newObj = {...obj}

// 解构赋值
const person = {name: 'bao', age: 18}
const { name, age } = person

// 常见对象属性取值前判断对象是否存在
// 如下是 react + antd 渲染 table 的简单代码，对象存在性判断 + 默认值设置

render(){
  const { downloadList } = this.props.store.downloadList
  let items = downloadList && downloadList.items || []
  let itemCount = downloadList && downloadList.itemCount || 10
  
  return <Table dataSource={items} pagination={{total: itemCount}} />
}

// 优化后
render(){
  const { items, itemCount } = this.props.manageStore.downloadList || {}
  return <Table dataSource={items || []} pagination={{total: itemCount || 10}}/>
}
...
```

2. 优化逻辑判断语句

大量的 if else 逻辑判断难以维护，且性能较差，可用多种方式代替
```
// 对象配置法
// ps 函数内部有条件判断，且 return 值时，满足条件立即return，而不要在结尾return
const foo = v => {
  if (v === 'name') {
    return 'bao'
  } else if (v === 'age') {
    return '18'
  } else if (v === 'height') {
    return '180'
  }
}

const cfg = {
  name: 'bao',
  age: '18',
  height: '180'
}

const foo = v => cfg[v]

// 数组配置法
if (value === 'hello' || value === 'world' || value === 'blabla') {
  // ...
}

// 配置数组形式
const rightValue = ['hello', 'world', 'blabla']
if (rightValue.includes[value]) {
  // ...
}
```

3. && 、 || 和 三元运算
```
if (name === 'bao') {
  someFunc()
}

name === 'bao' && someFunc()

if (name === 'bao') {
  someFunc()
} else {
  elseFunc()
}

name === 'bao' ? someFunc() : elseFunc()
```
> 坚决反对多个三元运算相连使用，可读性太差如下示例
```
let example = ''
if(type == 1) {
    example = 'a'
} else if (type == 2) {
    example = 'b'
} else if (type == 3) {
    example = 'c'
}else{
    example = 'd'
}

// 改三元运算
example = type == 1 ? 'a' : type == 2 ? 'b' : type == 3 ? 'c' : 'd'

// 这样的一堆 ？和 : ，实际项目中代码复杂时可读性太差
// 优化:
const typeCfg = {
    1: 'a',
    2: 'b',
    3: 'c',
    default: 'd'
}
let example = typeCfg[type] || typeCfg.default;
```

4. 对象属性变量应用

如在 react 中，调用 action 方法来获取数据，不同条件执行不同方法
```
if (isMember) {
  let res = await actions.getMemberInfo(params)
} else {
  let res = await actions.getCommonUserInfo(params)
}

const actionName = isMember ? 'getMemberInfo' : 'getCommonUserInfo'
let res = await actions[actionName](params)
```

5. 类型转换
```
// 字符串转数字
let str = '1234'
let num = +str

console.log(+new Date()) // 1536231682006

// 转字符串
let str = `${num}`
let str2 = num + ''
```
6. 用 Array.map(), Array.filter() 代替数组 for 循环实现简易写法

 如下对数组元素的操作
```
let arr = [1, 2, 3, 4, 'A', 'B']

// 1. 取出 arr 中数字项为新数组
let numArr = []
for(let i in arr){
  if(typeof arr[i] === 'number'){
    numArr.push(arr[i])
  }
}

// 改用filter
let numArr2 = arr.filter(item => typeof item === 'number')
console.log(numArr2) // [1,2,3,4]

// 2. 获得新数组，元素是 arr 每个元素作为 value, key 为 arr 下标的对象, 不修改 arr
let strArr = []
for(let i in arr){
  strArr.push({[i]: arr[i]})
}

// 改用 map
let strArr2 = arr.map((item, i) => ({[i]: arr[i]}))
console.log(strArr2) // [ { '0': 1 },{ '1': 2 },{ '2': 3 }, { '3': 4 }, { '4': 'A' }, { '5': 'B' } ]
```

7、浅拷贝、深拷贝
复杂数据类型对象深拷贝建议使用库来实现，如 [lodash.cloneDeep](http://lodash.think2011.net/cloneDeep)
```
// 浅拷贝
let obj1 = { a: 11, b: { ba: 22 } }
let obj2 = {...obj1}
console.log(obj2); // ​​​​​{ a: 11, b: { ba: 22 } }​​​​​

console.log(obj1 === obj2); // false
console.log(obj2.b === obj1.b); // true

// 深拷贝，这种方法需要对象能够被 json 序列化
let obj3 = JSON.parse(JSON.stringify(obj1))
console.log(obj3); //  ​​​​​{ a: 11, b: { ba: 22 } }​​​​​
console.log(obj3 === obj1); // false
console.log(obj3.b === obj1.b); // true
```

8. [optional-chaining](https://github.com/tc39/proposal-optional-chaining) ?. 代替对象是否存在判断，提高代码健壮性

需要添加 `@babel/plugin-proposal-optional-chaining` 插件支持，
可参考[babel 7 简单升级指南](https://juejin.im/post/5b87cab1e51d4538ac05dc54)，
最喜欢这个语法，babel7 升级第一时间试用
```
// obj?.prop       // optional static property access
// obj?.[expr]     // optional dynamic property access
// func?.(...args) // optional function or method call

// 如下代码
let { data } = this.props
let list = data && data.tableData && data.tableData.list || []

// 使用 ?.
let list = data?.tableData?.list || []
```

### 更高效的代码

1. 使用局部变量代替引用类型查找

局部变量的读取速度最快，而引用类型的数据读取需要按引用指针去查找，所以可以对多次使用的引用类型属性
使用局部变量读取一次，重复使用
```
let obj = {
  person: {
    man: {
      bao: {
        age: 18
      }
    }
  }
}

let age = obj.person.man.bao.age
// use age do many things
```
2. 删除多个对象属性时先使属性为 null

删除属性时，js 引擎会去查找该属性的值是否是其他对象的引用，所以删除前提前赋值为 null，可以减少
js 引擎的检测过程，提高效率，不过，8102 年的 V8 真的需要这些优化么。。。
```
let obj = {
  person: {
    man: {
      bao: {
        age: 18
      }
    }
  }
}
obj.person = null
delete obj.person
```

3. 局部变量保存数组 length

关于这个问题讨论一直不少，参考[有没有必要缓存JavaScript数组的length](https://www.zhihu.com/question/29714976)
```
let len = arr.length
for(let i=0; i<len; i++)){
  // ...
}
```

### 代码结构组织等优化

随着项目的日益扩大，代码量快速增多，后期维护非常耗费时间，主要通过以下方法减少代码量

1. 凡是二次出现的代码片段，逻辑组件，立即考虑复用，拆分公共组件，渐进增强，逐渐完善功能

2. 封装功能函数，尽量使函数单一职责，重复功能函数建立项目函数库

3. 善用 class 类的继承，复用功能方法

    如将 fetch 请求的 get/post 方法定义到 CommonActions class, 然后创建 actions 时只需要
    extends CommonActions 就可以在新的 actions 中直接调用 this.get()/this.post() 来完成
    请求数据。

    总之，在逻辑清晰的情况下，尽可能复用组件、方法，维护好高质量的公共组件、方法，便于项目维护和偷懒

4. 善用装饰器
    
    react 高阶函数已经提供了一种优雅的组件复用形式，而装饰器的使用可以更优雅地实现高阶函数

    同时，如ant design Form 组件的创建也可用装饰器更简单的实现
    ```
    class MyForm extends React.Component {
    // ...
    }

    const WrapForm = Form.create()(MyForm)

    // 装饰器形式
    @Form.create()
    class MyForm extends React.Component {
    // ...
    }
    ```

> 更新：20190407
5. 语义化命名
    
    - 给每个函数和 class 组件添加明确的语义化命名。
    匿名函数、组件写起来方便，但是一旦出现 bug 难以在错误信息的调用栈中快速定位到报错函数和组件
    - 语义化变量名或函数名。
    不用担心变量名太长webpack 会搞定这些，我们更需要通过变量名或函数名直观的了解变量或函数的功能、作用，
    提高代码阅读效率和可维护性，让 3 个月后的自己和同事能够更快看懂代码。

6. 常量、配置项与业务逻辑解耦

    - 所有固定的常量或配置项以独立模块（如 constant.js) 的形式集中配置，方便复用和维护
    - 常量命名使用大写字母也是区分常量和普通变量的好办法
    - 如果独立保存了常量和配置项，那和同事约定相关文件存储结构也很有必要

7. 尽可能完善的注释
    
    - 语义化的命名习惯足矣代替很多注释
    - 公共组件或函数详细写清楚 props 参数或函数参数注释和使用情况，哪些是必须，哪些可选，
    尽量使用标准注释格式（如 (JSDoc)[https://github.com/jsdoc3/jsdoc]，方便大家使用和参考
