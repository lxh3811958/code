import { Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import EditableCell from './EditableCell';
import EditableFormRow, { EditableContext } from './EditableFormRow';
// import SuperTable from '@/SuperTable';
import './style.less';

const useEditableTable = () => {
  // 是否编辑过数据，未编辑时不保存
  const [isChange, setIsChange] = useState(false);
  // 当前编辑中的 td
  const [activeTd, setActiveTd] = useState({ id: '', dataIndex: '' });
  // 上一个编辑过的 td，切换到下一个 td 时根据需要保存上一个 tr 的数据
  const [prevTd, setPrevTd] = useState({ id: '', dataIndex: '' });

  const useTable = (props) => {
    const {
      columns,
      optionRow,
      idName,
      dataSource,
      onTdChange,
      onSaveTr,
      onDeleteTr,
      showDeleteIcon,
      setActiveTd: customSetTd, // 外部接口设置编辑 td
      ...tableProps
    } = props;

    const latestActiveTd = useRef(activeTd);
    latestActiveTd.current = activeTd;

    const latestPrevId = useRef(prevTd);
    latestPrevId.current = prevTd;

    const latestIsChange = useRef(isChange);
    latestIsChange.current = isChange;

    const onBlurTable = ({ ignoreIdEqual }) => {
      const currentId = latestActiveTd.current.id;
      const prevId = latestPrevId.current.id;

      if (!prevId) return;

      // 点击空白处或其他编辑行
      const isNotEqualId = ignoreIdEqual || currentId !== prevId;

      if (prevId && (!currentId || isNotEqualId) && latestIsChange.current) {
        onSaveTr(latestPrevId.current);
        setIsChange(false);
      }
      // 保存一次数据，清空上一次数据
      setPrevTd({ id: '', dataIndex: '' });
    };

    useEffect(() => {
      document.addEventListener('mouseup', onBlurTable, false);
      return () => {
        document.removeEventListener('mouseup', onBlurTable, false);
      };
    }, []);

    // 可编辑列字段
    const editableTdIndex = [];
    columns.forEach((col) => {
      if (col.editable) {
        editableTdIndex.push(col.dataIndex);
      }
    });

    // 移动到下一个 td
    const toNextTd = () => {
      let newActiveTd = {};

      const tdIndex = editableTdIndex.findIndex((item) => item === activeTd.dataIndex);
      const maxTdIndex = editableTdIndex.length - 1;

      // 编辑行在一行内移动
      if (tdIndex < maxTdIndex) {
        newActiveTd = {
          dataIndex: editableTdIndex[tdIndex + 1],
          id: activeTd.id,
        };
        // 临时保存数据
        setPrevTd(activeTd);
        setActiveTd(newActiveTd);
      } else {
        // 激活下一行时，需要保存数据到服务器
        const currentTrIndex = dataSource.findIndex((item) => item[idName] === activeTd.id);
        newActiveTd = {
          dataIndex: editableTdIndex[0],
          id: dataSource[currentTrIndex + 1] ? dataSource[currentTrIndex + 1][idName] : '',
        };

        setPrevTd(activeTd);
        setActiveTd(newActiveTd);
        setTimeout(() => {
          onBlurTable({ ignoreIdEqual: true });
        }, 0);
      }
    };

    const eventProps = {
      toNextTd,
      setActiveTd,
      onTdChange,
      onSaveTr,
      setPrevTd,
      onDeleteTr,
      setIsChange,
    };

    const newColumns = columns.map((col, index) => {
      return {
        ...col,
        onCell: (record) => {
          const isShowDelete = showDeleteIcon ? showDeleteIcon(record) : false;

          return {
            record, // 表格行数据
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            editRender: col.editRender,
            maxlength: col.maxlength, // 编辑允许最大长度
            eventProps,
            Context: EditableContext,
            index,
            idName,
            activeTd,
            isShowDelete: isShowDelete && index === 0,
          };
        },
      };
    });

    return (
      <Table
        components={{
          body: {
            row: EditableFormRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        {...tableProps}
        className="edit-table-blq-xjf"
        columns={newColumns}
      />
    );
  };

  return [useTable, setActiveTd];
};

useEditableTable.propTypes = {
  idName: PropTypes.string.isRequired,
  onTdChange: PropTypes.func.isRequired, // 单元格数据保存
  onSaveTr: PropTypes.func.isRequired, // 单元格数据保存
  onDeleteTr: PropTypes.func, // 单元格数据保存
  showDeleteIcon: PropTypes.func, // 是否显示行首删除 icon，return true 显示，默认为false
  setActiveTd: PropTypes.func, // 设置编辑状态的单元格
};
export default useEditableTable;
