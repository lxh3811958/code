// 精确四舍五入
export const preciseFixed = (num, prec = 2) => {
  let res = +num || 0;
  const abs = Math.abs(res);
  res = +(Math.round(`${abs}e+${prec}`) + `e-${prec}`) * (num >= 0 || -1);

  return res == 0 ? "" : res.toFixed(prec);
};

// 金额数字添加千分符
export const thousandFix = v => {
  return `${v}`.replace(/\B(?=(\d{3})+(?=\b))(?<=\b(?<!\.)\d*)/g, ",");
};

// 移除千分符、
export const thousandRemove = v => `${v}`.replace(/(,*)/g, "");

// 全角数字、符号转换半角
export const formatSBC = val => {
  const MAP = {
    "０": "0",
    "１": "1",
    "２": "2",
    "３": "3",
    "４": "4",
    "５": "5",
    "６": "6",
    "７": "7",
    "８": "8",
    "９": "9",
    "．": ".",
    "。": ".",
    "＋": "+",
    "－": "-",
    "＊": "*",
    "×": "*",
    "、": "/",
    "／": "/",
    "＝": "="
  };
  return val.replace(new RegExp(Object.keys(MAP).join("|"), "g"), v => map[v]);
};

/**
 * 数字格式化
 * @param {(number|string)} v - 需要处理的值
 * @param {Object} option object - 参数选项
 * @param {Object} option.precision - 小数精度位数
 * @param {Object} option.maxDigit - 可输入的最大位数
 * @param {Object} option.enableMinus - 是否允许负数
 * @returns {string} value
 */
export const numberFormat = (
  v,
  option = { precision: 2, maxDigit: 9, enableMinus: false }
) => {
  const { precision, maxDigit, enableMinus } = option;

  const reg = enableMinus ? /(?!^-)[^.|\d]/g : /[^.|\d]/g;
  // 全角转换为半角，去掉除多余的 “-”
  let r = formatSBC(`${v}`).replace(reg, "");
  // 格式化 '00.' 类似连续 0 开头输入
  r = r.replace(/(0)(0*)(.*)/g, "$1$3");
  // 数字格式化，整数取前 maxDigit 位，小数取 precision 位
  return r.replace(
    new RegExp(`(-?\\d{0,${maxDigit}})(\\d*)(\\.?)(\\d{0,${precision}})(.*)`),
    "$1$3$4"
  );
};
