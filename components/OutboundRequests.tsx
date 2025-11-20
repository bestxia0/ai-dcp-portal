
import React, { useState, useMemo } from 'react';
import { OutboundRequest, OutboundStatus, Product, ProductVersion } from '../types';
import { 
  Search, Plus, Filter, FileText, CheckCircle2, Clock, XCircle, 
  Calendar, User, Box, Tag, Link as LinkIcon, Save, X
} from 'lucide-react';

interface OutboundRequestsProps {
  requests: OutboundRequest[];
  products: Product[];
  versions: ProductVersion[];
  onUpdateRequests: (requests: OutboundRequest[]) => void;
}

export const OutboundRequests: React.FC<OutboundRequestsProps> = ({ 
  requests, 
  products, 
  versions,
  onUpdateRequests 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<OutboundRequest>>({
    applicationDate: new Date().toISOString().split('T')[0],
    applicant: '',
    projectSide: '',
    requirements: '',
    artifactUrl: '',
    documentUrl: ''
  });

  const filteredRequests = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return requests.filter(req => 
      req.projectSide.toLowerCase().includes(lowerQuery) ||
      req.applicant.toLowerCase().includes(lowerQuery) ||
      req.productName.toLowerCase().includes(lowerQuery)
    );
  }, [requests, searchQuery]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setFormData(prev => ({
      ...prev,
      productId,
      productName: product?.name || '',
      versionId: '', // Reset version when product changes
      version: ''
    }));
  };

  const handleVersionChange = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    setFormData(prev => ({
      ...prev,
      versionId,
      version: version?.version || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: OutboundRequest = {
      id: `OB-${Date.now()}`,
      applicationDate: formData.applicationDate!,
      productId: formData.productId!,
      productName: formData.productName!,
      versionId: formData.versionId!,
      version: formData.version!,
      applicant: formData.applicant!,
      projectSide: formData.projectSide!,
      requirements: formData.requirements || '',
      artifactUrl: formData.artifactUrl || '',
      documentUrl: formData.documentUrl || '',
      status: 'PENDING'
    };

    onUpdateRequests([newRequest, ...requests]);
    setIsModalOpen(false);
    // Reset form
    setFormData({
       applicationDate: new Date().toISOString().split('T')[0],
       applicant: '',
       projectSide: '',
       requirements: '',
       artifactUrl: '',
       documentUrl: ''
    });
  };

  const getStatusBadge = (status: OutboundStatus) => {
    switch(status) {
      case 'APPROVED': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-100"><CheckCircle2 className="w-3 h-3" /> 已批准</span>;
      case 'REJECTED': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs border border-red-100"><XCircle className="w-3 h-3" /> 已拒绝</span>;
      default: return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-100"><Clock className="w-3 h-3" /> 待审批</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Box className="text-indigo-600 w-6 h-6" /> 产品出库记录
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            管理产品对外交付与出库申请，追踪交付历史与状态。
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="搜索项目方、申请人..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
             />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
           >
             <Plus className="w-4 h-4" /> 申请出库
           </button>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                <th className="p-4">申请出库日期</th>
                <th className="p-4">申请出库产品</th>
                <th className="p-4">申请出库版本</th>
                <th className="p-4">申请出库人</th>
                <th className="p-4">申请项目方</th>
                <th className="p-4">出库要求</th>
                <th className="p-4">制品地址</th>
                <th className="p-4">文档地址</th>
                <th className="p-4">状态</th>
                <th className="p-4">操作人</th>
                <th className="p-4">操作时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-slate-600">{req.applicationDate}</td>
                  <td className="p-4 font-medium text-slate-800">{req.productName}</td>
                  <td className="p-4 text-indigo-600">{req.version}</td>
                  <td className="p-4 text-slate-600">{req.applicant}</td>
                  <td className="p-4 font-medium text-slate-800">{req.projectSide}</td>
                  <td className="p-4 text-slate-500 max-w-[200px] truncate" title={req.requirements}>{req.requirements || '-'}</td>
                  <td className="p-4">
                    {req.artifactUrl ? (
                      <a href={req.artifactUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" /> Link
                      </a>
                    ) : '-'}
                  </td>
                  <td className="p-4">
                     {req.documentUrl ? (
                      <a href={req.documentUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Doc
                      </a>
                    ) : '-'}
                  </td>
                  <td className="p-4">{getStatusBadge(req.status)}</td>
                  <td className="p-4 text-slate-500">{req.operator || '-'}</td>
                  <td className="p-4 text-slate-400 text-xs">{req.operationTime || '-'}</td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">暂无出库记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
             
             {/* Header */}
             <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
               <h3 className="text-xl font-bold text-slate-800 text-center flex-1">产品出库申请_表单</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 absolute right-6">
                 <X className="w-6 h-6" />
               </button>
             </div>

             {/* Form Body */}
             <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">申请出库日期</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600"
                      value={formData.applicationDate}
                      onChange={(e) => setFormData({...formData, applicationDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">申请出库产品</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-600 appearance-none"
                      value={formData.productId || ''}
                      onChange={(e) => handleProductChange(e.target.value)}
                    >
                      <option value="" disabled>请选择选项</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {formData.productId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">申请出库版本</label>
                    <div className="relative">
                      <select 
                        required
                        className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-600 appearance-none"
                        value={formData.versionId || ''}
                        onChange={(e) => handleVersionChange(e.target.value)}
                      >
                        <option value="" disabled>请选择版本</option>
                        {versions
                          // Filter versions by product if possible, currently MOCK_VERSIONS doesn't have productId explicitly linked easily, 
                          // assuming simple match by name or just show all for demo
                          .map(v => (
                          <option key={v.id} value={v.id}>{v.version} ({v.type})</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">申请出库人</label>
                  <input 
                    type="text" 
                    required
                    placeholder="请输入内容"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.applicant}
                    onChange={(e) => setFormData({...formData, applicant: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">申请项目方</label>
                  <input 
                    type="text" 
                    required
                    placeholder="请输入内容"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.projectSide}
                    onChange={(e) => setFormData({...formData, projectSide: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">出库要求 (可选)</label>
                  <textarea 
                    rows={2}
                    placeholder="请输入详细要求..."
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">制品地址 (可选)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.artifactUrl}
                      onChange={(e) => setFormData({...formData, artifactUrl: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">文档地址 (可选)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.documentUrl}
                      onChange={(e) => setFormData({...formData, documentUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                   <button 
                     type="submit"
                     className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium shadow-md transition-colors"
                   >
                     提交
                   </button>
                </div>

             </form>
          </div>
        </div>
      )}

    </div>
  );
};
