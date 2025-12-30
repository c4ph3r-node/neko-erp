import React from 'react';
import { Menu, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import UserMenu from '../UI/UserMenu';
import NotificationDropdown from '../UI/NotificationDropdown';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { state } = useGlobalState();

  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions, customers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-96"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown unreadCount={unreadCount} />

          {user && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}