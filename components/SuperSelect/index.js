import React, { PureComponent, Fragment } from 'react';
import { Select } from 'antd';

// 页面实际渲染的下拉菜单数量，实际为 2 * ITEM_ELEMENT_NUMBER
const ITEM_ELEMENT_NUMBER = 20;
// Select size 配置
const ITEM_HEIGHT_CFG = {
  small: 24,
  large: 40,
  default: 32,
};

class Wrap extends PureComponent {
  state = {
    list: this.props.list,
    allHeight: this.props.allHeight,
  };

  reactList = (list, allHeight) => this.setState({ list, allHeight });

  render() {
    const { list } = this.state;
    const { notFoundContent } = this.props;
    // 搜索下拉列表为空时显示 no data
    const noDataEle = (
      <li
        role="option"
        unselectable="on"
        className="ant-select-dropdown-menu-item ant-select-dropdown-menu-item-disabled"
        aria-disabled="true"
        aria-selected="false"
      >
        <div className="ant-empty ant-empty-normal ant-empty-small">
          <div className="ant-empty-image">
            <img
              alt="No Data"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA2NCA0MSIgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"
            />
          </div>
          <p className="ant-empty-description">{notFoundContent || '没有匹配到数据'}</p>
        </div>
      </li>
    );
    return (
      <div style={{ overflow: 'hidden', height: this.state.allHeight }}>
        <ul
          role="listbox"
          className="ant-select-dropdown-menu  ant-select-dropdown-menu-root ant-select-dropdown-menu-vertical"
          style={{
            height: this.state.allHeight,
            maxHeight: this.state.allHeight,
            overflow: 'hidden',
          }}
          tabIndex="0"
        >
          {list.length > 0 ? list : noDataEle}
        </ul>
      </div>
    );
  }
}

export default class SuperSelect extends PureComponent {
  constructor(props) {
    super(props);

    const { mode, defaultValue, value } = props;
    this.isMultiple = ['tags', 'multiple'].includes(mode);

    // 设置默认 value
    let defaultV = this.isMultiple ? [] : '';
    defaultV = value || defaultValue || defaultV;

    this.state = {
      children: props.children || [],
      filterChildren: null,
      value: defaultV,
    };
    // 下拉菜单项行高
    this.ITEM_HEIGHT = ITEM_HEIGHT_CFG[props.size || 'default'];
    // 可视区 dom 高度
    this.visibleDomHeight = this.ITEM_HEIGHT * ITEM_ELEMENT_NUMBER;
    // 滚动时重新渲染的 scrollTop 判断值，大于 reactDelta 则刷新下拉列表
    this.reactDelta = (this.visibleDomHeight * 2) / 3;
    // 是否拖动滚动条快速滚动状态
    this.isStopReact = false;
    // 上一次滚动的 scrollTop 值
    this.prevScrollTop = 0;

    this.scrollTop = 0;
  }

  componentDidUpdate(prevProps, prevStates) {
    const { mode, defaultValue, value } = this.props;
    if (prevProps.children !== this.props.children) {
      this.isMultiple = ['tags', 'multiple'].includes(mode);

      this.setState({
        children: this.props.children || [],
        filterChildren: null,
      });
    }
    if (prevProps.value !== this.props.value) {
      // 更新时设置默认 value
      let defaultV = this.isMultiple ? [] : '';
      defaultV = value || defaultValue || defaultV;

      this.setState({
        value: defaultV,
      });
    }
  }

  getItemStyle = (i) => ({
    position: 'absolute',
    top: this.ITEM_HEIGHT * i,
    width: '100%',
    height: this.ITEM_HEIGHT,
  });

  addEvent = () => {
    this.scrollEle = document.querySelector('.my-select');
    // 下拉菜单未展开时元素不存在
    if (!this.scrollEle) return;
    this.scrollEle.addEventListener('scroll', this.onScroll, false);
  };

  onScroll = () => this.throttleByHeight(this.onScrollReal);

  onScrollReal = () => {
    this.allList = this.getUseChildrenList();
    this.showList = this.getVisibleOptions();

    this.prevScrollTop = this.scrollTop;
    // 重新渲染列表组件 Wrap
    const allHeight = this.allList.length * this.ITEM_HEIGHT || 100;
    this.wrap.reactList(this.showList, allHeight);
  };

