
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  PackageCheck, 
  PlusCircle, 
  CreditCard, 
  CircleDollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Wallet,
  Zap,
  Gem
} from 'lucide-react';
import { getAllOrders } from '../mockData';
import { OrderStatus, Order } from '../types';
import { StatusBadge } from './Dashboard';

type ExtendedFilter = OrderStatus | 'ALL' | 'IN_PROGRESS' | 'DELAYED';

const Orders: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ExtendedFilter>('ALL');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getAllOrders());
    if (location.state && (location.state as any).initialFilter) {
      setFilter((location.state as any).initialFilter);
    }
  }, [location.state]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.itemName.toLowerCase().includes(search.toLowerCase()) || 
                            order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                            order.workshopName.toLowerCase().includes(search.toLowerCase());
      
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
  }, [orders, filter, search]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">오더 대시보드</h1>
          <p className="text-slate-500 font-medium">관리자의 검토가 완료되면 전용 결제창이 활성화됩니다.</p>
        </div>
        <Link 
          to="/orders/new" 
          className="flex items-center justify-center gap-2 bg-[#002366] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#001A4D] transition-all shadow-xl shadow-blue-900/10 active:scale-95 shrink-0 uppercase tracking-widest text-[11px]"
        >
          <PlusCircle size={18} />
          신규 커스텀 프로젝트
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="주문번호, 품목명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#002366]/10 outline-none transition-all shadow-sm font-bold text-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          {(['ALL', OrderStatus.PAYMENT_WAITING, 'IN_PROGRESS'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-tight transition-all border ${
                filter === f 
                ? 'bg-[#002366] text-white border-[#002366] shadow-lg' 
                : 'bg-white text-slate-400 border-slate-200 hover:border-[#002366]/30'
              }`}
            >
              {f === 'ALL' ? '전체 내역' : f === OrderStatus.PAYMENT_WAITING ? '결제 가능' : '제작 현황'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div 
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className={`bg-white rounded-[40px] border transition-all group overflow-hidden cursor-pointer relative ${
                order.status === OrderStatus.PAYMENT_WAITING 
                ? 'border-[#E5D5C0] shadow-[0_30px_60px_-15px_rgba(166,124,82,0.1)] ring-1 ring-[#A67C52]/20' 
                : 'border-slate-100 shadow-sm hover:border-slate-200'
              }`}
            >
              {order.status === OrderStatus.PAYMENT_WAITING && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4EFE6] to-[#D4AF37]"></div>
              )}
              
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-slate-100">{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-baseline gap-4">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#002366] transition-colors tracking-tight italic uppercase">{order.itemName}</h3>
                      <span className="text-[11px] font-bold text-slate-400 tracking-tighter uppercase">{order.workshopName} Studio</span>
                    </div>
                    {order.status === OrderStatus.PAYMENT_WAITING && (
                      <div className="mt-4 inline-flex items-center gap-2 text-[#A67C52] font-black text-[10px] uppercase tracking-widest bg-[#F4EFE6] px-3 py-1 rounded-full animate-in fade-in">
                        <Gem size={12} className="animate-pulse" /> Official Quote Approved
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-1 text-right shrink-0">
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">Expected Handover</p>
                    <p className={`text-sm font-black ${order.ecd !== '상담 후 확정' && new Date(order.ecd) < new Date() && order.status !== OrderStatus.COMPLETED ? 'text-rose-600' : 'text-slate-800'}`}>{order.ecd}</p>
                  </div>
                </div>

                <div className={`rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all ${
                  order.status === OrderStatus.PAYMENT_WAITING 
                  ? 'bg-slate-50 border border-[#E5D5C0]/50' 
                  : 'bg-slate-50/50 border border-slate-100'
                }`}>
                   <div className="flex items-center gap-12 w-full md:w-auto">
                      <div className="flex flex-col gap-3">
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${order.status === OrderStatus.PAYMENT_WAITING ? 'text-[#A67C52]' : 'text-slate-400'}`}>Asset Lifecycle</p>
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${order.status === OrderStatus.RECEIVED || order.status === OrderStatus.QUOTE_PENDING ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-200'}`}></div>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === OrderStatus.RECEIVED || order.status === OrderStatus.QUOTE_PENDING ? 'text-blue-600' : 'text-slate-400'}`}>Design</span>
                           <div className="w-6 h-px bg-slate-200"></div>
                           <div className={`w-2 h-2 rounded-full ${order.status === OrderStatus.PAYMENT_WAITING ? 'bg-[#A67C52] shadow-[0_0_8px_rgba(166,124,82,0.5)]' : 'bg-slate-200'}`}></div>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${order.status === OrderStatus.PAYMENT_WAITING ? 'text-[#A67C52]' : 'text-slate-400'}`}>Payment</span>
                           <div className="w-6 h-px bg-slate-200"></div>
                           <div className={`w-2 h-2 rounded-full ${order.paymentStatus === '결제완료' ? 'bg-slate-900 shadow-[0_0_8px_rgba(0,0,0,0.3)]' : 'bg-slate-200'}`}></div>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === '결제완료' ? 'text-slate-900' : 'text-slate-400'}`}>Production</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 pt-8 md:pt-0">
                      <div className="flex flex-col md:items-end">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${order.status === OrderStatus.PAYMENT_WAITING ? 'text-[#A67C52]' : 'text-slate-400'}`}>Grand Total Quote</p>
                        <p className={`text-3xl font-black tracking-tighter ${order.status === OrderStatus.PAYMENT_WAITING ? 'text-slate-900 italic' : 'text-slate-700'}`}>
                           {order.finalQuote ? `₩${order.finalQuote.toLocaleString()}` : <span className="text-slate-300 italic text-lg">Under Technical Audit</span>}
                        </p>
                      </div>
                      
                      {order.status === OrderStatus.PAYMENT_WAITING ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                          className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 group/btn border border-white/10"
                        >
                          Checkout Now
                        </button>
                      ) : (
                        <button className="p-5 bg-white text-slate-300 border border-slate-100 rounded-3xl group-hover:text-[#002366] group-hover:border-[#002366]/20 transition-all shadow-sm">
                          <ChevronRight size={24} />
                        </button>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[40px] py-32 text-center border border-dashed border-slate-100">
            <Gem size={48} className="mx-auto text-slate-100 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-[0.2em]">No Active Projects</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
