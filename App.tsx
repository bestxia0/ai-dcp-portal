
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketList } from './components/TicketList';
import { TicketDetail } from './components/TicketDetail';
import { DocumentCenter } from './components/DocumentCenter';
import { VersionRoadmap } from './components/VersionRoadmap';
import { OutboundRequests } from './components/OutboundRequests';
import { NavPortal } from './components/NavPortal';
import { ProductCatalog } from './components/ProductCatalog';
import { MOCK_PRODUCTS, MOCK_TICKETS, MOCK_VERSIONS, MOCK_RELEASES, MOCK_DOCUMENTS, MOCK_OUTBOUND_REQUESTS, MOCK_NAV_GROUPS, CURRENT_USER } from './constants';
import { Ticket, ViewState, ProductVersion, Document, OutboundRequest, NavGroup, Product } from './types';
import { Search, Bell, Plus, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('PORTAL');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  
  // State for data
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
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
            products={products}
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
             products={products}
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
          <ProductCatalog 
            products={products}
            onUpdateProducts={setProducts}
          />
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
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
          
          {/* Right Side Actions & User Profile */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="text-right hidden sm:block">
                 <div className="text-sm font-bold text-slate-700">{CURRENT_USER.name}</div>
                 <div className="text-xs text-slate-500">{CURRENT_USER.role}</div>
               </div>
               <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                 <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-full h-full object-cover" />
               </div>
               <LogOut className="w-4 h-4 text-slate-400 hover:text-slate-600 ml-1" />
            </div>
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
