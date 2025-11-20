
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { DocumentCenter } from './components/DocumentCenter';
import { VersionRoadmap } from './components/VersionRoadmap';
import { OutboundRequests } from './components/OutboundRequests';
import { NavPortal } from './components/NavPortal';
import { MOCK_PRODUCTS, MOCK_TICKETS, MOCK_VERSIONS, MOCK_RELEASES, MOCK_DOCUMENTS, MOCK_OUTBOUND_REQUESTS, MOCK_NAV_GROUPS } from './constants';
import { Ticket, ViewState, ProductVersion, Document, OutboundRequest, NavGroup } from './types';
import { Search, Bell, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('PORTAL');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  
  // State for data
  const [versions, setVersions] = useState<ProductVersion[]>(MOCK_VERSIONS);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [outboundRequests, setOutboundRequests] = useState<OutboundRequest[]>(MOCK_OUTBOUND_REQUESTS);
  const [navGroups, setNavGroups] = useState<NavGroup[]>(MOCK_NAV_GROUPS);

  // Handler to update a ticket (e.g., after AI analysis or status change)
  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'PORTAL':
        return (
          <NavPortal 
            groups={navGroups}
            onUpdateGroups={setNavGroups}
          />
        );
      case 'DASHBOARD':
        return (
          <Dashboard 
            tickets={tickets} 
            products={MOCK_PRODUCTS}
            versions={versions}
            releases={MOCK_RELEASES}
            documents={documents}
            onUpdateVersions={setVersions}
          />
        );
      case 'ROADMAP':
        return (
          <VersionRoadmap 
            versions={versions}
            onUpdateVersions={setVersions}
          />
        );
      case 'OUTBOUND':
        return (
          <OutboundRequests 
             requests={outboundRequests}
             products={MOCK_PRODUCTS}
             versions={versions}
             onUpdateRequests={setOutboundRequests}
          />
        );
      case 'TICKETS':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">全部工单</h2>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors">
                <Plus className="w-4 h-4" />
                新建工单
              </button>
            </div>
            
            {/* Filters Bar (Visual Only for Demo) */}
            <div className="flex gap-2 overflow-x-auto pb-2">
               {['All', 'Open', 'Assigned to me', 'Critical', 'High Priority'].map((filter, idx) => (
                 <button key={filter} className={`px-3 py-1.5 text-sm rounded-full border ${idx === 0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                   {filter}
                 </button>
               ))}
            </div>

            <TicketList tickets={tickets} onSelectTicket={setSelectedTicket} />
          </div>
        );
      case 'PRODUCTS':
        return (
          <div className="animate-in fade-in duration-500">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">产品目录</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PRODUCTS.map(product => (
                  <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                        {product.name.substring(0,1)}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.health > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        Health: {product.health}%
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 h-10 overflow-hidden">{product.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                       <div className="text-xs text-slate-500">
                         Owner: <span className="text-slate-700 font-medium">{product.owner}</span>
                       </div>
                       <div className="text-xs font-medium text-indigo-600">
                         {product.activeTickets} active tickets
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );
      case 'DOCUMENTS':
        return (
          <DocumentCenter 
            documents={documents}
            versions={versions}
            onUpdateDocuments={setDocuments}
          />
        );
      default:
        return <div className="p-10 text-center text-slate-500">Work in progress...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search tickets, products, or people..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </div>
      </main>

      {/* Slide-over Ticket Detail */}
      {selectedTicket && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedTicket(null)}
          />
          <TicketDetail 
            ticket={selectedTicket} 
            onClose={() => setSelectedTicket(null)} 
            onUpdateTicket={handleUpdateTicket}
          />
        </>
      )}
    </div>
  );
};

export default App;
