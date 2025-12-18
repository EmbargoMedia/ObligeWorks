
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Database, Gem, Clock, User, Package, ArrowRight, ArrowUpRight, Search, Plus } from 'lucide-react';

const DailyOutbound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#002366]">당일 원석 출고 상세 로그</h1>
            <p className="text-slate-500 font-medium">보관 금고에서 공정 단계로 이동된 원석의 실시간 추적 내역입니다.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/admin/inventory/outbound/new')}
            className="flex items-center gap-2 bg-[#002366] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#001A4D] transition-all active:scale-95"
          >
            <Plus size={18} /> 출고 기록 등록
          </button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="자재 ID, 품목명 검색..."
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#002366]/10 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-[#002366]/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#002366]" />
              <h3 className="font-bold text-slate-800">금일 출고 타임라인 (2024.06.13)</h3>
           </div>
           <span className="text-[10px] font-black text-[#002366] uppercase tracking-widest">총 24건 출고 완료</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">출고 시간</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">자재 식별자</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">원석 종류</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">중량/수량</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">이동 목적지 (오더)</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">담당자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { time: '14:25:01', id: 'D-00921', type: 'Natural Diamond', spec: '0.51ct / F / SI1', order: 'JF-2024-001', pic: '김철수', color: 'text-blue-500' },
                { time: '13:10:44', id: 'S-88122', type: 'Royal Sapphire', spec: '2.10ct / Oval', order: 'JF-2024-042', pic: '이영희', color: 'text-indigo-500' },
                { time: '11:05:12', id: 'M-1120', type: 'Melee Diamond', spec: '12 pcs / 1.3mm', order: 'JF-2024-015', pic: '김철수', color: 'text-slate-400' },
                { time: '09:40:55', id: 'E-4402', type: 'Zambian Emerald', spec: '1.45ct / Rect', order: 'JF-2024-099', pic: '박지성', color: 'text-emerald-500' },
                { time: '09:15:30', id: 'D-00918', type: 'Lab Diamond', spec: '1.02ct / E / VS1', order: 'JF-2024-008', pic: '이영희', color: 'text-blue-400' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition-all group">
                   <td className="px-8 py-6 text-sm font-black text-slate-900 italic tracking-tighter">{item.time}</td>
                   <td className="px-8 py-6 text-[11px] font-black text-[#002366] uppercase">{item.id}</td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Gem size={14} className={item.color} />
                        <span className="text-sm font-bold text-slate-700">{item.type}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-sm font-medium text-slate-500">{item.spec}</td>
                   <td className="px-8 py-6">
                      <div 
                        onClick={() => navigate('/admin/orders')}
                        className="flex items-center gap-2 text-[11px] font-black text-[#002366] cursor-pointer hover:underline group-hover:translate-x-1 transition-all"
                      >
                         {item.order} <ArrowUpRight size={12} />
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                         <User size={14} className="text-slate-300" />
                         {item.pic}
                      </div>
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

export default DailyOutbound;
