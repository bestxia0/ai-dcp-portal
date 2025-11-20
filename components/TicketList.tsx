
import React from 'react';
import { Ticket, TicketPriority, TicketStatus } from '../types';
import { AlertTriangle, ArrowUp, CheckCircle, Clock, MoreHorizontal, User } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onSelectTicket }) => {
  
  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.CRITICAL: return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case TicketPriority.HIGH: return <ArrowUp className="w-4 h-4 text-orange-500" />;
      case TicketPriority.MEDIUM: return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityLabel = (priority: TicketPriority) => {
     switch (priority) {
      case TicketPriority.CRITICAL: return '致命';
      case TicketPriority.HIGH: return '严重';
      case TicketPriority.MEDIUM: return '中等';
      default: return '一般';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    const styles = {
      [TicketStatus.OPEN]: "bg-blue-50 text-blue-700 border-blue-100",
      [TicketStatus.IN_PROGRESS]: "bg-yellow-50 text-yellow-700 border-yellow-100",
      [TicketStatus.RESOLVED]: "bg-green-50 text-green-700 border-green-100",
      [TicketStatus.CLOSED]: "bg-slate-50 text-slate-700 border-slate-100",
    };
    const labels = {
      [TicketStatus.OPEN]: '待处理',
      [TicketStatus.IN_PROGRESS]: '处理中',
      [TicketStatus.RESOLVED]: '已解决',
      [TicketStatus.CLOSED]: '已关闭',
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <th className="p-4 w-24">故障编号</th>
              <th className="p-4 w-1/4">问题概述</th>
              <th className="p-4">客户名称</th>
              <th className="p-4">所属产品</th>
              <th className="p-4">状态</th>
              <th className="p-4">故障级别</th>
              <th className="p-4">故障类型</th>
              <th className="p-4">故障记录人</th>
              <th className="p-4">记录时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr 
                key={ticket.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onSelectTicket(ticket)}
              >
                <td className="p-4 font-mono text-sm text-slate-500">{ticket.id}</td>
                <td className="p-4">
                  <div className="font-medium text-slate-900">{ticket.title}</div>
                  <div className="text-xs text-slate-500 truncate max-w-xs mt-1">{ticket.description}</div>
                </td>
                <td className="p-4 text-sm text-slate-700">{ticket.customerName}</td>
                <td className="p-4 text-sm text-slate-700">{ticket.productId}</td>
                <td className="p-4">{getStatusBadge(ticket.status)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    {getPriorityIcon(ticket.priority)}
                    <span>{getPriorityLabel(ticket.priority)}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{ticket.type}</td>
                <td className="p-4 text-sm text-slate-600 flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                     <User className="w-3 h-3" />
                   </div>
                   {ticket.reporterId}
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
