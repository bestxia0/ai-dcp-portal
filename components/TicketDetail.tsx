
import React, { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus } from '../types';
import { analyzeTicketWithGemini } from '../services/geminiService';
import { X, Sparkles, User as UserIcon, Tag, BrainCircuit, MessageSquare, ArrowRight, Paperclip, Calendar, Box, Layers, FileText, AlertCircle } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdateTicket: (updatedTicket: Ticket) => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose, onUpdateTicket }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzeTicketWithGemini(ticket);
    setIsAnalyzing(false);
    if (analysis) {
      onUpdateTicket({
        ...ticket,
        aiAnalysis: analysis,
        // Optionally update fields if empty based on AI
        rootCauseCategory: ticket.rootCauseCategory || analysis.suggestedRootCauseCategory
      });
    }
  };

  const getPriorityColor = (p: TicketPriority) => {
     switch(p) {
       case TicketPriority.CRITICAL: return 'text-red-600 bg-red-50 border-red-100';
       case TicketPriority.HIGH: return 'text-orange-600 bg-orange-50 border-orange-100';
       case TicketPriority.MEDIUM: return 'text-yellow-600 bg-yellow-50 border-yellow-100';
       default: return 'text-blue-600 bg-blue-50 border-blue-100';
     }
  }

  const renderField = (label: string, value: React.ReactNode, icon?: React.ReactNode, fullWidth = false) => (
    <div className={`bg-slate-50 p-3 rounded-lg border border-slate-100 ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="text-xs uppercase text-slate-400 font-semibold mb-1 flex items-center gap-1">
        {icon && <span className="w-3 h-3">{icon}</span>}
        {label}
      </div>
      <div className="text-sm text-slate-800 font-medium break-words">
        {value || <span className="text-slate-300 italic">未填写</span>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[700px] lg:w-[900px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 border-l border-slate-200">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded text-sm font-bold border border-slate-200">{ticket.id}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200`}>
            {ticket.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAIAnalyze}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all
              ${isAnalyzing ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}
            `}
          >
            {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isAnalyzing ? '分析中...' : 'Gemini 智能分析'}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{ticket.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {ticket.tags.map(tag => (
               <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs border border-slate-200">
                 <Tag className="w-3 h-3" /> {tag}
               </span>
             ))}
          </div>
        </div>

        {/* Basic Information Grid */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Box className="w-4 h-4 text-indigo-500" /> 基本信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderField('故障类型', ticket.type, <Layers />)}
            {renderField('客户名称/项目', ticket.customerName, <UserIcon />)}
            {renderField('所属产品', ticket.productId, <Box />)}
            {renderField('产品版本', ticket.productVersion, <Tag />)}
            {renderField('故障记录时间', new Date(ticket.createdAt).toLocaleString(), <Calendar />)}
            {renderField('月份', ticket.reportingMonth, <Calendar />)}
          </div>
        </section>

        {/* People Grid */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-indigo-500" /> 人员信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {renderField('故障记录人', ticket.reporterId)}
            {renderField('负责人', ticket.assigneeId)}
            {renderField('研发负责人', ticket.devOwner)}
            {renderField('测试负责人', ticket.testOwner)}
          </div>
        </section>

        {/* Details & Attachments */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> 详细描述
          </h3>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </div>
          {ticket.attachmentUrl && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-blue-600 hover:bg-slate-100 cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              <a href={ticket.attachmentUrl} target="_blank" rel="noreferrer" className="hover:underline">
                查看附件 (attachment_1)
              </a>
            </div>
          )}
        </section>

        {/* Analysis & Resolution */}
        <section>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" /> 根因与解决方案
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderField('故障原因分类', ticket.rootCauseCategory)}
            {renderField('问题引入阶段', ticket.introductionStage)}
            {renderField('预计解决版本', ticket.targetVersion)}
            {renderField('预计解决时间', ticket.estimatedResolutionTime)}
            {renderField('复盘情况', ticket.reviewStatus)}
            <div className="hidden md:block"></div> {/* Spacer */}
            {renderField('故障解决方案', ticket.solution, undefined, true)}
          </div>
        </section>

        {/* AI Analysis Section */}
        {ticket.aiAnalysis && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="bg-indigo-100/50 px-6 py-3 border-b border-indigo-100 flex items-center gap-2 text-indigo-800 font-medium">
              <BrainCircuit className="w-5 h-5" />
              Gemini 智能洞察报告
            </div>
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-lg border border-indigo-100/50">
                  <div className="text-xs uppercase tracking-wider text-indigo-500 font-bold mb-1">建议优先级</div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      ticket.aiAnalysis.suggestedPriority === TicketPriority.CRITICAL ? 'text-red-600' : 'text-slate-800'
                    }`}>
                      {ticket.aiAnalysis.suggestedPriority}
                    </span>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg border border-indigo-100/50">
                   <div className="text-xs uppercase tracking-wider text-indigo-500 font-bold mb-1">建议根因分类</div>
                   <div className="font-bold text-slate-800">
                     {ticket.aiAnalysis.suggestedRootCauseCategory || '未确定'}
                   </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">根因分析假设</div>
                <p className="text-slate-600 text-sm bg-white/50 p-3 rounded-lg border border-indigo-50">
                  {ticket.aiAnalysis.rootCauseHypothesis}
                </p>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2 flex justify-between items-center">
                  <span>建议回复草稿</span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    使用此回复 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="bg-white p-4 rounded-lg border border-indigo-100 text-sm text-slate-600 whitespace-pre-wrap font-sans">
                  {ticket.aiAnalysis.draftResponse}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
