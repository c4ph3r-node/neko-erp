import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, Settings, Trash2 } from 'lucide-react';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  unreadCount: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ unreadCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, markNotificationRead, markAllNotificationsRead, clearAllNotifications } = useGlobalState();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'financial': return '💰';
      case 'compliance': return '📋';
      case 'workflow': return '⚙️';
      case 'user': return '👤';
      case 'system': return '🔧';
      default: return '📢';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </button>
                )}
                {state.notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              state.notifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-white'
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-lg">{getCategoryIcon(notification.category)}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(new Date(notification.timestamp))}
                            </span>
                            {notification.priority && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                notification.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {notification.priority}
                              </span>
                            )}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          {notification.actionLabel && (
                            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                              {notification.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Remove notification
                          // This would need to be added to context
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Notification Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;