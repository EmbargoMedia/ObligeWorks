
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, User, Search, Clock, Filter } from 'lucide-react';
import { MOCK_ISSUES } from '../../mockData';
import { IssueStatusBadge } from '../Issues';
import { IssueStatus } from '../../types';

const AdminIssues: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'UNRESOLVED'>('ALL');

  useEffect(() => {
    if (location.state && location.state.filter === 'UNRESOLVED') {
      setFilterType('UNRESOLVED');
    }
  }, [location.state]);

  const filteredIssues = MOCK_ISSUES.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || 
                          issue.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          issue.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'ALL' || issue.status !== IssueStatus.RESOLVED;
    return matchesSearch && matchesFilter;
  });

  const unresolvedCount = MOCK_ISSUES.filter(i => i.status !== IssueStatus.RESOLVED).length;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 italic">A/S 및 기술 지원 센터</h1>
            <p className="text-slate-500 font-medium">고객의 수선 및 수정 요청에 대해 실시간 기술 대응을 실시합니다.</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setFilterType(filterType === 'ALL' ? 'UNRESOLVED' : 'ALL')}
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all ${filterType === 'UNRESOLVED' ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                <AlertCircle size={16} /> 미결 티켓 ({unresolvedCount})
            </button>
            <div className="bg-[#002366] text-white px-5 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-blue-900/10">
                <Clock size={16} /> 평균 응대 시간: 1.4h
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="티켓 제목, 고객명, 오더번호 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              >
                  <option value="ALL">전체 티켓 보기</option>
                  <option value="UNRESOLVED">미결 티켓만 보기</option>
              </select>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredIssues.map((issue) => (
            <div 
                key={issue.id} 
                onClick={() => window.location.hash = `/issues/${issue.id}`}
                className="p-8 hover:bg-slate-50/80 transition-all group cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{issue.orderNumber}</span>
                    <IssueStatusBadge status={issue.status} />
                    {issue.status !== IssueStatus.RESOLVED && (
                        <span className="bg-rose-50 text-rose-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Response Required</span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{issue.title}</h3>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[10px]">
                        <User size={12} />
                      </div>
                      <span className="font-bold text-slate-700">{issue.customerName}</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 italic"><Clock size={12} /> 등록: {issue.createdAt}</span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1 leading-relaxed">{issue.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-50 transition-all active:scale-95">
                      해결 방안 제시
                    </button>
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-300 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredIssues.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold">
                  처리할 티켓이 없습니다.
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIssues;
