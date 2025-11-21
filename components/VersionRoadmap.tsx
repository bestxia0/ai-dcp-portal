
import React, { useState, useMemo, useEffect } from 'react';
import { ProductVersion, VersionStatus, VersionType } from '../types';
import { 
  Plus, Edit2, Search, Filter, Calendar, User, Tag, Layers, 
  CheckCircle2, AlertCircle, Archive, X, Save, ArrowRight,
  ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';

interface VersionRoadmapProps {
  versions: ProductVersion[];
  onUpdateVersions: (versions: ProductVersion[]) => void;
}

export const VersionRoadmap: React.FC<VersionRoadmapProps> = ({ versions, onUpdateVersions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<Partial<ProductVersion>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // -- Helper functions --

  const getStatusColor = (status: VersionStatus) => {
    switch(status) {
      case 'RELEASED': return 'bg-green-100 text-green-800 border-green-200';
      case 'DEVELOPING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PLANNING': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'UAT_READY': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'UAT_VERIFYING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELIVERED': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'ARCHIVED': return 'bg-gray-200 text-gray-600 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadge = (type: VersionType) => {
    if (type === 'STANDARD') return <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs">标准版本</span>;
    if (type === 'CUSTOMIZED') return <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100 text-xs">客户定制</span>;
    return <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 text-xs">Hotfix</span>;
  };

  const handleEdit = (v: ProductVersion) => {
    setCurrentVersion({ ...v });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentVersion({
      id: `v${Date.now()}`,
      productName: '基础组件',
      version: '',
      name: '',
      type: 'STANDARD',
      status: 'PLANNING',
      progress: 0,
      features: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      plannedUATDate: '',
      productManager: '',
      versionAdmin: '',
      customers: [],
      isReadyForDelivery: false,
      isArchived: false,
      isDelayed: false
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVersion.id || !currentVersion.version) return;
    
    const newVersion = currentVersion as ProductVersion;
    const existingIndex = versions.findIndex(v => v.id === newVersion.id);
    
    if (existingIndex >= 0) {
      const updated = [...versions];
      updated[existingIndex] = newVersion;
      onUpdateVersions(updated);
    } else {
      onUpdateVersions([...versions, newVersion]);
    }
    setIsModalOpen(false);
  };

  // Filtering Logic
  const filteredVersions = useMemo(() => {
    return versions.filter(v => {
      if (!showArchived && v.isArchived) return false;
      return (
        v.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.version.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [versions, showArchived, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, showArchived]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredVersions.length / PAGE_SIZE);
  const paginatedVersions = filteredVersions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Gantt Chart Logic
  const { ganttMonths, ganttStart, ganttEnd } = useMemo(() => {
    const today = new Date();
    // Start: 1 month ago (1st day)
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    // End: 3 months later (Last day)
    const end = new Date(today.getFullYear(), today.getMonth() + 4, 0);
    
    const months = [];
    let current = new Date(start);
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return { ganttMonths: months, ganttStart: start, ganttEnd: end };
  }, []);

  const getGanttBarPosition = (v: ProductVersion) => {
    const start = new Date(v.startDate).getTime();
    const end = new Date(v.endDate).getTime();
    const windowStart = ganttStart.getTime();
    const windowEnd = ganttEnd.getTime();
    const totalDuration = windowEnd - windowStart;

    // Check if visible in window
    if (end < windowStart || start > windowEnd) return null;

    let left = ((start - windowStart) / totalDuration) * 100;
    let width = ((end - start) / totalDuration) * 100;

    // Clip logic
    if (left < 0) {
      width += left;
      left = 0;
    }
    if (left + width > 100) {
      width = 100 - left;
    }
    
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-indigo-600 w-6 h-6" /> 全生命周期版本看板
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            管理产品从规划、研发、UAT验证到交付的全过程版本状态。
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 mr-4">
             <input 
               type="checkbox" 
               id="showArchived"
               checked={showArchived}
               onChange={(e) => setShowArchived(e.target.checked)}
               className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
             />
             <label htmlFor="showArchived" className="text-sm text-slate-600 cursor-pointer">显示已归档</label>
           </div>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="搜索版本号或产品..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
             />
           </div>
           <button 
             onClick={handleAdd}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
           >
             <Plus className="w-4 h-4" /> 新增版本
           </button>
        </div>
      </div>

      {/* Gantt Chart View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
           <Calendar className="w-5 h-5 text-indigo-500" />
           <h3 className="font-bold text-slate-800">版本计划全景图 (近5个月)</h3>
        </div>
        
        <div className="relative w-full overflow-x-auto min-h-[150px]">
           {/* Timeline Header */}
           <div className="flex border-b border-slate-200 pb-2 text-sm text-slate-500">
              <div className="w-40 shrink-0 font-bold text-slate-800 pl-2">产品/版本</div>
              <div className="flex-1 flex relative">
                 {ganttMonths.map((date, index) => (
                   <div key={index} className="flex-1 text-center border-l border-dashed border-slate-100 first:border-none">
                     {date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })}
                   </div>
                 ))}
              </div>
           </div>

           {/* Gantt Rows - Using Filtered Data */}
           <div className="space-y-3 mt-3 relative">
              {/* Vertical Grid Lines */}
              <div className="absolute left-40 right-0 top-0 bottom-0 flex pointer-events-none">
                 {ganttMonths.map((_, index) => (
                   <div key={index} className="flex-1 border-l border-dashed border-slate-100 first:border-none h-full"></div>
                 ))}
              </div>

              {filteredVersions.slice(0, 15).map(v => {
                const pos = getGanttBarPosition(v);
                return (
                  <div key={v.id} className="flex items-center relative z-0 h-8 group">
                     <div className="w-40 shrink-0 pr-4 flex flex-col justify-center">
                        <span className="text-xs font-bold text-slate-700 truncate" title={v.productName}>{v.productName}</span>
                        <span className="text-[10px] text-slate-500 truncate font-mono">{v.version}</span>
                     </div>
                     <div className="flex-1 relative h-full">
                        {pos && (
                          <div 
                            className={`absolute top-1.5 h-5 rounded shadow-sm text-white text-[10px] flex items-center px-2 whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity ${
                              v.status === 'RELEASED' ? 'bg-green-500' :
                              v.status === 'DEVELOPING' ? 'bg-blue-500' :
                              v.status === 'DELIVERED' ? 'bg-teal-600' :
                              'bg-indigo-400'
                            }`}
                            style={pos}
                            onClick={() => handleEdit(v)}
                            title={`${v.version}: ${v.startDate} ~ ${v.endDate}`}
                          >
                            <span className="truncate">{v.name || v.version}</span>
                          </div>
                        )}
                     </div>
                  </div>
                );
              })}
              {filteredVersions.length === 0 && (
                <div className="text-center text-slate-400 py-4 text-sm">暂无匹配版本数据</div>
              )}
           </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                <th className="p-4 sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-32">产品名称</th>
                <th className="p-4 sticky left-32 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-32">*版本号</th>
                <th className="p-4 w-40">版本名称</th>
                <th className="p-4 w-24">*版本类型</th>
                <th className="p-4 w-24">*版本状态</th>
                <th className="p-4 w-20">进度</th>
                <th className="p-4 w-64">*版本特性</th>
                <th className="p-4 w-32">*计划UAT时间</th>
                <th className="p-4 w-32">*实际UAT时间</th>
                <th className="p-4 w-32">*产品经理</th>
                <th className="p-4 w-32">UAT测试人员</th>
                <th className="p-4 w-32">具备交付?</th>
                <th className="p-4 w-32">交付客户</th>
                <th className="p-4 w-40">异常说明</th>
                <th className="p-4 w-24 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedVersions.map((v) => (
                <tr key={v.id} className={`hover:bg-slate-50 transition-colors group ${v.isArchived ? 'opacity-60 bg-slate-50/50' : ''}`}>
                  <td className="p-4 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-100 font-medium text-slate-800">
                    {v.productName}
                  </td>
                  <td className="p-4 sticky left-32 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-100 font-mono text-indigo-600 font-bold">
                    {v.version}
                  </td>
                  <td className="p-4 text-slate-600">{v.name}</td>
                  <td className="p-4">{getTypeBadge(v.type)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                    {v.isDelayed && <span className="ml-2 text-xs text-red-500 font-bold">延期</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${v.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{v.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className="truncate max-w-xs" title={v.features}>{v.features}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600">{v.plannedUATDate}</td>
                  <td className="p-4 font-mono text-xs text-slate-600">{v.actualUATDate || '-'}</td>
                  <td className="p-4 flex items-center gap-1">
                     <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                       {v.productManager.charAt(0)}
                     </div>
                     {v.productManager}
                  </td>
                  <td className="p-4 text-slate-600">{v.uatTester || '-'}</td>
                  <td className="p-4">
                    {v.isReadyForDelivery ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> YES</span>
                    ) : (
                      <span className="text-slate-400 text-xs">NO</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {v.customers?.slice(0,2).map(c => (
                         <span key={c} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] border border-slate-200">{c}</span>
                      ))}
                      {(v.customers?.length || 0) > 2 && <span className="text-xs text-slate-400">...</span>}
                    </div>
                  </td>
                  <td className="p-4 text-red-500 text-xs truncate max-w-[150px]" title={v.exceptionNote}>
                    {v.exceptionNote}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleEdit(v)}
                      className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedVersions.length === 0 && (
                <tr><td colSpan={15} className="p-8 text-center text-slate-400">没有找到相关数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
           <div className="text-xs text-slate-500">
              显示 {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredVersions.length)} 到 {Math.min(currentPage * PAGE_SIZE, filteredVersions.length)} 条，共 {filteredVersions.length} 条
           </div>
           <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                 <button
                   key={p}
                   onClick={() => setCurrentPage(p)}
                   className={`w-7 h-7 rounded text-xs font-medium ${currentPage === p ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                 >
                   {p}
                 </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
           </div>
        </div>

      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {currentVersion.id ? '编辑版本计划' : '新建版本计划'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-8">
              
              {/* 1. Basic Info */}
              <section>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Tag className="w-4 h-4" /> 基础信息
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*产品名称</label>
                    <input 
                      type="text" required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.productName || ''}
                      onChange={e => setCurrentVersion({...currentVersion, productName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*版本号</label>
                    <input 
                      type="text" required placeholder="v1.0.0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.version || ''}
                      onChange={e => setCurrentVersion({...currentVersion, version: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">版本名称</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.name || ''}
                      onChange={e => setCurrentVersion({...currentVersion, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*版本类型</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      value={currentVersion.type}
                      onChange={e => setCurrentVersion({...currentVersion, type: e.target.value as VersionType})}
                    >
                      <option value="STANDARD">标准版本</option>
                      <option value="CUSTOMIZED">客户定制</option>
                      <option value="HOTFIX">Hotfix</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">依赖其他产品版本</label>
                    <input 
                      type="text" placeholder="e.g. 基础组件 v2.0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.dependencies || ''}
                      onChange={e => setCurrentVersion({...currentVersion, dependencies: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">*版本特性</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      value={currentVersion.features || ''}
                      onChange={e => setCurrentVersion({...currentVersion, features: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              {/* 2. Schedule & Environment */}
              <section>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Calendar className="w-4 h-4" /> 计划与环境
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*开始时间</label>
                    <input 
                      type="date" required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.startDate || ''}
                      onChange={e => setCurrentVersion({...currentVersion, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*结束时间</label>
                    <input 
                      type="date" required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.endDate || ''}
                      onChange={e => setCurrentVersion({...currentVersion, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*计划UAT时间</label>
                    <input 
                      type="date" required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.plannedUATDate || ''}
                      onChange={e => setCurrentVersion({...currentVersion, plannedUATDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">实际UAT时间</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.actualUATDate || ''}
                      onChange={e => setCurrentVersion({...currentVersion, actualUATDate: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">交付项目现场时间</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.deliveryDate || ''}
                      onChange={e => setCurrentVersion({...currentVersion, deliveryDate: e.target.value})}
                    />
                  </div>
                   <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">*验证环境要求</label>
                    <input 
                      type="text" placeholder="e.g. Linux, Docker, Oracle"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.envRequirements || ''}
                      onChange={e => setCurrentVersion({...currentVersion, envRequirements: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-4">
                     <label className="block text-sm font-medium text-slate-700 mb-1">*交付客户 (逗号分隔)</label>
                     <input 
                      type="text" placeholder="Customer A, Customer B..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.customers?.join(', ') || ''}
                      onChange={e => setCurrentVersion({...currentVersion, customers: e.target.value.split(',').map(s => s.trim())})}
                    />
                  </div>
                </div>
              </section>

              {/* 3. People & Roles */}
              <section>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4" /> 人员与角色
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*产品经理</label>
                    <input 
                      type="text" required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.productManager || ''}
                      onChange={e => setCurrentVersion({...currentVersion, productManager: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*版本管理员</label>
                    <input 
                      type="text" required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.versionAdmin || ''}
                      onChange={e => setCurrentVersion({...currentVersion, versionAdmin: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">UAT测试人员</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.uatTester || ''}
                      onChange={e => setCurrentVersion({...currentVersion, uatTester: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">UAT部署人员</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.uatDeployer || ''}
                      onChange={e => setCurrentVersion({...currentVersion, uatDeployer: e.target.value})}
                    />
                  </div>
                </div>
              </section>

               {/* 4. Status & Flags */}
              <section>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4" /> 状态与控制
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">*版本状态</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      value={currentVersion.status}
                      onChange={e => setCurrentVersion({...currentVersion, status: e.target.value as VersionStatus})}
                    >
                      <option value="PLANNING">PLANNING (规划中)</option>
                      <option value="DEVELOPING">DEVELOPING (研发中)</option>
                      <option value="UAT_READY">UAT_READY (待UAT)</option>
                      <option value="UAT_VERIFYING">UAT_VERIFYING (验证中)</option>
                      <option value="RELEASED">RELEASED (已发布)</option>
                      <option value="DELIVERED">DELIVERED (已交付)</option>
                      <option value="ARCHIVED">ARCHIVED (已归档)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">总体进度 (%)</label>
                    <input 
                      type="number" min="0" max="100"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={currentVersion.progress || 0}
                      onChange={e => setCurrentVersion({...currentVersion, progress: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-6 mt-2">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        checked={currentVersion.isReadyForDelivery || false}
                        onChange={e => setCurrentVersion({...currentVersion, isReadyForDelivery: e.target.checked})}
                       />
                       <span className="text-sm font-medium text-slate-700">版本可具备交付状态</span>
                     </label>

                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        checked={currentVersion.isDelayed || false}
                        onChange={e => setCurrentVersion({...currentVersion, isDelayed: e.target.checked})}
                       />
                       <span className="text-sm font-medium text-slate-700">是否延迟</span>
                     </label>

                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        checked={currentVersion.isArchived || false}
                        onChange={e => setCurrentVersion({...currentVersion, isArchived: e.target.checked})}
                       />
                       <span className="text-sm font-medium text-slate-700">版本归档</span>
                     </label>
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">异常说明 / 备注</label>
                     <textarea 
                       rows={2}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                       value={currentVersion.exceptionNote || ''}
                       onChange={e => setCurrentVersion({...currentVersion, exceptionNote: e.target.value})}
                     />
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                 <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                 >
                   取消
                 </button>
                 <button 
                   type="submit"
                   className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                 >
                   <Save className="w-4 h-4" /> 保存版本计划
                 </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
