
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { 
  Package, Search, Plus, Edit2, Trash2, X, Save, 
  ListTodo, Kanban, Component, Book, Layout, Server, 
  Smartphone, TestTube, ClipboardCheck, Bot, Radio, 
  RefreshCw, Network, Activity, MoreHorizontal, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onUpdateProducts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});

  // Helper to render dynamic icons based on string name
  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case 'ListTodo': return <ListTodo {...props} />;
      case 'Kanban': return <Kanban {...props} />;
      case 'Component': return <Component {...props} />;
      case 'Book': return <Book {...props} />;
      case 'Layout': return <Layout {...props} />;
      case 'Server': return <Server {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'TestTube': return <TestTube {...props} />;
      case 'ClipboardCheck': return <ClipboardCheck {...props} />;
      case 'Bot': return <Bot {...props} />;
      case 'Radio': return <Radio {...props} />;
      case 'RefreshCw': return <RefreshCw {...props} />;
      case 'Network': return <Network {...props} />;
      default: return <Package {...props} />;
    }
  };

  const filteredProducts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.owner.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  const handleAddNew = () => {
    setEditingProduct({
      id: `p${Date.now()}`,
      name: '',
      description: '',
      owner: '',
      health: 100,
      activeTickets: 0,
      icon: 'Package'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该产品目录吗？此操作不可恢复。')) {
      onUpdateProducts(products.filter(p => p.id !== id));
      setIsModalOpen(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.id || !editingProduct.name) return;

    const newProduct = editingProduct as Product;
    const exists = products.find(p => p.id === newProduct.id);

    if (exists) {
      onUpdateProducts(products.map(p => p.id === newProduct.id ? newProduct : p));
    } else {
      onUpdateProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-indigo-600 w-6 h-6" /> 产品目录管理
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            维护全行产品线清单、健康度监控及负责人信息。
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               placeholder="搜索产品名称、负责人..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
             />
           </div>
           <button 
             onClick={handleAddNew}
             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
           >
             <Plus className="w-4 h-4" /> 新增产品
           </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group relative">
            
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 bg-indigo-50 group-hover:scale-110 transition-transform duration-300`}>
                {renderIcon(product.icon)}
              </div>
              <button 
                onClick={() => handleEdit(product)}
                className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-lg text-slate-800 mb-1 truncate" title={product.name}>{product.name}</h3>
            <p className="text-sm text-slate-500 mb-4 h-10 overflow-hidden leading-relaxed line-clamp-2" title={product.description}>
              {product.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">负责人</span>
                 <span className="font-medium text-slate-700">{product.owner}</span>
               </div>
               
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">健康度</span>
                 <div className="flex items-center gap-2">
                   <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                     <div 
                        className={`h-full rounded-full ${product.health >= 90 ? 'bg-green-500' : product.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${product.health}%` }}
                     ></div>
                   </div>
                   <span className={`font-bold ${product.health >= 90 ? 'text-green-600' : product.health >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                     {product.health}
                   </span>
                 </div>
               </div>

               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">活跃工单</span>
                 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                   {product.activeTickets}
                 </span>
               </div>
            </div>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>未找到匹配的产品</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
               <h3 className="font-bold text-slate-800 text-lg">
                 {products.find(p => p.id === editingProduct.id) ? '编辑产品信息' : '新增产品目录'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">产品名称</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">负责人 (Owner)</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingProduct.owner}
                    onChange={e => setEditingProduct({...editingProduct, owner: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={editingProduct.description}
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">图标 (Icon Key)</label>
                      <select 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        value={editingProduct.icon}
                        onChange={e => setEditingProduct({...editingProduct, icon: e.target.value})}
                      >
                         <option value="Package">Package (Default)</option>
                         <option value="ListTodo">ListTodo (需求)</option>
                         <option value="Kanban">Kanban (项目)</option>
                         <option value="Component">Component (组件)</option>
                         <option value="Book">Book (知识库)</option>
                         <option value="Layout">Layout (前端)</option>
                         <option value="Server">Server (后端)</option>
                         <option value="Smartphone">Smartphone (移动)</option>
                         <option value="TestTube">TestTube (测管)</option>
                         <option value="ClipboardCheck">Clipboard (测试)</option>
                         <option value="Bot">Bot (自动化)</option>
                         <option value="Radio">Radio (指挥)</option>
                         <option value="RefreshCw">Refresh (业务连续)</option>
                         <option value="Network">Network (架构)</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">健康度 (0-100)</label>
                      <input 
                        type="number" min="0" max="100"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={editingProduct.health}
                        onChange={e => setEditingProduct({...editingProduct, health: parseInt(e.target.value)})}
                      />
                   </div>
                </div>

                <div className="pt-4 flex justify-between">
                  {products.find(p => p.id === editingProduct.id) && (
                    <button 
                      type="button" onClick={() => handleDelete(editingProduct.id!)}
                      className="text-red-600 hover:bg-red-50 px-3 py-2 rounded text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> 删除
                    </button>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button 
                      type="button" onClick={() => setIsModalOpen(false)}
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
