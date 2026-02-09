const variantMap = {
  success: 'alert-success',
  error: 'alert-danger',
  info: 'alert-info'
};

const AlertMessage = ({ type = 'info', message }) => {
  if (!message) return null;

  return (
    <div className={`alert ${variantMap[type] || 'alert-info'} mb-3`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;