  throttleByHeight = () => {
    this.scrollTop = this.scrollEle.scrollTop;
    // 滚动的高度
    let delta = this.prevScrollTop - this.scrollTop;
    delta = delta < 0 ? 0 - delta : delta;

    // TODO: 边界条件优化， 滚动约 2/3 可视区 dom 高度时刷新 dom
    delta > this.reactDelta && this.onScrollReal();
  };

  // 列表可展示所有 children
  getUseChildrenList = () => this.state.filterChildren || this.state.children;

  getStartAndEndIndex = () => {
    // 滚动后显示在列表可视区中的第一个 item 的 index
    const showIndex = Number((this.scrollTop / this.ITEM_HEIGHT).toFixed(0));

    const startIndex =
      showIndex - ITEM_ELEMENT_NUMBER < 0 ? 0 : showIndex - ITEM_ELEMENT_NUMBER / 2;
    const endIndex = showIndex + ITEM_ELEMENT_NUMBER;
    return { startIndex, endIndex };
  };

  getVisibleList = () => {
    // 搜索时使用过滤后的列表
    const { startIndex, endIndex } = this.getStartAndEndIndex();
    // 渲染的 list
    return this.allList.slice(startIndex, endIndex);
  };

  getVisibleOptions = () => {
    const visibleList = this.getVisibleList();
    const { startIndex } = this.getStartAndEndIndex();

    // 显示中的列表元素添加相对定位样式
    return visibleList.map((item, i) => {
      const props = { ...item.props };
      const text = props.children;

      const realIndex = startIndex + Number(i);
      const key = props.key || realIndex;

      const { value } = this.state;
      const valiValue = text || props.value;

      const isSelected = value && value.includes ? value.includes(valiValue) : value == valiValue;

      const classes = `ant-select-dropdown-menu-item ${
        isSelected ? 'ant-select-dropdown-menu-item-selected' : ''
      }`;
      // antd 原素，下拉列表项右侧 √ icon
      const selectIcon = (
        <i aria-label="icon: check" className="anticon anticon-check ant-select-selected-icon">
          <svg
            viewBox="64 64 896 896"
            className=""
            data-icon="check"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
          </svg>
        </i>
      );

      props._childrentext = text;
      return (
        <li
          className={classes}
          key={key}
          onMouseDown={() => this.onClick(props, item)}
          {...props}
          style={this.getItemStyle(realIndex)}
        >
          {text}
          {/* 多选项选中状态 √ 图标 */}
          {this.isMultiple ? selectIcon : null}
        </li>
      );
    });
  };

  render() {
    let { children, dropdownStyle, optionLabelProp, notFoundContent, ...props } = this.props;

    this.allList = this.getUseChildrenList();
    this.showList = this.getVisibleOptions();

    const allHeight = this.allList.length * this.ITEM_HEIGHT || 100;

    dropdownStyle = {
      maxHeight: '250px',
      ...dropdownStyle,
      overflow: 'auto',
      position: 'relative',
    };

    const { value } = this.state;
    // 判断处于 antd Form 中时不自动设置 value
    const _props = { ...props };
    // 先删除 value，再手动赋值，防止空 value 影响 placeholder
    delete _props.value;

    // value 为空字符会隐藏 placeholder，改为 undefined
    if (!this.props['data-__field']) {
      if (typeof value === 'string' && !value) {
        _props.value = undefined;
      } else {
        _props.value = value;
      }
    }

    // 设置显示在输入框的文本，替换 children 为自定义 childrentext,默认 children 会包含 √ icon
    optionLabelProp = optionLabelProp || '_childrentext';
    optionLabelProp = optionLabelProp === 'children' ? '_childrentext' : optionLabelProp;

    console.log(1);
    console.log(this.showList);

    return (
      <Select
        {..._props}
        onSearch={this.onSearch}
        onChange={this.onChange}
        onSelect={this.onSelect}
        dropdownClassName="my-select"
        optionLabelProp={optionLabelProp}
        dropdownStyle={dropdownStyle}
        onDropdownVisibleChange={this.setSuperDrowDownMenu}
        ref={(ele) => (this.select = ele)}
        // onMouseEnter={() => this.select.focus()}
        dropdownRender={(menu) => (
          <Fragment>
            <Wrap
              ref={(ele) => (this.wrap = ele)}
              allHeight={allHeight}
              list={this.showList}
              notFoundContent={notFoundContent}
            />
          </Fragment>
        )}
      >
        {this.showList}
      </Select>
    );
  }

