const formatUrl = (url, data) => {
  const _url = url + (url.indexOf("?") === -1 ? "?" : "&");
  let ret = "";
  if (typeof data === "string") {
    ret = data;
  } else if (typeof data === "object") {
    for (const key in data) {
      ret += `&${key}=${encodeURIComponent(data[key])}`;
    }
  }
  ret = ret.substr(1);
  return _url + ret;
};

const removeElem = elem => {
  const parent = elem.parentNode;
  if (parent && parent.nodeType !== 11) {
    parent.removeChild(elem);
  }
};

const jsonp = (config = {}) => {
  const { data, url, callback } = config;
  // 拼接请求Url
  let name = `id_${new Date().getTime()}_${Math.random()
    .toString()
    .substr(2)}`;

  const srcUrl = formatUrl(url, {
    data,
    callback: name
  });

  // 插入Script标签
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = srcUrl;
  script.id = name;

  // CallBack 放到 window 对象，调用后销毁
  window[name] = json => {
    // 执行这个函数后，要销毁这个函数
    window[name] = undefined;
    // 获取这个script的元素
    const elem = document.getElementById(name);
    // 删除head里面插入的script，这三步都是为了不影响污染整个DOM啊
    removeElem(elem);
    // 执行传入的的函数
    callback && typeof callback === "function" && callback(json);
  };

  const head = document.getElementsByTagName("head");
  if (head && head[0]) {
    head[0].appendChild(script);
  }
};

export default jsonp;
