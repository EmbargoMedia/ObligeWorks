
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, TrendingUp, AlertCircle, User, 
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Gem, Coins, Layers, Package, Clock, Info
} from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';

const AssetOverview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'valuation' | 'alerts' | 'client'>((location.state as any)?.tab || 'valuation');

  const stats = useMemo(() => {
    const brand = MOCK_INVENTORY.filter(i => i.ownership === 'BRAND');
    const alerts = MOCK_INVENTORY.filter(i => i.status !== 'SAFE' && i.ownership === 'BRAND');
    const client = MOCK_INVENTORY.filter(i => i.ownership === 'CLIENT');
    const totalValuation = brand.reduce((acc, curr) => acc + (curr.stock * curr.unitPrice), 0);

    return { totalValuation, alerts, client, brand };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/inventory')} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#002366]">통합 자산 관리 분석 리포트</h1>
          <p className="text-slate-500 font-medium">기업 실물 자산의 실시간 가치와 수급 상태를 종합 관제합니다.</p>
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm w-fit">
        {[
          { id: 'valuation', label: '자산 가치 분석', icon: TrendingUp },
          { id: 'alerts', label: '부족 자재 관제', icon: AlertCircle },
          { id: 'client', label: '고객 위탁물 관리', icon: User }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-[#002366] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'valuation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#002366]" />
                    보유 자산 카테고리별 비중 (BRAND)
                  </h3>
               </div>
               <div className="space-y-8">
                  {[
                    { label: 'METAL (Gold/Pt/Ag)', value: 185000000, color: 'bg-amber-400' },
                    { label: 'STONE (Diamonds/Organic)', value: 142000000, color: 'bg-blue-400' },
                    { label: 'READY-MADE (Final Products)', value: 45000000, color: 'bg-emerald-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                        <span className="text-sm font-black text-slate-900">₩{(item.value / 1000000).toFixed(1)}M ({(item.value / 372000000 * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.value / 372000000 * 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                <PieChart size={20} className="text-[#002366]" />
                최근 7일간 자산 가치 변동
              </h3>
              <div className="h-64 flex items-end justify-between gap-4">
                 {[422, 424, 421, 425, 428, 427, 428.5].map((val, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full bg-slate-50 rounded-t-2xl relative overflow-hidden" style={{ height: `${(val/450)*100}%` }}>
                         <div className={`absolute inset-0 ${i === 6 ? 'bg-[#002366]' : 'bg-blue-200'}`}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">06.{(7+i).toString().padStart(2,'0')}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#002366] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
               <TrendingUp size={100} className="absolute -right-4 -bottom-4 opacity-10" />
               <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2">Total Brand Asset</p>
               <h2 className="text-4xl font-black italic">₩{(stats.totalValuation / 1000000).toFixed(1)}M</h2>
               <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-60">LME 금 시세 반영</span>
                    <span className="font-bold text-emerald-400">+1.2%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-60">환율 (USD/KRW)</span>
                    <span className="font-bold">1,385.20</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
               <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Valuation Insights</h4>
               <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                    <ArrowUpRight size={16} className="text-emerald-600 shrink-0" />
                    <p className="text-[11px] text-emerald-800 font-bold leading-relaxed">국제 금 시세 상승으로 인해 보유 금속 자산의 원가 대비 가치가 ₩4.2M 상승했습니다.</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <Info size={16} className="text-amber-600 shrink-0" />
                    <p className="text-[11px] text-amber-800 font-bold leading-relaxed">주문 할당(Reserved) 물량을 제외한 실 가용 자산은 ₩285.4M 입니다.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-rose-50 rounded-[32px] p-6 border border-rose-100">
               <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Total Alerts</p>
               <h3 className="text-2xl font-black text-rose-600">{stats.alerts.length} Items</h3>
            </div>
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Out of Stock</p>
               <h3 className="text-2xl font-black text-slate-900">{stats.alerts.filter(a => a.status === 'OUT').length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Alert Item</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Current / Threshold</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {stats.alerts.map(item => (
                     <tr key={item.id} className="hover:bg-rose-50/20 transition-all">
                        <td className="px-8 py-6 font-bold text-slate-800">{item.name} <span className="text-[10px] text-slate-300 font-normal ml-2">{item.lotNumber}</span></td>
                        <td className="px-8 py-6">
                           <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase animate-pulse">{item.status}</span>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-rose-500">
                           {item.stock} / {item.threshold} <span className="text-[10px] uppercase">{item.unit}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all">긴급 발주</button>
                        </td>
                     </tr>
                   ))}
                   {stats.alerts.length === 0 && <tr><td colSpan={4} className="py-20 text-center font-bold text-slate-300 uppercase tracking-widest">No Alerts Detected</td></tr>}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'client' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
           <div className="bg-indigo-50 border border-indigo-100 rounded-[32px] p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-sm"><ShieldCheck size={28}/></div>
                 <div>
                    <h4 className="text-lg font-black text-indigo-900">고객 지참물 책임 관리 현황</h4>
                    <p className="text-sm text-indigo-700 opacity-80 font-medium">분실 및 파손 시 전액 보상 대상이며, 감정 완료 여부를 반드시 체크하십시오.</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Records</p>
                 <p className="text-3xl font-black text-indigo-900">{stats.client.length}</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.client.map(item => (
                <div key={item.id} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                         {item.category === 'METAL' ? <Coins size={24}/> : <Gem size={24}/>}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lot: {item.lotNumber}</p>
                         <h4 className="font-bold text-slate-900">{item.name}</h4>
                         <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {item.arrivalDate}</span>
                            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">감정완료</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-black text-slate-900">{item.stock} <span className="text-[10px] uppercase">{item.unit}</span></p>
                      <button className="text-[10px] font-black text-[#002366] hover:underline mt-1">상세 기록</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AssetOverview;