  // 须使用 setTimeout 确保在 dom 加载完成之后添加事件
  setSuperDrowDownMenu = () => {
    this.allList = this.getUseChildrenList();
    this.allList = this.getUseChildrenList();

    if (!this.eventTimer) {
      this.eventTimer = setTimeout(() => this.addEvent(), 0);
    } else {
      const allHeight = this.allList.length * this.ITEM_HEIGHT || 100;
      // 下拉列表单独重新渲染
      this.wrap && this.wrap.reactList(this.showList, allHeight);
    }
  };

  /**
   * 替换了 antd Select 的下拉列表，手动实现下拉列表项的点击事件，
   * 绑定原组件的各项事件回调
   * itemProps: li react 元素的 props
   * item: li 元素
   */
  onClick = (itemProps, item) => {
    const { value } = itemProps;
    const { onDeselect } = this.props;

    let newValue = this.state.value || [];
    let option = item;

    // 多选
    if (this.isMultiple) {
      newValue = [...newValue];
      // 点击选中项取消选中操作
      if (newValue.includes(value)) {
        newValue = newValue.filter((i) => i !== value);
        onDeselect && onDeselect(value, item);
      } else {
        newValue.push(value);
      }
      // 获取原 onChange 函数第二个参数 options，react 元素数组
      option = this.state.children.filter((i) => newValue.includes(i.props.value));
    } else {
      newValue = value;
    }

    // 多选模式点击选择后下拉框持续显示
    this.isMultiple && this.focusSelect();

    this.onChange(newValue, option);
    this.onSelect(newValue, option);
  };

  // 非 antd select 定义元素点击后会失去焦点，手动再次获取焦点防止多选时自动关闭
  focusSelect = () => setTimeout(() => this.select.focus(), 0);

  // 绑定 onSelect 事件
  onSelect = (v, opt) => {
    const { onSelect } = this.props;
    onSelect && onSelect(v, opt);
  };

  onChange = (value, opt) => {
    // 删除选中项时保持展开下拉列表状态
    if (Array.isArray(value) && value.length < this.state.value.length) {
      this.focusSelect();
    }

    const { showSearch, onChange, autoClearSearchValue } = this.props;
    if (showSearch || this.isMultiple) {
      // 搜索模式下选择后是否需要重置搜索状态
      if (autoClearSearchValue !== false) {
        this.setState({ filterChildren: null }, () => {
          // 搜索成功后重新设置列表的总高度
          this.setSuperDrowDownMenu();
        });
      }
    }

    this.setState({ value });
    onChange && onChange(value, opt);
  };

  onSearch = (v) => {
    const { showSearch, onSearch, filterOption, children } = this.props;

    if (showSearch && filterOption !== false) {
      // 须根据 filterOption（如有该自定义函数）手动 filter 搜索匹配的列表
      let filterChildren = null;
      if (typeof filterOption === 'function') {
        filterChildren = children.filter((item) => filterOption(v, item));
      } else if (filterOption === undefined) {
        filterChildren = children.filter((item) => this.filterOption(v, item));
      }

      // 设置下拉列表显示数据
      this.setState({ filterChildren: v === '' ? null : filterChildren }, () => {
        // 搜索成功后需要重新设置列表的总高度
        this.setSuperDrowDownMenu();
      });
    }
    onSearch && onSearch(v);
  };

  filterOption = (v, option) => {
    // 自定义过滤对应的 option 属性配置
    const filterProps = this.props.optionFilterProp || 'value';
    return `${option.props[filterProps]}`.indexOf(v) >= 0;
  };

  componentWillUnmount() {
    this.removeEvent();
  }

  removeEvent = () => {
    if (!this.scrollEle) return;
    this.scrollEle.removeEventListener('scroll', this.onScroll, false);
  };
}
