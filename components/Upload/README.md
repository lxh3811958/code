## 兼容 ie9 上传组件

ie9 不支持 ajax 异步上传，使用隐藏的 iframe 加载 form 标签，用 form
表单的方式来实现文件上传。

## 使用示例

默认选中文件后不自动上传，通过 ref 调用组件 upload 方法可控上传

```js
import Upload from "@/Upload";

const Test = ({ accountId }) => {
  const uploadRef = useRef(null);

  // 点击按钮上传文件
  const onUpload = async () => {
    uploadRef.current.upload();
  };

  const uploadProps = {
    accept: ".xlsx,.xls",
    url: importExcelUrl,
    params: { accountToken: accountId },
    // autoUpload: true, // 选择文件后自动上传文件
    onChange: e => {
      // 选择文件，可获取到选中文件数据
      setFile(e.target.files[0]);
    },
    onEnd: res => {
      // 上传失败
      if (!res) return;

      message.success("批量导入成功");
      dispatch({ type: "getList" });
      hideModal();
    }
  };

  return (
    <Upload {...uploadProps} ref={uploadRef}>
      <div styleName="upload-wrap">
        {file ? (
          <div styleName="file-info">
            <span styleName="excel" />
            {file.name}
            <a
              href="javascript:;"
              onClick={e => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              <Icon styleName="close" type="close" />
            </a>
          </div>
        ) : (
          <>
            <div styleName="add">
              <Icon type="plus-circle" /> 添加文件
            </div>
            <p styleName="info">支持扩展名：.xls、.xlsx格式文件</p>
          </>
        )}
      </div>
    </Upload>
  );
};
```

大体用法同 antd Upload，默认点击图标较小，需自定义

> 基础上传组件，需自定义图标或其他元素作为组件 children，点击可选择文件

## 上传业务组件

```js
const uploadProps = {
    url: importDailyData,
    params: { accountPeriod, subjectId },
    onChange,
    onEnd,
    autoUpload: true,
  };
  return (
    <CommonUpload
      ref={uploadRef}
      noTopText
      uploadProps={uploadProps}
      download={{
        url: downExcelTemplateUrl,
      }}
      fileName={(file && file.name) || ''}
      onDeleteFile={() => setFile(null)}
      bottomText={
        <span>
          支持 20M 内拓展名为.xls、.xlsx、.csv的文件
          <br />
          或使用
          <a href="null" className="a-link" onClick={onDownTemplate}>
            现金流水通用模板.xlsx
          </a>
        </span>
      }
    />
```
