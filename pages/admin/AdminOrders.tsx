
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Clock, ChevronRight, ChevronLeft, User, Settings2, AlertTriangle, ShieldCheck, Box } from 'lucide-react';
import { getAllOrders } from '../../mockData';
import { OrderStatus } from '../../types';

const STATUS_KO: Record<string, string> = {
  'ALL': '전체 공정 상태',
  'URGENT': '마감 임박 오더',
  [OrderStatus.RECEIVED]: '오더 접수됨',
  [OrderStatus.QUOTE_PENDING]: '견적 산출중',
  [OrderStatus.PAYMENT_WAITING]: '결제 대기중',
  [OrderStatus.PRODUCTION]: '생산/제작중',
  [OrderStatus.INSPECTION]: '최종 검수중',
  [OrderStatus.READY_FOR_SHIP]: '배송 준비',
  [OrderStatus.SHIPPING]: '배송 진행중',
  [OrderStatus.COMPLETED]: '공정 완료'
};

const AdminOrders: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    if (location.state && location.state.filter) {
      setStatusFilter(location.state.filter);
    }
  }, [location.state]);

  const allOrders = getAllOrders();

  const isUrgent = (ecd: string) => {
    if (ecd === '상담 후 확정') return false;
    const today = new Date();
    const ecdDate = new Date(ecd);
    const diffTime = ecdDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filtered = allOrders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          o.itemName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'URGENT') return isUrgent(o.ecd) && o.status !== OrderStatus.COMPLETED;
    return o.status === statusFilter;
  });

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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">전역 공정 통합 관리</h1>
            <p className="text-slate-500 font-medium">전체 고객 오더의 실시간 워크플로우를 모니터링 및 제어합니다.</p>
          </div>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setStatusFilter('URGENT')}
                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${statusFilter === 'URGENT' ? 'bg-rose-600 text-white shadow-xl' : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'}`}
            >
                <AlertTriangle size={16} /> 긴급 관제 건
            </button>
            <button className="bg-[#002366] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#001A4D] transition-all flex items-center gap-2">
                <Box size={18} /> 신규 워크오더 생성
            </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="고객명, 오더번호, 품목명으로 즉시 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-[#002366]/5 outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-4 bg-white border border-slate-200 rounded-[20px] text-xs font-black outline-none focus:ring-4 focus:ring-[#002366]/5 shadow-sm appearance-none cursor-pointer"
            >
              {Object.keys(STATUS_KO).map(key => <option key={key} value={key}>{STATUS_KO[key]}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">주문 식별 정보</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">담당 고객</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">현재 공정 상태</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">예상 완료일</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">관제 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-7">
                    <p className="text-[10px] font-black text-[#002366] mb-1 uppercase tracking-tighter">{order.orderNumber}</p>
                    <p className="text-sm font-black text-slate-900">{order.itemName}</p>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                        <User size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm ${order.status === OrderStatus.PRODUCTION ? 'bg-[#002366] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_KO[order.status]}
                    </span>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className={isUrgent(order.ecd) ? "text-rose-500 animate-pulse" : "text-slate-400"} />
                      <span className={`text-sm font-black ${isUrgent(order.ecd) ? 'text-rose-600' : 'text-slate-700'}`}>{order.ecd}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <Link 
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-[#002366] hover:bg-[#002366] hover:text-white transition-all shadow-sm"
                    >
                      <Settings2 size={16} />
                      마스터 관제
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
