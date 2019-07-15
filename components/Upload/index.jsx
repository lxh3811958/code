import React from 'react';
import PropTypes from 'prop-types';
import { message, Icon } from 'antd';
import { request, util } from 'nuijs';

const accountToken = util.getParam('id', `/${location.search}`);

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.form = React.createRef(null);
    this.input = React.createRef(null);
    this.iframe = React.createRef(null);

    this.state = {
      files: null,
    };
  }

  componentDidMount() {
    this.initIframe();
  }

  initIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.display = 'none';
    iframe.name = 'form-iframe';
    document.body.appendChild(iframe);
    // 改变form的target
    this.form.current.target = 'form-iframe';
    const thisCom = this;

    iframe.onload = function() {
      // 获取iframe的内容，即服务返回的数据
      let res =
        this.contentDocument.body.textContent ||
        this.contentWindow.document.body.textContent;
      try {
        res = JSON.parse(res);
      } catch (error) {}

      thisCom.solveRes(res);
    };
  };

  solveRes = (res) => {
    const { onEnd } = this.props;
    if (!res || res.status != '200') {
      message.error((res && res.message) || '上传文件出错');
      onEnd(null);
      return;
    }

    onEnd(res);
  };

  // 父组件中通过 this.uploadRef.upload() 手动上传
  upload = () => {
    const { files } = this.state;
    if (!files || files.length === 0) {
      message.error('请先选择需要上传的文件');
      return;
    }
    this.form.current.submit();
  };

  onClick = () => {
    this.input.current.click();
  };

  onChange = (e) => {
    const { onChange, autoUpload } = this.props;
    const { files } = e.target;

    onChange(e);
    this.setState({ files }, () => {
      autoUpload && files && this.upload();
    });
  };

  render() {
    const { url, accept, params, children } = this.props;
    const rightUrl = `${request.config('preurl')(url) + url}.do`;

    const inputProps = {};
    if (accept) {
      inputProps.accept = accept;
    }

    params.accountToken = accountToken;

    const inputStyle = {
      opacity: 0,
      position: 'fixed',
      zIndex: -1,
      top: -99990,
      right: -99990,
      visibility: 'hidden',
    };

    return (
      <div onClick={this.onClick} className="upload-ie9-s">
        <form
          ref={this.form}
          action={rightUrl}
          method="post"
          encType="multipart/form-data"
        >
          <input
            {...inputProps}
            onChange={this.onChange}
            ref={this.input}
            type="file"
            name="file"
            style={inputStyle}
          />
          {params &&
            Object.entries(params).map((item) => {
              return (
                <input
                  type="text"
                  readOnly
                  style={inputStyle}
                  name={item[0]}
                  value={item[1]}
                  key={item[0]}
                />
              );
            })}
        </form>
        {children || (
          <div className="add">
            <Icon type="plus-circle" /> 添加文件
          </div>
        )}
      </div>
    );
  }
}

Upload.defaultProps = {
  onChange: () => {},
  autoUpload: false,
  onEnd: () => {},
};

Upload.propTypes = {
  autoUpload: PropTypes.bool, // 选择文件后是否自动上传
  onChange: PropTypes.func, // 选择文件回调
  accept: PropTypes.string, // 文件格式
  url: PropTypes.string.isRequired, // url 简写，不含 .do 和 pre
  params: PropTypes.objectOf(PropTypes.string), // 请求参数
  onEnd: PropTypes.func, // 上传结束回调，参数为请求 response
};

export default Upload;
