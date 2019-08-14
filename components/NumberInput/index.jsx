import React from "react";
import { InputNumber } from "antd";
import * as util from "utils";
import PropTypes from "prop-types";

const DEFAULT_MAX_DIGIT = 9;
const DEFAULT_PREC = 2;

const NumberInput = React.forwardRef(
  ({ thousand, precision, min, max, ...props }, ref) => {
    // 正则判断最大位数
    const maxDigit = max
      ? `${max}`.replace(/(\d*)\.(\d*)/g, "$1").length
      : DEFAULT_MAX_DIGIT;
    const minusDigit =
      min && min < 0
        ? `${min}`.replace(/-(\d*)\.(\d*)/g, "$1").length
        : DEFAULT_MAX_DIGIT;
    let enableMinus = true;

    if ((min || min === 0) && min >= 0) {
      enableMinus = false;
    }

    const getOption = v => ({
      precision: precision || DEFAULT_PREC,
      maxDigit: enableMinus && Number(v) < min ? minusDigit : maxDigit,
      enableMinus
    });

    const formatValue = v => {
      let value = util.numberFormat(v, getOption(v));

      if (Number(value) < min) {
        value = min;
      }
      if (Number(value) > max) {
        value = max;
      }
      return value;
    };

    const formatter = v => {
      const value = formatValue(v);

      // 添加千分符
      if (thousand) {
        return util.thousandFix(value);
      }
      return value;
    };

    const parser = v => {
      const value = formatValue(v);
      if (thousand) {
        return util.thousandRemove(value);
      }
      return value;
    };

    return (
      <InputNumber ref={ref} {...props} formatter={formatter} parser={parser} />
    );
  }
);

NumberInput.defaultProps = {
  thousand: false
};

NumberInput.propTypes = {
  thousand: PropTypes.bool
};

export default NumberInput;
