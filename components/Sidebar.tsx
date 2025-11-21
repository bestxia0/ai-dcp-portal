import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Ticket, Package, Settings, LifeBuoy, FileText, Map, Box, Compass, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-slate-900 text-white flex flex-col sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0`}
    >
      {/* Logo & Toggle */}
      <div className="p-4 h-16 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex-shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight truncate">数字构建产品工作台</span>
          </div>
        )}
        {isCollapsed && (
           <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-xs">DCP</span>
              </div>
           </div>
        )}
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapsed Toggle Button (when closed) */}
      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-slate-800">
           <button 
            onClick={() => setIsCollapsed(false)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : ''}`} />
            {!isCollapsed && (
              <span className="font-medium text-sm truncate">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer (Simplified Help) */}
      <div className="p-3 border-t border-slate-800">
        <button 
          title={isCollapsed ? '帮助中心' : ''}
          className={`w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LifeBuoy className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">帮助中心</span>}
        </button>
      </div>
    </div>
  );
};