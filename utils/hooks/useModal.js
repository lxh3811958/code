import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const useModal = (_props = {}) => {
  const [visible, setVisible] = useState(_props.visible || false);
  const [props, setProps] = useState(_props);

  const hide = () => setVisible(false);
  const show = (newProps) => {
    setVisible(true);
    setProps(newProps);
  };

  const SModal = (componentProps) => {
    const allProps = componentProps.children ? componentProps : props;

    if (allProps.onCancel) {
      prallPropsps.onCancel = () => {
        allProps.onCancel();
        hide();
      };
    }

    return (
      <Modal destroyOnClose visible={visible} onCancel={hide} {...allProps}>
        {allProps.children || allProps.content}
      </Modal>
    );
  };

  return [show, hide, SModal];
};

useModal.propTypes = {};

export default useModal;
