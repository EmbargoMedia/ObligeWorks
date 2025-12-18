
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, ArrowUpRight, PieChart, BarChart3, Wallet, Download, Calendar } from 'lucide-react';

const AssetValuation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#002366]">총 자산 가치 상세 분석</h1>
          <p className="text-slate-500 font-medium">보유 원자재 및 완제품의 시세 기준 밸류에이션 리포트입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#002366]" />
                월별 자산 가치 변동 추이
              </h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase">Last 6 Months</button>
                 <button className="p-2 bg-slate-50 text-[#002366] rounded-xl"><Download size={16}/></button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 px-4 relative border-b border-slate-100 pb-4">
              {[320, 350, 310, 380, 410, 428.5].map((val, i) => (
                <div key={i} className="flex-1 group flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-50 rounded-t-2xl relative overflow-hidden" style={{ height: `${(val/500)*100}%` }}>
                    <div className={`absolute inset-0 transition-all duration-1000 ${i === 5 ? 'bg-[#002366]' : 'bg-blue-200'}`}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 font-bold text-center">Unit: Million KRW (LME/Rapaport Real-time base)</p>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm overflow-hidden">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
              <BarChart3 size={20} className="text-[#002366]" />
              카테고리별 자산 구성비
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Gold (14K/18K/24K)', value: '₩185,200,000', percentage: 43, color: 'bg-amber-400' },
                { label: 'Diamond (0.1ct ~ 2ct)', value: '₩142,800,000', percentage: 33, color: 'bg-blue-400' },
                { label: 'Platinum / Silver', value: '₩56,500,000', percentage: 13, color: 'bg-slate-400' },
                { label: 'Colored Stones / Pearls', value: '₩44,000,000', percentage: 11, color: 'bg-rose-400' },
              ].map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                    <span className="text-sm font-black text-[#002366]">{cat.value} ({cat.percentage}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} transition-all duration-1000`} style={{ width: `${cat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#002366] text-white rounded-[40px] p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
               <Wallet size={32} className="text-blue-300 mb-6" />
               <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Real-time Valuation</p>
               <h2 className="text-4xl font-black italic mb-10">₩428.5M</h2>
               <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-xs opacity-60">LME Gold Fix</span>
                    <span className="text-xs font-bold text-emerald-400">+1.2%</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-xs opacity-60">Diamond Index</span>
                    <span className="text-xs font-bold">-0.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs opacity-60">FX (USD/KRW)</span>
                    <span className="text-xs font-bold">1,385.20</span>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-[#002366]" />
              재평가 이력
            </h3>
            <div className="space-y-4">
               {[
                 { date: '2024.06.12', label: 'LME 시세 자동 동기화', diff: '+ ₩4,200k' },
                 { date: '2024.06.10', label: '신규 다이아몬드 로트 입고', diff: '+ ₩12,500k' },
                 { date: '2024.06.05', label: '생산 공정 대량 출고', diff: '- ₩8,900k' },
               ].map((log, i) => (
                 <div key={i} className="flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                       <p className="font-bold text-slate-800">{log.label}</p>
                       <p className="text-slate-400 font-medium">{log.date}</p>
                    </div>
                    <span className={`font-black ${log.diff.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{log.diff}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetValuation;
