## 功能简介

-   简介

antd 的 Select 组件不支持大数据量的下拉列表渲染，下拉列表数量太多会出现性能问题，
SuperSelect 基于 antd 封装实现，替换原组件下拉列表，只渲染几十条列表数据，随下拉列表滚动动态刷新可视区列表状态，实现大数据量列表高性能渲染。

-   特性

1. 基于 antd Select 组件，不修改组件用法
2. 替换 antd Select 组件的下拉列表部分实现动态渲染列表

## [在线地址](https://codesandbox.io/s/88vznl9lm2)

## 使用

基本使用同 antd Select，只是使用 SuperSelect 代替 Select

```js
import SuperSelect from 'components/SuperSelect';
import { Select } from 'antd';
const Option = Select.Option;

const Example = () => {
    const children = [];

    for (let i = 0; i < 100000; i++) {
        children.push(
            <Option value={i + ''} key={i}>
                {i}
            </Option>
        );
    }

    return (
        <SuperSelect
            showSearch
            // mode="multiple"
            // onChange={onChange}
            // onSearch={onSearch}
            // onSelect={onSelect}
        >
            {children}
        </SuperSelect>
    );
};
```

## 问题

-   多选模式选择后鼠标点击输入框中删除等图标时不能直接 hover 时获取焦点直接删除，需要点击两次
-   重写的下拉菜单没有 isSelectOption（rc-select 源码判断下拉列表元素）属性，控制台会有 warning 提示下拉列表元素不符合 Select 组件要求
