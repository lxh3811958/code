import { Form, Input } from 'antd';
import React from 'react';
import moment from 'moment';

const FormItem = Form.Item;

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef(null);
    this.td = React.createRef(null);
  }

  componentDidMount() {
    this.setFocus();
  }

  componentDidUpdate() {
    this.setFocus();
  }

  setFocus = () => {
    if (this.isEditing && this.editable && this.input) {
      this.input.current && this.input.current.focus();
    }
  };

  toggleEdit = () => {
    const { dataIndex, record, eventProps, idName } = this.props;
    // 点击 select row
    if (!record) {
      return;
    }

    let newActiveTd = {};
    if (this.isEditing) {
      return;
    }

    newActiveTd = {
      id: record[idName],
      dataIndex,
    };

    setTimeout(() => {
      eventProps.setActiveTd(newActiveTd);
    }, 0);
  };

  save = (cb) => {
    const { record, eventProps } = this.props;
    if (!record) return;

    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }

      // 临时保存数据
      const key = Object.keys(values);
      if (record[key] !== values[key]) {
        eventProps.onTdChange({ ...record, ...values }, values);
        // 标记为已改变
        eventProps.setIsChange(true);
      }
      cb && cb();
    });
  };

  // td onBlur，用于点击同行不同 td 时保存编辑中 td 的数据
  onBlur = () => {
    const { activeTd, eventProps } = this.props;

    this.save(() => {
      eventProps.setActiveTd({ id: '', dataIndex: '' });
      eventProps.setPrevTd(activeTd);
    });
  };

  onKeyDown = (e) => {
    const { eventProps } = this.props;
    // enter 时自动切换下一单元格
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault && e.preventDefault();
      this.save();
      eventProps.toNextTd();
    }
  };

  render() {
    const {
      activeTd,
      title,
      dispatch,
      isEnableEdit,
      dataIndex,
      record,
      Context,
      index,
      editRender,
      // 输入值最大长度
      maxlength,
      required,
      idName, // 行 id
      eventProps,
      isShowDelete,
      isShowAdd,
      isEditTr,
      inputType,
      ...restProps
    } = this.props;

    this.editable = isEnableEdit;
    this.isEditing =
      record &&
      activeTd &&
      activeTd.id === record[idName] &&
      activeTd.dataIndex === dataIndex;

    const editEleProps = {
      ref: this.input,
      onBlur: this.onBlur,
    };

    const EditElement = editRender ? (
      editRender(editEleProps)
    ) : (
      <Input className="input" {...editEleProps} autoComplete="off" />
    );

    const maxRule = maxlength
      ? {
          max: maxlength,
          message: `最大长度为${maxlength}`,
        }
      : null;

    const requiredRule = required
      ? { required, message: `${title}不可为空` }
      : {};

    const rules = [];
    if (maxlength) {
      rules.push(maxRule);
    }
    if (required) {
      rules.push(requiredRule);
    }

    return (
      <td
        {...restProps}
        // onBlur={this.onBlur} // 在 td 处理了 onBlur 是防止按回车键无法正常处理 input 的onBlur
        onMouseDown={this.toggleEdit}
        onKeyDown={this.onKeyDown}
        ref={this.td}
      >
        {this.editable ? (
          <Context.Consumer>
            {(form) => {
              this.form = form;
              return this.isEditing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    initialValue:
                      inputType === 'date'
                        ? moment(record[dataIndex])
                        : record[dataIndex],
                    rules,
                  })(EditElement)}
                </FormItem>
              ) : (
                <div className="text-wrap">{restProps.children} </div>
              );
            }}
          </Context.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

export default EditableCell;
