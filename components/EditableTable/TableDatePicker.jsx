/**
 * 可编辑表格中根据编辑元素的 onBlur 时间来定位编辑 td，antd 默认 datePicker 的 onBlur 无法满足需求
 * 包装 DatePicker 组件，自定义 onBlur 和 focus 方法
 * 1. 实现 onFocus 自动打开弹框
//  * 2. 只在关闭弹窗时触发 onBlur
 * 3. 只用于 EditableTable 的 editRender 中
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker } from 'antd';

const dateFormat = 'YYYY-MM-DD';

class TableDatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.rootRef = React.createRef(null);
    this.datePicker = React.createRef(null);
  }

  componentDidMount() {
    this.setFocus();

    // 初始化时自动展开下拉列表
    document.querySelector('.date-picker-blq-xxs input').click();
    document.addEventListener('click', this.onBlur, false);
  }

  shouldComponentUpdate(nextProps) {
    const { value } = this.props;
    if (
      moment(value).format(dateFormat) !==
      moment(nextProps.value).format(dateFormat)
    ) {
      return true;
    }
  }

  //   componentDidUpdate(prevProps) {
  //     const { value } = this.props;
  //     if (
  //       moment(value).format(dateFormat) !=
  //       moment(prevProps.value).format(dateFormat)
  //     ) {
  //     }
  //   }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBlur, false);
  }

  onCurChange = (v) => {
    const { onChange } = this.props;

    this.setState({ value: v });
    onChange && onChange(v);
  };

  setFocus = () => this.datePicker.current.focus();

  // 添加自定义 focus
  focus = () => {};

  onBlur = () => {
    const { onBlur } = this.props;
    const selectEle = document.querySelector(
      '.date-picker-blq-xxs .ant-calendar-picker-container',
    );

    if (!selectEle && onBlur) {
      onBlur();
    }
  };

  // 弹窗关闭时自动 blur 保存数据
  onOpenChange = (isOpen) => {
    const { onBlur } = this.props;
    // if (!isOpen) {
    //   onBlur && onBlur();
    // }
  };

  render() {
    const { disabledDate } = this.props;

    const dateProps = {};
    if (disabledDate) dateProps.disabledDate = disabledDate;

    return (
      <div className="date-picker-blq-xxs" ref={this.rootRef}>
        <DatePicker
          allowClear={false}
          {...dateProps}
          getCalendarContainer={(node) => node}
          onChange={this.onCurChange}
          onOpenChange={this.onOpenChange}
          ref={this.datePicker}
          value={this.state.value}
        />
      </div>
    );
  }
}

TableDatePicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default TableDatePicker;
