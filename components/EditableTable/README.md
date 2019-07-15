## 路径

> 具体请查看文档

`components/EditableTable2`

## 功能

基于 antd Table 实现表格编辑功能

1. 支持表格单元格（下文简称 td）编辑，点击 td 显示输入框或其他自定义编辑组件
2. 选中编辑 td 时按 Enter 或 Tab 键切换到下一个单元格，行位可换行
3. 默认换行后调用 onSaveTr 保存上一行编辑数据
4. 自动验证是否修改行内容，未修改不保存数据
5. 从父组件修改或设置默认选中编辑 td
6. 可选行首删除或新增 icon 及对应回调函数
7. 自定义控制行、单元格是否可编辑
8. 支持大数据渲染
9. 提前支持后续需求功能（🌹）

## 用法

```js
import EditableTable from "@/EditableTable2";
// 设置默认选中行
this.table.setActiveTd({ id: 1, dataIndex: "name" });

<EditableTable
  ref={ele => (this.table = ele)}
  bordered
  size="middle"
  pagination={false}
  dataSource={ruleTableData}
  columns={columns}
  rowKey={(record, i) => record.aliasRuleId || i}
  idName="aliasRuleId"
  onTdChange={this.onTdChange}
  onSaveTr={this.onSaveTr}
  onDeleteTr={this.onDeleteTr}
  showDeleteIcon={record => {
    // 设置可删除行
    return record.aliasRuleId !== -1;
  }}
  enableEditTr={(record, i) => {
    // 设置第 1 行不可编辑
    return i !== 0;
  }}
/>;
```

## api

| 名称           | 类型   | 描述                                   | 参数            |
| -------------- | ------ | -------------------------------------- | --------------- |
| onTdChange     | func   | td blur 时触发                         | (record)        |
| onSaveTr       | func   | 点击空白处或换行编辑时触发             | (record)        |
| onDeleteTr     | func   | 点击行首删除 icon 时触发               | (record)        |
| onAddTr        | func   | 点击行首删除 icon 时触发               | (record)        |
| showDeleteIcon | func   | 计算 record，返回 true 则显示删除 icon | (record)        |
| showAddIcon    | func   | 计算 record，返回 true 则显示删除 icon | (record)        |
| enableEditTr   | func   | 计算 record，返回 true 则行可编辑      | (record, index) |
| idName         | string | 行 id，用于定位编辑行                  |                 |

> record 表示列表数据选中行对象，同 antd

## ref 调用子组件方法

| 名称         | 描述                  | 参数                                      |
| ------------ | --------------------- | ----------------------------------------- |
| setActiveTd  | 设置编辑状态 td，     | 默认 setActiveTd({id: '', dataIndex: ''}) |
| activeNextTr | 编辑下一行第一个 td， | 默认 setActiveTd()                        |
| activeLastTr | 编辑下一行第一个 td， | 默认 setActiveTd()                        |

> id: 行 id，dataIndex: columns dataIndex

## columns 自定义可编辑行、列

```js
const columns = [
  {
    title: "单位换算",
    width: 160,
    dataIndex: "convertQuantity",
    align: "right",
    maxlength: 100, // Input 允许输入最大长度
    editable: true, // 是否可编辑
    // 原 antd render，td 非编辑状态显示内容
    render: text => (Number(text) || 0).toFixed(4),
    // 编辑 td 时 td 内部编辑元素，默认 Input，可自定义 antd Form 识别元素，如 Select
    editRender: props => {
      // props 必须作为自定义组件的 props，添加相关事件
      return (
        <InputNumber
          {...props}
          className="input number"
          autoComplete="off"
          precision={4}
          min={0}
          max={9.9999}
        />
      );
    }
  }
];
```

> 扩展新增 `editable`, `maxlength`, `editRender`, 均为可选
> table 熟悉 scroll 不可用，可控制 table 父元素最大高度来限制表格高度
