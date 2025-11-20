
import React, { useState, useMemo } from 'react';
import { NavGroup, NavResource } from '../types';
import { 
  Search, ExternalLink, Edit2, Plus, Settings, X, Folder, 
  Gitlab, Container, Code2, Database, BookOpen, Ticket, 
  Figma, Layout, Component, Wind, Atom, Briefcase, Users, BarChart, Save, Trash2, Globe
} from 'lucide-react';

interface NavPortalProps {
  groups: NavGroup[];
  onUpdateGroups: (groups: NavGroup[]) => void;
}

export const NavPortal: React.FC<NavPortalProps> = ({ groups, onUpdateGroups }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Modal States
  const [editingResource, setEditingResource] = useState<Partial<NavResource> | null>(null);
  const [targetGroupId, setTargetGroupId] = useState<string>('');
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Filter logic
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    const lowerQuery = searchQuery.toLowerCase();
    
    return groups.map(group => {
      // Check if group title matches
      if (group.title.toLowerCase().includes(lowerQuery)) return group;
      
      // Filter items
      const matchingItems = group.items.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery)
      );
      
      if (matchingItems.length > 0) {
        return { ...group, items: matchingItems };
      }
      return null;
    }).filter(Boolean) as NavGroup[];
  }, [groups, searchQuery]);

  // Icon mapping helper
  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case 'Gitlab': return <Gitlab {...props} />;
      case 'Container': return <Container {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Database': return <Database {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Ticket': return <Ticket {...props} />;
      case 'Figma': return <Figma {...props} />;
      case 'Layout': return <Layout {...props} />;
      case 'Component': return <Component {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Atom': return <Atom {...props} />;
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Users': return <Users {...props} />;
      case 'BarChart': return <BarChart {...props} />;
      default: return <Globe {...props} />;
    }
  };

  const handleAddResource = (groupId: string) => {
    setTargetGroupId(groupId);
    setEditingResource({
      id: `r${Date.now()}`,
      name: '',
      description: '',
      url: 'https://',
      icon: 'Globe',
      bgColor: 'bg-slate-100 text-slate-600'
    });
    setIsResourceModalOpen(true);
  };

  const handleEditResource = (groupId: string, resource: NavResource) => {
    setTargetGroupId(groupId);
    setEditingResource({ ...resource });
    setIsResourceModalOpen(true);
  };

  const saveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editingResource.name) return;

    const newGroups = groups.map(g => {
      if (g.id === targetGroupId) {
        const exists = g.items.find(i => i.id === editingResource.id);
        let newItems = g.items;
        if (exists) {
          newItems = g.items.map(i => i.id === editingResource.id ? (editingResource as NavResource) : i);
        } else {
          newItems = [...g.items, editingResource as NavResource];
        }
        return { ...g, items: newItems };
      }
      return g;
    });

    onUpdateGroups(newGroups);
    setIsResourceModalOpen(false);
    setEditingResource(null);
  };

  const deleteResource = () => {
    if (!editingResource || !targetGroupId) return;
    if (confirm('Are you sure you want to remove this link?')) {
       const newGroups = groups.map(g => {
        if (g.id === targetGroupId) {
          return { ...g, items: g.items.filter(i => i.id !== editingResource.id) };
        }
        return g;
      });
      onUpdateGroups(newGroups);
      setIsResourceModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header / Search Bar */}
      <div className="bg-white px-8 py-12 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">导航门户 (Portal)</h1>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          快速访问研发工具链、文档知识库、设计资源及管理系统。
          支持自定义配置与分组管理。
        </p>

        <div className="max-w-2xl mx-auto relative">
           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
           <input 
             type="text" 
             placeholder="搜索系统名称、关键字..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
           />
        </div>

        <div className="absolute top-4 right-4">
           <button 
             onClick={() => setIsEditMode(!isEditMode)}
             className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${isEditMode ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-100'}`}
           >
             <Settings className="w-4 h-4" /> {isEditMode ? '退出配置' : '配置导航'}
           </button>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-10">
        {filteredGroups.map(group => (
          <div key={group.id} className="animate-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-2">
              <Folder className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-bold text-slate-800">{group.title}</h2>
              {isEditMode && (
                <button 
                  onClick={() => handleAddResource(group.id)}
                  className="ml-auto text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" /> 添加资源
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group relative flex items-start gap-4"
                >
                   {/* Icon */}
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bgColor || 'bg-slate-100 text-slate-600'}`}>
                     {renderIcon(item.icon)}
                   </div>

                   {/* Content */}
                   <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 h-8 leading-relaxed">{item.description}</p>
                   </div>

                   {/* Hover Action (Link) */}
                   {!isEditMode && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label={item.name}></a>
                   )}

                   {/* Edit Actions */}
                   {isEditMode && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleEditResource(group.id, item); }}
                       className="absolute top-2 right-2 p-1.5 bg-white shadow-sm border border-slate-200 rounded-md text-slate-400 hover:text-indigo-600 z-20"
                     >
                       <Edit2 className="w-3 h-3" />
                     </button>
                   )}
                </div>
              ))}
              
              {/* Empty State Placeholders for Edit Mode */}
              {isEditMode && group.items.length === 0 && (
                 <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 h-[100px] cursor-pointer hover:border-indigo-300 hover:text-indigo-500 transition-colors" onClick={() => handleAddResource(group.id)}>
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">添加资源</span>
                 </div>
              )}
            </div>

          </div>
        ))}

        {filteredGroups.length === 0 && (
           <div className="text-center py-12 text-slate-500">
              <p>未找到匹配的导航资源</p>
           </div>
        )}
      </div>

      {/* Resource Edit Modal */}
      {isResourceModalOpen && editingResource && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                 <h3 className="font-bold text-slate-800">
                    {editingResource.id?.startsWith('new') ? '添加资源' : '编辑资源配置'}
                 </h3>
                 <button onClick={() => setIsResourceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={saveResource} className="p-6 space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">名称</label>
                   <input 
                     type="text" required
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                     value={editingResource.name}
                     onChange={e => setEditingResource({...editingResource, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">URL 地址</label>
                   <input 
                     type="text" required
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                     value={editingResource.url}
                     onChange={e => setEditingResource({...editingResource, url: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                   <textarea 
                     rows={2}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                     value={editingResource.description}
                     onChange={e => setEditingResource({...editingResource, description: e.target.value})}
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Icon (Key)</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={editingResource.icon}
                        onChange={e => setEditingResource({...editingResource, icon: e.target.value})}
                      >
                         <option value="Globe">Globe</option>
                         <option value="Gitlab">Gitlab</option>
                         <option value="Container">Jenkins/Docker</option>
                         <option value="Figma">Figma</option>
                         <option value="BookOpen">Wiki</option>
                         <option value="Ticket">Jira</option>
                         <option value="Code2">Code</option>
                         <option value="Database">Database</option>
                         <option value="BarChart">Chart</option>
                      </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Color Class</label>
                       <input 
                        type="text"
                        placeholder="bg-blue-100 text-blue-600"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs"
                        value={editingResource.bgColor}
                        onChange={e => setEditingResource({...editingResource, bgColor: e.target.value})}
                      />
                    </div>
                 </div>

                 <div className="pt-4 flex justify-between">
                    {groups.some(g => g.items.some(i => i.id === editingResource.id)) && (
                       <button 
                         type="button" onClick={deleteResource}
                         className="text-red-500 hover:bg-red-50 px-3 py-2 rounded text-sm font-medium flex items-center gap-1"
                       >
                         <Trash2 className="w-4 h-4" /> 删除
                       </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                      <button 
                        type="button" onClick={() => setIsResourceModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
                      >
                        取消
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
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
