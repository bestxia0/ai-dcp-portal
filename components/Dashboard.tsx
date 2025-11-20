import React, { useState } from 'react';
import { Ticket, Product, TicketPriority, TicketStatus, ProductVersion, Release, Document, DocumentCategory } from '../types';
import { 
  Clock, AlertCircle, CheckCircle2, Activity, Rocket, Download, 
  ListFilter, FileText, Plus, ExternalLink, Edit2, Trash2, X, Save,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
  products: Product[];
  versions: ProductVersion[];
  releases: Release[];
  documents: Document[];
  onUpdateVersions: (versions: ProductVersion[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  tickets, 
  products, 
  versions, 
  releases, 
  documents,
  onUpdateVersions
}) => {
  
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<ProductVersion | null>(null);
  
  // Calculate stats
  const criticalTickets = tickets.filter(t => t.priority === TicketPriority.CRITICAL).length;
  const weekReleases = releases.length; // Mock calculation
  const docUpdates = documents.length; 
  const currentVersion = versions.find(v => v.status === 'DEVELOPING') || versions[0];

  // --- Helper functions for Gantt Chart ---
  const getTimelineStyles = (version: ProductVersion) => {
    // Simply mapping dates to % for demo purposes
    // Assuming a fixed window from Oct 1st to Jan 31st (4 months ~ 120 days)
    const timelineStart = new Date('2023-10-01').getTime();
    const timelineEnd = new Date('2024-01-31').getTime();
    const totalDuration = timelineEnd - timelineStart;

    const vStart = new Date(version.startDate).getTime();
    const vEnd = new Date(version.endDate).getTime();

    let left = ((vStart - timelineStart) / totalDuration) * 100;
    let width = ((vEnd - vStart) / totalDuration) * 100;

    // Clamp values
    if (left < 0) { width += left; left = 0; }
    if (width + left > 100) { width = 100 - left; }

    return { left: `${left}%`, width: `${width}%` };
  };

  const handleDeleteVersion = (id: string) => {
    if(confirm('Are you sure you want to delete this version plan?')) {
      onUpdateVersions(versions.filter(v => v.id !== id));
    }
  };

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVersion) return;

    const exists = versions.find(v => v.id === editingVersion.id);
    if (exists) {
      onUpdateVersions(versions.map(v => v.id === editingVersion.id ? editingVersion : v));
    } else {
      onUpdateVersions([...versions, editingVersion]);
    }
    setIsVersionModalOpen(false);
    setEditingVersion(null);
  };

  const openNewVersionModal = () => {
    // Initialize with all required fields to satisfy ProductVersion interface
    setEditingVersion({
      id: `v${Date.now()}`,
      productName: 'New Product',
      version: 'v1.0.0',
      name: 'New Version Plan',
      type: 'STANDARD',
      features: 'To be defined',
      status: 'PLANNING',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      plannedUATDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      productManager: 'TBD',
      versionAdmin: 'TBD',
      isReadyForDelivery: false,
      isArchived: false,
      isDelayed: false
    });
    setIsVersionModalOpen(true);
  };

  const openEditVersionModal = (v: ProductVersion) => {
    setEditingVersion({...v});
    setIsVersionModalOpen(true);
  };

  const getDocIconColor = (cat: DocumentCategory) => {
    switch(cat) {
      case DocumentCategory.MARKET: return 'bg-blue-100 text-blue-600';
      case DocumentCategory.DELIVERY: return 'bg-green-100 text-green-600';
      case DocumentCategory.OPS: return 'bg-orange-100 text-orange-600';
      default: return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4"></div>
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider z-10">当前版本 {currentVersion?.version}</span>
          <div className="mt-2 flex items-end justify-between z-10">
            <span className="text-2xl font-bold text-slate-800">{currentVersion?.status}</span>
            <span className="text-sm text-orange-500 font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" /> 剩余 5 天
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 z-10">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${currentVersion?.progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">待修复严重 Bug</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-red-600">{criticalTickets}</span>
            <span className="text-sm text-slate-400">个 Blocker</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">较昨日新增 +1</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">本周发布</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-800">{weekReleases}</span>
            <span className="text-sm text-slate-400">次 Hotfix</span>
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
             <CheckCircle2 className="w-3 h-3" /> 线上运行稳定
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">文档更新</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-600">{docUpdates}</span>
            <span className="text-sm text-slate-400">篇</span>
          </div>
          <div className="mt-2 flex -space-x-2">
             <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
             <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
             <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] text-slate-500">+3</div>
          </div>
        </div>
      </div>

      {/* 2. Roadmap / Gantt Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-blue-500 w-5 h-5" /> 版本计划路线图 (Roadmap)
          </h2>
          <div className="flex items-center gap-3">
             <div className="flex gap-2">
                <span className="px-3 py-1 text-xs rounded bg-slate-100 text-slate-600">Q3 2023</span>
                <span className="px-3 py-1 text-xs rounded bg-blue-50 text-blue-600 font-medium border border-blue-100">Q4 2023</span>
             </div>
             <button 
                onClick={openNewVersionModal}
                className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition flex items-center gap-1"
             >
               <Edit2 className="w-3 h-3" /> 管理版本
             </button>
          </div>
        </div>

        <div className="relative w-full overflow-x-hidden">
          {/* Timeline Header */}
          <div className="flex border-b border-slate-200 pb-2 mb-4 text-sm text-slate-500">
            <div className="w-1/4 text-center border-r border-dashed border-slate-200">10月 (Oct)</div>
            <div className="w-1/4 text-center border-r border-dashed border-slate-200">11月 (Nov)</div>
            <div className="w-1/4 text-center border-r border-dashed border-slate-200">12月 (Dec)</div>
            <div className="w-1/4 text-center">1月 (Jan)</div>
          </div>

          {/* Tracks */}
          <div className="space-y-6 relative min-h-[120px]">
             {/* Vertical Grid Lines */}
             <div className="absolute inset-0 flex pointer-events-none h-full">
                <div className="w-1/4 border-r border-dashed border-slate-100"></div>
                <div className="w-1/4 border-r border-dashed border-slate-100"></div>
                <div className="w-1/4 border-r border-dashed border-slate-100"></div>
             </div>

             {versions.map((v) => {
                const style = getTimelineStyles(v);
                let barColor = 'bg-indigo-400';
                if (v.status === 'RELEASED') barColor = 'bg-green-500';
                if (v.status === 'DEVELOPING') barColor = 'bg-blue-500';

                return (
                  <div key={v.id} className="flex items-center relative z-0 group">
                    <div className="w-24 text-sm font-bold text-slate-700 shrink-0">{v.version}</div>
                    <div className="flex-1 h-8 bg-slate-50 rounded relative overflow-hidden">
                       <div 
                          className={`absolute top-1 h-6 rounded shadow-sm flex items-center px-3 text-white text-xs whitespace-nowrap cursor-pointer transition-all hover:opacity-90 ${barColor} ${v.status === 'DEVELOPING' ? 'animate-pulse' : ''}`}
                          style={style}
                          onClick={() => openEditVersionModal(v)}
                          title={`${v.version}: ${v.startDate} to ${v.endDate}`}
                       >
                         <span className="truncate">{v.status === 'RELEASED' ? '已发布' : v.status === 'DEVELOPING' ? '开发中' : '规划中'} ({v.progress}%)</span>
                       </div>
                    </div>
                    <button onClick={() => openEditVersionModal(v)} className="ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity">
                       <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* 3. Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Recent Releases */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Rocket className="text-purple-500 w-5 h-5" /> 最近发布 (Release Notes)
              </h3>
              <a href="#" className="text-xs text-blue-600 hover:underline">查看全部</a>
            </div>
            
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
               {releases.map((release) => (
                 <div key={release.id} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${release.type === 'Hotfix' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-bold text-slate-800">{release.version}</span>
                        <span className="ml-2 text-xs text-slate-500">{release.date}</span>
                      </div>
                      <button className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 flex items-center gap-1">
                        <Download className="w-3 h-3" /> 下载
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 font-medium">{release.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{release.description}</p>
                    <div className="mt-2 flex gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        release.type === 'Hotfix' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {release.type}
                      </span>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Version List Table */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ListFilter className="text-slate-500 w-5 h-5" /> 版本状态清单
                </h3>
             </div>
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                   <tr>
                      <th className="px-3 py-2 rounded-l">版本</th>
                      <th className="px-3 py-2">状态</th>
                      <th className="px-3 py-2">进度</th>
                      <th className="px-3 py-2 rounded-r">操作</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {versions.map((v) => (
                     <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-3 py-3 font-medium">{v.version}</td>
                       <td>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                           v.status === 'RELEASED' ? 'bg-green-100 text-green-800' : 
                           v.status === 'DEVELOPING' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                         }`}>
                           {v.status}
                         </span>
                       </td>
                       <td className="px-3 py-3">
                         <div className="w-20 bg-slate-200 rounded-full h-1.5">
                           <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: `${v.progress}%`}}></div>
                         </div>
                       </td>
                       <td className="px-3 py-3 text-blue-600 cursor-pointer hover:underline" onClick={() => openEditVersionModal(v)}>编辑</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
           
           {/* Key Issues */}
           <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle className="text-red-500 w-5 h-5" /> 关键 Issues (Top 3)
                  </h3>
                  <button className="text-xs text-slate-500 hover:text-blue-600">View All</button>
              </div>
              <div className="space-y-3">
                 {tickets.slice(0, 3).map((ticket) => (
                   <div key={ticket.id} className={`flex items-start p-3 rounded-lg border transition cursor-pointer ${
                     ticket.priority === TicketPriority.CRITICAL ? 'border-red-100 bg-red-50/30' : 'border-slate-100 hover:bg-slate-50'
                   }`}>
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        ticket.priority === TicketPriority.CRITICAL ? 'bg-red-500' : 'bg-orange-400'
                      }`}></span>
                      <div className="ml-3 flex-1">
                         <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-900 line-clamp-1">{ticket.title}</span>
                            <span className="text-xs text-slate-400 ml-2">#{ticket.id.split('-')[1]}</span>
                         </div>
                         <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              ticket.priority === TicketPriority.CRITICAL ? 'bg-white border border-slate-200 text-red-600' : 'bg-slate-100 text-orange-600'
                            }`}>
                              {ticket.priority}
                            </span>
                            <span>{ticket.productVersion}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           {/* Documents Widget (Recent) */}
           <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-teal-500 w-5 h-5" /> 常用文档 (Documents)
                 </h3>
                 <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Upload
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                 {/* Show only top 5 recent docs */}
                 {documents.slice(0, 5).map((doc) => (
                   <div key={doc.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition group border border-transparent hover:border-slate-200 cursor-pointer">
                      <div className={`w-10 h-10 rounded flex items-center justify-center text-lg ${getDocIconColor(doc.category)}`}>
                         <FileText className="w-5 h-5" />
                      </div>
                      <div className="ml-3 flex-1">
                         <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{doc.title}</h4>
                         <p className="text-xs text-slate-500">Updated {doc.updatedAt} by {doc.author}</p>
                      </div>
                      <a href={doc.url} className="p-2 text-slate-400 hover:text-blue-600">
                         <ExternalLink className="w-4 h-4" />
                      </a>
                   </div>
                 ))}
              </div>
           </section>

        </div>
      </div>

      {/* --- EDIT VERSION MODAL --- */}
      {isVersionModalOpen && editingVersion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
               <h3 className="text-lg font-bold text-slate-800">
                 {versions.find(v => v.id === editingVersion.id) ? '编辑版本计划' : '新增版本计划'}
               </h3>
               <button onClick={() => setIsVersionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <form onSubmit={handleSaveVersion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">版本号</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={editingVersion.version}
                    onChange={(e) => setEditingVersion({...editingVersion, version: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">开始日期</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={editingVersion.startDate}
                      onChange={(e) => setEditingVersion({...editingVersion, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">结束日期</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={editingVersion.endDate}
                      onChange={(e) => setEditingVersion({...editingVersion, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={editingVersion.status}
                        onChange={(e) => setEditingVersion({...editingVersion, status: e.target.value as any})}
                      >
                        <option value="PLANNING">PLANNING</option>
                        <option value="DEVELOPING">DEVELOPING</option>
                        <option value="RELEASED">RELEASED</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">进度 (%)</label>
                      <input 
                        type="number" 
                        min="0" max="100"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={editingVersion.progress}
                        onChange={(e) => setEditingVersion({...editingVersion, progress: parseInt(e.target.value)})}
                      />
                   </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                   {versions.find(v => v.id === editingVersion.id) && (
                     <button 
                       type="button"
                       onClick={() => { setIsVersionModalOpen(false); handleDeleteVersion(editingVersion.id); }}
                       className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                     >
                       <Trash2 className="w-4 h-4" /> 删除
                     </button>
                   )}
                   <div className="flex gap-3 ml-auto">
                     <button 
                       type="button" 
                       onClick={() => setIsVersionModalOpen(false)}
                       className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                     >
                       取消
                     </button>
                     <button 
                       type="submit"
                       className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                     >
                       <Save className="w-4 h-4" /> 保存
                     </button>
                   </div>
                </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};