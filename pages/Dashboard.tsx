
import React, { useMemo, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PackageCheck, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  PlusCircle, 
  Sparkles,
  Ticket
} from 'lucide-react';
import { getAllOrders } from '../mockData';
import { OrderStatus, Order } from '../types';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isVoucherActive, setIsVoucherActive] = useState(false);

  // Load orders and check voucher status
  const refreshData = () => {
    const all = getAllOrders();
    const sorted = [...all].sort((a, b) => b.id.localeCompare(a.id));
    setOrders(sorted);
    setIsVoucherActive(localStorage.getItem('obligeworks_voucher_active') === 'true');
  };

  useEffect(() => {
    refreshData();
  }, [location.state]);

  const inProgressCount = useMemo(() => orders.filter(o => 
    o.status === OrderStatus.PRODUCTION || o.status === OrderStatus.INSPECTION || o.status === OrderStatus.READY_FOR_SHIP
  ).length, [orders]);

  const delayedCount = useMemo(() => orders.filter(o => {
    if (o.ecd === '상담 후 확정') return false;
    try {
      return new Date(o.ecd) < new Date();
    } catch {
      return false;
    }
  }).length, [orders]);

  const todayUpdates = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const count = orders.filter(o => o.lastUpdate.includes(today)).length;
    return count > 0 ? count : 0;
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 4), [orders]);

  const stats = [
    { 
      label: '진행중 오더', 
      value: inProgressCount, 
      icon: PackageCheck, 
      color: 'text-white', 
      bg: 'bg-[#002366]', 
      filter: 'IN_PROGRESS' 
    },
    { 
      label: '지연 오더', 
      value: delayedCount, 
      icon: Clock, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      filter: 'DELAYED'
    },
    { 
      label: '오늘 업데이트', 
      value: todayUpdates, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      filter: 'ALL'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">안녕하세요, 홍길동님! 👋</h1>
          <p className="text-slate-500 mt-1 font-medium">오늘의 주문 현황을 확인해보세요.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white border px-4 py-2 rounded-full shadow-sm">
          <Calendar size={16} />
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
        </div>
      </div>

      {/* Voucher Active Notification */}
      {isVoucherActive && (
        <div className="bg-[#002366] rounded-[32px] p-6 text-white flex items-center justify-between shadow-xl shadow-blue-900/10 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Ticket size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">프레스티지 바우처가 활성화되었습니다</h3>
              <p className="text-blue-100 text-xs font-medium mt-1">다음 새 주문 제작 시 ₩50,000 할인이 자동으로 적용됩니다.</p>
            </div>
          </div>
          <Link to="/orders/new" className="px-6 py-3 bg-white text-[#002366] rounded-xl text-xs font-black shadow-lg hover:bg-slate-50 transition-all active:scale-95 relative z-10">
            주문하러 가기
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Link 
            to="/orders" 
            state={{ initialFilter: stat.filter }}
            key={idx} 
            className={`p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${stat.label === '진행중 오더' ? 'bg-[#002366] text-white shadow-xl shadow-blue-900/10 border-transparent' : 'bg-white'}`}
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.label === '진행중 오더' ? 'bg-white/10 text-white' : `${stat.bg} ${stat.color}`}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stat.label === '진행중 오더' ? 'text-blue-300' : 'text-slate-400'}`}>{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <ChevronRight size={14} className={`${stat.label === '진행중 오더' ? 'text-blue-300/50' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">빠른 실행</h2>
          <div className="space-y-3">
            <Link to="/orders/new" className="flex items-center justify-between p-6 bg-[#002366] text-white rounded-[32px] shadow-xl hover:bg-[#001A4D] transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform text-white">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <p className="font-bold">새 주문 의뢰</p>
                  <p className="text-[10px] text-blue-300/60 mt-0.5 font-bold uppercase tracking-wider">Custom Jewelry</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-white/20" />
            </Link>
            
            <Link to="/issues" className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:border-[#002366]/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 text-[#002366] rounded-2xl group-hover:rotate-12 transition-transform border border-slate-100">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">A/S 및 수선</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Repair Request</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">최근 업데이트 주문</h2>
            <Link to="/orders" className="text-[#002366] text-sm font-semibold flex items-center gap-1 hover:underline">
              전체 보기 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentOrders.map(order => (
              <Link 
                to={`/orders/${order.id}`} 
                key={order.id}
                className="group bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:border-[#002366]/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#002366] transition-colors line-clamp-1">{order.itemName}</h3>
                <div className="mt-4 flex items-center justify-between text-xs font-medium border-t pt-4">
                  <div className="text-slate-500">
                    <p className="text-[10px] uppercase text-slate-400 mb-0.5 font-bold">납기 예정일</p>
                    <span className="text-slate-700 font-bold">{order.ecd}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#002366] font-bold">
                    상세보기 <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#002366] rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-2xl shadow-blue-900/20">
        <div className="z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            Prestige Custom
          </div>
          <h2 className="text-2xl font-black mb-3 leading-tight tracking-tighter">장인의 손길로 완성되는<br />당신만의 주얼리</h2>
          <p className="text-blue-100 opacity-90 max-w-sm text-[11px] font-medium leading-relaxed mb-6">
            1:1 전담 디자이너와 함께 특별한 주얼리를 완성하세요.
          </p>
          <Link to="/orders/new" className="inline-flex items-center gap-3 bg-white text-[#002366] px-8 py-4 rounded-2xl font-black text-xs hover:shadow-xl transition-all active:scale-95">
            맞춤 주문하기 <PlusCircle size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs: Record<OrderStatus, { label: string, classes: string }> = {
    [OrderStatus.RECEIVED]: { label: '오더 접수됨', classes: 'bg-slate-100 text-slate-600' },
    [OrderStatus.QUOTE_PENDING]: { label: '견적 산출 중', classes: 'bg-indigo-50 text-indigo-600' },
    [OrderStatus.PAYMENT_WAITING]: { label: '결제 대기', classes: 'bg-rose-50 text-rose-600' },
    [OrderStatus.PRODUCTION]: { label: '제작 시작', classes: 'bg-blue-50 text-[#002366]' },
    [OrderStatus.INSPECTION]: { label: '품질 검수 중', classes: 'bg-amber-50 text-amber-600' },
    [OrderStatus.READY_FOR_SHIP]: { label: '배송 준비', classes: 'bg-[#002366]/10 text-[#002366]' },
    [OrderStatus.SHIPPING]: { label: '배송 진행 중', classes: 'bg-slate-100 text-slate-700' },
    [OrderStatus.COMPLETED]: { label: '최종 완료', classes: 'bg-emerald-50 text-emerald-600' },
  };

  const config = configs[status];
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase shadow-sm ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default Dashboard;
