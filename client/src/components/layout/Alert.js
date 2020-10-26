import React from 'react';
import { useSelector } from 'react-redux';

function Alert() {
  const alerts = useSelector((state) => state.alerts);
  return alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
}

export default Alert;
