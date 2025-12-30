import React from 'react';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import Notification from './Notification';

const NotificationContainer: React.FC = () => {
  const { state, dispatch } = useGlobalState();

  const handleClose = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  if (state.notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
      {state.notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;