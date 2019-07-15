import { Table, Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import EditableCell from './EditableCell';
import EditableFormRow, { EditableContext } from './EditableFormRow';
import SuperTable from '@/SuperTable';
import './style.less';

class EditableTable extends React.Component {
  state = {
    // 是否编辑过数据，未编辑时不保存
    isChange: false,
    activeTd: { id: '', dataIndex: '' },
    prevTd: { id: '', dataIndex: '' },
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onBlurTable, false);
  }

  setActiveTd = (value) => this.setState({ activeTd: value });

  setPrevTd = (value) => this.setState({ prevTd: value });
  // 当前编辑中的 td
  // 上一个编辑过的 td，切换到下一个 td 时根据需要保存上一个 tr 的数据

  onBlurTable = ({ ignoreIdEqual }) => {
    setTimeout(() => {
      const { activeTd, prevTd, isChange } = this.state;
      const { onSaveTr, dataSource, idName } = this.props;
      const currentId = activeTd.id;
      const prevId = prevTd.id;

      if (!prevId) return;

      // 点击空白处或其他编辑行
      const isNotEqualId = ignoreIdEqual || currentId !== prevId;
      if (prevId && (!currentId || isNotEqualId) && isChange) {
        const record = dataSource.filter((item) => item[idName] === prevId)[0];

        onSaveTr(record);
        this.setIsChange(false);
      }
      // 保存一次数据，清空上一次数据
      this.setPrevTd({ id: '', dataIndex: '' });
    }, 100);
  };

  setIsChange = (value) => this.setState({ isChange: value });

  // 获取当前行中可编辑的列字段
  getEditDataIndex = (trIndex) => {
    const { columns, enableEditTr, dataSource } = this.props;
    // 可编辑列字段
    const editableTdIndex = [];
    columns.forEach((col) => {
      // 个别列虽然定义了可编辑，但在某一行中可能在判断回调函数中禁止了编辑，需要排除
      let isEdit = !enableEditTr;

      if (enableEditTr) {
        isEdit = enableEditTr(dataSource[trIndex], trIndex, col.dataIndex);
      }

      if (col.editable && isEdit) {
        editableTdIndex.push(col.dataIndex);
      }
    });

    return editableTdIndex;
  };

  // 移动到下一个 td
  toNextTd = () => {
    const { dataSource, idName } = this.props;
    const { activeTd } = this.state;
    let newActiveTd = {};

    // 当前编辑中的列 index
    const currentTrIndex = dataSource.findIndex(
      (item) => item[idName] === activeTd.id,
    );

    // columns 中定义的可以编辑的列字段
    const editableTdIndex = this.getEditDataIndex(currentTrIndex);

    // 当前编辑中的 td 字段
    const tdIndex = editableTdIndex.findIndex(
      (item) => item === activeTd.dataIndex,
    );

    const maxTdIndex = editableTdIndex.length - 1;

    // 编辑行在一行内移动
    if (tdIndex < maxTdIndex) {
      // const newTdDataIndex = editableTdIndex[tdIndex + 1];
      // const record = dataSource.find((item) => item[idName] === activeTd.id);
      // const isEditTd = enableEditTr(record, i, newTdDataIndex);

      newActiveTd = {
        dataIndex: editableTdIndex[tdIndex + 1],
        id: activeTd.id,
      };

      // 临时保存数据
      this.setPrevTd(activeTd);
      this.setActiveTd(newActiveTd);
    } else {
      // 激活下一行时，需要保存数据到服务器
      newActiveTd = {
        dataIndex: editableTdIndex[0],
        id: dataSource[currentTrIndex + 1]
          ? dataSource[currentTrIndex + 1][idName]
          : '',
      };

      this.setPrevTd(activeTd);
      this.setActiveTd(newActiveTd);
      setTimeout(() => {
        this.onBlurTable({ ignoreIdEqual: true });
      }, 0);
    }
  };

  testFuncOrStr = (prop, record, i) => {
    if (!prop) return false;
    if (typeof prop === 'function') {
      return prop(record, i);
    }
    return prop;
  };

  compoenentWillUnmount() {
    document.removeEventListener('mouseup', this.onBlurTable, false);
  }

  render() {
    const {
      columns,
      idName,
      dataSource,
      onTdChange,
      onSaveTr,
      onDeleteTr,
      onAddTr,
      enableEditTr,
      showDeleteIcon,
      showAddIcon,
      className,
      setActiveTd: customSetTd, // 外部接口设置编辑 td
      isBigData,
      ...tableProps
    } = this.props;

    if (!idName) {
      console.error(
        '请注意：idName 为可编辑表格必须属性，一般设置为 dataSource 数据唯一 id 或其他每行不重复字段',
      );
    }

    const { activeTd } = this.state;

    const eventProps = {
      toNextTd: this.toNextTd,
      setActiveTd: this.setActiveTd,
      onTdChange,
      onSaveTr,
      enableEditTr,
      setPrevTd: this.setPrevTd,
      setIsChange: this.setIsChange,
    };

    const newColumns = columns.map((col, index) => {
      return {
        ...col,
        onCell: (record, i) => {
          const isEnableEdit =
            (enableEditTr ? enableEditTr(record, i, col.dataIndex) : true) &&
            col.editable;
          return {
            record, // 表格行数据
            isEnableEdit,
            dataIndex: col.dataIndex,
            title: col.title,
            inputType: col.inputType,
            editRender: col.editRender,
            maxlength: col.maxlength || col.maxLength, // 编辑允许最大长度
            required: col.required, // 是否必填
            eventProps,
            Context: EditableContext,
            index,
            idName,
            activeTd,
          };
        },
      };
    });
    // SuperTable 处理 删除、新增 icon，暂用 calc，有问题替换
    const columnsRes = [
      {
        type: 'pre',
        width: 20,
        dataIndex: 'delete',
        className: 'table-cell-pre',
        align: 'center',
        render: (text, record, i) => {
          const isShowDelete = this.testFuncOrStr(showDeleteIcon, record, i);
          const isShowAdd = this.testFuncOrStr(showAddIcon, record, i);

          return (
            <>
              {(isShowDelete || isShowAdd) && (
                <span className="table-cell-toggle">
                  {isShowAdd && (
                    <a
                      href="javascript:void(0)"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        // 大数据渲染情况 i 并不是真实 index
                        onAddTr(record);
                      }}
                    >
                      <Icon type="plus-circle" />
                    </a>
                  )}
                  {isShowDelete && (
                    <a
                      href="javascript:void(0)"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDeleteTr(record);
                      }}
                    >
                      <Icon type="close-circle" />
                    </a>
                  )}
                </span>
              )}
            </>
          );
        },
      },
      ...newColumns,
    ];

    const TableComponent = isBigData ? SuperTable : Table;

    return (
      <TableComponent
        components={{
          body: {
            row: EditableFormRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        {...tableProps}
        className={`edit-table-blq-xjf ${className || ''}`}
        columns={columnsRes}
      />
    );
  }
}

EditableTable.defaultProps = {
  onTdChange: () => {}, // 单元格数据保存
  onSaveTr: () => {}, // 单元格数据保存
  onDeleteTr: () => {}, // 单元格数据保存
  showDeleteIcon: false, // 是否显示行首删除 icon，return true 显示，默认为false
  showAddIcon: false, // 是否显示行首删除 icon，return true 显示，默认为false
  setActiveTd: () => {}, // 设置编辑状态的单元格
  // enableEditTr: true,
  isBigData: true, // 是否支持大数据渲染优化
};
EditableTable.propTypes = {
  idName: PropTypes.string.isRequired,
  isBigData: PropTypes.bool,
  onTdChange: PropTypes.func, // 单元格数据保存
  onSaveTr: PropTypes.func, // 单元格数据保存
  onDeleteTr: PropTypes.func, // 单元格数据保存
  // 是否显示行首删除 icon，return true 显示，默认为false
  showDeleteIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  // 是否显示行首删除 icon，return true 显示，默认为false
  showAddIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  setActiveTd: PropTypes.func, // 设置编辑状态的单元格
  // enableEditTr: PropTypes.func, //
};

export default EditableTable;
