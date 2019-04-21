import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastNotification } from 'carbon-components-react';

import { removeToast } from './appState/actions';

import './Toaster.scss';

const Toaster = ({ removeToast, toasts }) => {
  const toastNotifications = toasts.map(toast => (
    <ToastNotification
      caption=""
      className="toaster__toast"
      key={toast.id}
      onCloseButtonClick={() => removeToast(toast.id)}
      timeout={toast.kind === 'success' ? 10000 : undefined}
      {...toast}
    />
  ));

  return <div className="toaster">{toastNotifications}</div>;
};

Toaster.propTypes = {
  removeToast: PropTypes.func.isRequired,
  toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(
  store => ({
    toasts: store.toaster.toasts,
  }),
  dispatch => ({
    removeToast: id => dispatch(removeToast(id)),
  })
)(Toaster);
