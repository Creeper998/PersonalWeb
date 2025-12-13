# UI渲染 + 交互逻辑

 ## 核心思路：数据通过props传入
Props是什么？ ——Properties（属性），组件接受外部数据的方式
    - props是父组件传递给子组件的数据 **Props = 组件的"输入参数"**
    - 类似函数的参数：组件接受props，用他们来渲染界面

```javascript
// 子组件：接收 props text color参数 onClick交互   
function Button({ text, color, onClick }) {
  return (
    <button style={{ color: color }} onClick={onClick}>
      {text}
    </button>
  );
}

// 父组件：用于传递 props  ---> 组件类似一个盒子，props就是我放进盒子的东西，盒子根据放入不同的东西显示不同的内容
function App() {
  return (
    <div>
      <Button text="确定" color="blue" onClick={() => alert('点击了')} />  //处理点击事件（交互逻辑之类）
      <Button text="取消" color="red" onClick={() => console.log('取消成功')} />
    </div>
  );
}
```

``` javascript
Props可以是任何类型
// 字符串
<Button text="确定" />

// 数字
<Counter count={10} />

// 布尔值
<Modal visible={true} />

// 对象
<UserInfo user={{ name: "张三", age: 20 }} />

// 数组
<ItemList items={[1, 2, 3]} />

// 函数
<Button onClick={() => alert('点击')} />
```
### 总结：props 的本质
 1. 数据传递的桥梁：有父组件到子组件
 2. 组件的输入：告诉组件要显示什么
 3. 一个对象：包含了所以传入的属性
 4. 单向的：只能又父到子
 
 ***核心作用***
  - 让组件变得可复用
  - 传入不同的参数，显示不同的内容

