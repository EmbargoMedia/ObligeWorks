
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Database, 
  ChevronRight, Clock, ArrowUpRight, BarChart3, Hammer, ShieldCheck, Wallet, BellRing, Settings2
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_INVENTORY, MOCK_ISSUES } from '../../mockData';
import { OrderStatus } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const totalOrders = MOCK_ORDERS.length;
  const productionOrders = MOCK_ORDERS.filter(o => o.status === OrderStatus.PRODUCTION).length;
  const lowStockItems = MOCK_INVENTORY.filter(i => i.status !== 'SAFE').length;
  const openIssues = MOCK_ISSUES.filter(i => i.status !== 'RESOLVED').length;

  const stats = [
    { 
      label: '전체 오더 현황', 
      value: totalOrders, 
      icon: BarChart3, 
      color: 'text-[#002366]', 
      bg: 'bg-blue-50',
      path: '/' 
    },
    { 
      label: '현재 제작 진행중', 
      value: productionOrders, 
      icon: Hammer, 
      color: 'text-[#002366]', 
      bg: 'bg-blue-50',
      path: '/'
    },
    { 
      label: '자재 재고 부족', 
      value: lowStockItems, 
      icon: Database, 
      color: 'text-[#002366]', 
      bg: 'bg-blue-50',
      path: '/admin/inventory'
    },
    { 
      label: 'A/S 기술 티켓', 
      value: openIssues, 
      icon: Settings2, 
      color: 'text-[#002366]', 
      bg: 'bg-blue-50',
      path: '/admin/issues'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Control Center</h1>
          <p className="text-slate-500 font-medium">오블리주 웍스 실시간 운영 관제 시스템입니다.</p>
        </div>
        <div className="bg-[#002366] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-300" /> Authorized Business Partner
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(stat.path)}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-center justify-end gap-2">
                  <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                  <ChevronRight size={16} className="text-slate-200 group-hover:text-[#002366] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Clock size={24} className="text-[#002366]" />
              긴급 공정 관제 리스트
            </h2>
          </div>
          <div className="space-y-4">
            {MOCK_ORDERS.slice(0, 3).map(order => (
              <div 
                key={order.id} 
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex items-center justify-between p-7 bg-slate-50 rounded-[32px] group hover:bg-white hover:shadow-xl hover:ring-2 hover:ring-blue-50 transition-all cursor-pointer border border-transparent"
              >
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-white border flex items-center justify-center text-[#002366] font-black text-xs shadow-sm">
                     {order.orderNumber.split('-').pop()}
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{order.orderNumber} • {order.customerName}</p>
                     <h4 className="font-bold text-slate-900 group-hover:text-[#002366] transition-colors">{order.itemName}</h4>
                   </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-rose-500 block mb-1 uppercase tracking-widest">ECD: {order.ecd}</span>
                  <span className="px-3 py-1 bg-[#002366] text-white rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-sm">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#002366] rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black flex items-center gap-3 text-blue-200">
                <BellRing size={24} /> 기업용 알림 피드
              </h2>
              <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse">Critical</span>
            </div>
            <div className="space-y-6">
              <div 
                onClick={() => {}}
                className="p-7 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Financial Status</p>
                  <ArrowUpRight size={14} className="text-blue-300/40 group-hover:text-blue-300 transition-colors" />
                </div>
                <p className="text-sm font-bold leading-relaxed text-white/90">총 4건의 오더가 '결제 대기' 상태입니다. 공식 제안서 발송 및 결제 독려가 필요합니다.</p>
              </div>

              <div 
                onClick={() => navigate('/admin/inventory', { state: { filter: 'LOW_STOCK' } })}
                className="p-7 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Supply Chain Alert</p>
                  <ArrowUpRight size={14} className="text-blue-300/40 group-hover:text-blue-300 transition-colors" />
                </div>
                <p className="text-sm font-bold leading-relaxed text-white/90">메인 공정용 0.5ct 다이아몬드 재고가 2개 미만입니다. 긴급 발주를 검토하십시오.</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin/inventory')}
            className="mt-10 w-full py-5 bg-white text-[#002366] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl relative z-10 flex items-center justify-center gap-2"
          >
            전역 관제 상세 보기 <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
