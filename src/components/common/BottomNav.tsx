import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { Home, Calendar, CheckSquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cycle', label: 'Cycle', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: CheckSquare },
    { id: 'me', label: 'Me', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EFEAE6] pb-[env(safe-area-inset-bottom,6px)] shadow-xs font-sans">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-14 px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all focus-visible:outline-none ${
                isActive ? 'text-[#2C2428]' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-all duration-150 ${
                  isActive ? 'bg-[#FAF5F2]' : ''
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'stroke-[2.2] text-[#B5838D]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'font-bold text-[#2C2428]' : 'font-medium text-[#A69A9F]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
