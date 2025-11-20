
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Ticket, Package, Settings, LifeBuoy, LogOut, FileText, Map, Box, Compass } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'PORTAL' as ViewState, label: '导航门户', icon: Compass },
    { id: 'DASHBOARD' as ViewState, label: '仪表盘', icon: LayoutDashboard },
    { id: 'ROADMAP' as ViewState, label: '版本全景', icon: Map },
    { id: 'TICKETS' as ViewState, label: '工单管理', icon: Ticket },
    { id: 'OUTBOUND' as ViewState, label: '产品出库', icon: Box },
    { id: 'PRODUCTS' as ViewState, label: '产品目录', icon: Package },
    { id: 'DOCUMENTS' as ViewState, label: '文档中心', icon: FileText },
    { id: 'SETTINGS' as ViewState, label: '系统设置', icon: Settings },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Nexus ITSM</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <LifeBuoy className="w-5 h-5" />
          <span className="font-medium text-sm">帮助中心</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-4 pt-4 border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AC</div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium truncate">Alex Chen</div>
            <div className="text-xs text-slate-500 truncate">Admin</div>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
};
