
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronRight, PackageCheck, PlusCircle } from 'lucide-react';
import { getAllOrders } from '../mockData';
import { OrderStatus } from '../types';
import { StatusBadge } from './Dashboard';

type ExtendedFilter = OrderStatus | 'ALL' | 'IN_PROGRESS' | 'DELAYED';

const Orders: React.FC = () => {
  const location = useLocation();
  const [filter, setFilter] = useState<ExtendedFilter>('ALL');
  const [search, setSearch] = useState('');

  // Initial filter from location state
  useEffect(() => {
    if (location.state && (location.state as any).initialFilter) {
      setFilter((location.state as any).initialFilter);
    }
  }, [location.state]);

  const allOrders = useMemo(() => getAllOrders(), []);

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.itemName.toLowerCase().includes(search.toLowerCase()) || 
                          order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                          order.workshopName.toLowerCase().includes(search.toLowerCase()); // 공방명 검색 추가
    
    if (!matchesSearch) return false;

    if (filter === 'ALL') return true;
    if (filter === 'DELAYED') {
        if (order.ecd === '상담 후 확정') return false;
        try {
          return new Date(order.ecd) < new Date() && order.status !== OrderStatus.COMPLETED;
        } catch {
          return false;
        }
    }
    if (filter === 'IN_PROGRESS') {
        return [OrderStatus.PRODUCTION, OrderStatus.INSPECTION, OrderStatus.READY_FOR_SHIP].includes(order.status);
    }
    
    return order.status === filter;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">내 주문 리스트</h1>
          <p className="text-slate-500">진행 중인 모든 주문 내역을 한눈에 확인하세요.</p>
        </div>
        <Link 
          to="/orders/new" 
          className="flex items-center justify-center gap-2 bg-[#002366] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#001A4D] transition-all shadow-xl shadow-blue-900/10 active:scale-95 shrink-0"
        >
          <PlusCircle size={20} />
          새 주문 제작하기
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="주문번호, 품목명 또는 공방명으로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#002366]/20 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all border ${
              filter === 'ALL' 
              ? 'bg-[#002366] text-white border-[#002366] shadow-md shadow-blue-900/10' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-[#002366]/30'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all border ${
              filter === 'IN_PROGRESS' 
              ? 'bg-[#002366] text-white border-[#002366] shadow-md shadow-blue-900/10' 
              : 'bg-white text-slate-600 border-slate-200 hover:border-[#002366]/30'
            }`}
          >
            진행중
          </button>
          <button
            onClick={() => setFilter('DELAYED')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all border ${
              filter === 'DELAYED' 
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-900/10' 
              : 'bg-white text-rose-600 border-slate-200 hover:border-rose-300'
            }`}
          >
            지연됨
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />
          {Object.values(OrderStatus).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all border ${
                filter === s 
                ? 'bg-[#002366] text-white border-[#002366] shadow-md shadow-blue-900/10' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#002366]/30'
              }`}
            >
              {translateStatus(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <Link 
              to={`/orders/${order.id}`}
              key={order.id}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-[#002366]/20 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-400 tracking-tighter">{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                    {order.ecd !== '상담 후 확정' && new Date(order.ecd) < new Date() && order.status !== OrderStatus.COMPLETED && (
                      <span className="px-2 py-1 rounded bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase">납기지연</span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#002366] transition-colors">{order.itemName}</h3>
                    <span className="text-xs font-medium text-slate-400">@ {order.workshopName}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 font-medium">{order.options}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-y-1 text-sm md:text-right shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">예상 납기일</span>
                    <span className={`font-bold ${order.ecd !== '상담 후 확정' && new Date(order.ecd) < new Date() && order.status !== OrderStatus.COMPLETED ? 'text-rose-600' : 'text-slate-700'}`}>{order.ecd}</span>
                  </div>
                  <div className="flex flex-col mt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">마지막 업데이트</span>
                    <span className="text-slate-600 font-medium">{order.lastUpdate}</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-[#002366] group-hover:text-white transition-all duration-300">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-slate-200">
            <PackageCheck size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-slate-500 font-bold text-lg">해당 조건의 주문 내역이 없습니다.</p>
            <p className="text-slate-400 text-sm mt-2 mb-8">필터를 변경하거나 전체 목록을 확인해보세요.</p>
            <button 
              onClick={() => {setFilter('ALL'); setSearch('');}}
              className="inline-flex items-center gap-2 bg-[#002366] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10"
            >
              전체 주문 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function translateStatus(s: OrderStatus) {
  // Fix: Add missing OrderStatus keys to map
  const map: Record<OrderStatus, string> = {
    [OrderStatus.RECEIVED]: '접수됨',
    [OrderStatus.QUOTE_PENDING]: '견적중',
    [OrderStatus.PAYMENT_WAITING]: '결제대기',
    [OrderStatus.PRODUCTION]: '제작중',
    [OrderStatus.INSPECTION]: '검수중',
    [OrderStatus.READY_FOR_SHIP]: '배송준비',
    [OrderStatus.SHIPPING]: '배송중',
    [OrderStatus.COMPLETED]: '완료',
  };
  return map[s];
}

export default Orders;
