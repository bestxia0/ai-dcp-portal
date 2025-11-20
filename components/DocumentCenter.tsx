
import React, { useState, useMemo } from 'react';
import { Document, ProductVersion, DocumentCategory } from '../types';
import { 
  FileText, Download, Edit, ExternalLink, Filter, Search, 
  Briefcase, PenTool, Server, Code2, Save, X, Check
} from 'lucide-react';

interface DocumentCenterProps {
  documents: Document[];
  versions: ProductVersion[];
  onUpdateDocuments: (updatedDocs: Document[]) => void;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({ documents, versions, onUpdateDocuments }) => {
  const [selectedVersionId, setSelectedVersionId] = useState<string>(versions[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editing state
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  const categories = [
    { id: DocumentCategory.MARKET, label: '市场售前', icon: Briefcase, color: 'text-blue-600 bg-blue-100' },
    { id: DocumentCategory.DELIVERY, label: '交付与使用', icon: PenTool, color: 'text-green-600 bg-green-100' },
    { id: DocumentCategory.OPS, label: '运维维护', icon: Server, color: 'text-orange-600 bg-orange-100' },
    { id: DocumentCategory.RND, label: '研发与测试', icon: Code2, color: 'text-purple-600 bg-purple-100' },
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchVersion = selectedVersionId === 'ALL' || doc.versionId === selectedVersionId;
      const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchVersion && matchSearch;
    });
  }, [documents, selectedVersionId, searchQuery]);

  const startEditing = (doc: Document) => {
    setEditingDocId(doc.id);
    setEditUrl(doc.url);
  };

  const saveEditing = () => {
    if (!editingDocId) return;
    const updatedDocs = documents.map(d => 
      d.id === editingDocId ? { ...d, url: editUrl, updatedAt: 'Just now' } : d
    );
    onUpdateDocuments(updatedDocs);
    setEditingDocId(null);
    setEditUrl('');
  };

  const cancelEditing = () => {
    setEditingDocId(null);
    setEditUrl('');
  };

  const renderDocCard = (doc: Document, iconColor: string) => {
    const isEditing = editingDocId === doc.id;

    return (
      <div key={doc.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all group">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}>
             <FileText className="w-5 h-5" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             {isEditing ? (
               <>
                 <button onClick={saveEditing} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"><Check className="w-4 h-4" /></button>
                 <button onClick={cancelEditing} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"><X className="w-4 h-4" /></button>
               </>
             ) : (
               <button onClick={() => startEditing(doc)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                 <Edit className="w-4 h-4" />
               </button>
             )}
          </div>
        </div>
        
        <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1" title={doc.title}>{doc.title}</h4>
        <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
          <span>{doc.author}</span>
          <span>•</span>
          <span>{doc.updatedAt}</span>
        </div>

        {isEditing ? (
          <input 
            type="text" 
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full text-xs px-2 py-1 border border-blue-300 rounded bg-blue-50 focus:outline-none mb-2"
            placeholder="https://..."
            autoFocus
          />
        ) : (
          <a 
            href={doc.url} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-indigo-600 hover:underline font-medium bg-slate-50 px-2 py-1.5 rounded border border-slate-100 hover:border-indigo-100 transition-colors w-full justify-center"
          >
            <ExternalLink className="w-3 h-3" /> 在线查看/编辑
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <FileText className="text-indigo-600" /> 产品文档中心
           </h2>
           <p className="text-slate-500 text-sm mt-1">
             集中管理产品全生命周期文档，支持按版本检索与在线协同编辑。
           </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none appearance-none cursor-pointer min-w-[180px]"
            >
               <option value="" disabled>选择产品版本</option>
               {versions.map(v => (
                 <option key={v.id} value={v.id}>{v.version} ({v.status})</option>
               ))}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="搜索文档名称..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryDocs = filteredDocs.filter(d => d.category === category.id);
          if (categoryDocs.length === 0) return null;

          return (
            <section key={category.id} className="animate-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                  <div className={`p-1.5 rounded-md ${category.color}`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{category.label}</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                    {categoryDocs.length}
                  </span>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                 {categoryDocs.map(doc => renderDocCard(doc, category.color))}
               </div>
            </section>
          );
        })}

        {filteredDocs.length === 0 && (
           <div className="text-center py-12 text-slate-500">
             <div className="inline-block p-4 rounded-full bg-slate-100 mb-3">
               <FileText className="w-8 h-8 text-slate-400" />
             </div>
             <p>该版本下暂无匹配文档</p>
           </div>
        )}
      </div>

    </div>
  );
};
