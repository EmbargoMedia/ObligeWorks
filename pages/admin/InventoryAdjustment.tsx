
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Search, Database, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';

const InventoryAdjustment: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [reason, setReason] = useState('');

  const filtered = MOCK_INVENTORY.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdjust = () => {
    if(!selectedItem || !adjustAmount || !reason) return;
    alert(`${selectedItem.name}의 재고가 ${adjustAmount}${selectedItem.unit}으로 조정되었습니다.\n사유: ${reason}`);
    navigate('/admin/inventory');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#002366]">재고 실사 및 조정 (Adjustment)</h1>
          <p className="text-slate-500 font-medium">전산 재고와 실물 재고 사이의 오차를 수정합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm h-fit">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="조정할 품목 검색..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none"
              />
           </div>
           <div className="space-y-2 max-h-96 overflow-y-auto pr-2 hide-scrollbar">
              {filtered.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id ? 'border-[#002366] bg-[#002366]/5' : 'border-transparent hover:border-slate-100'}`}
                >
                   <div>
                      <p className="text-xs font-black text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400">현재고: {item.stock} {item.unit}</p>
                   </div>
                   {/* Fix: Property 'isClientProvided' does not exist on type 'InventoryItem'. Use ownership check instead. */}
                   {item.ownership === 'CLIENT' && <span className="text-[8px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded uppercase font-bold">Client</span>}
                </div>
              ))}
           </div>
        </div>

        {selectedItem && (
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm animate-in slide-in-from-right-4 space-y-8">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-[#002366] rounded-xl"><RotateCcw size={24}/></div>
                <h3 className="text-xl font-black">수치 조정 실행</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">조정 후 수량 ({selectedItem.unit})</label>
                   <input 
                    type="number" 
                    value={adjustAmount}
                    onChange={e => setAdjustAmount(e.target.value)}
                    placeholder={`예: ${selectedItem.stock}`}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/10"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">조정 사유</label>
                   <select 
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/10"
                   >
                      <option value="">사유 선택</option>
                      <option value="LOST">실사 분실 (Inventory Loss)</option>
                      <option value="DAMAGED">파손/변형 (Damaged)</option>
                      <option value="ERROR">전산 기입 오류 (Data Entry Error)</option>
                      <option value="DONATION">증정/기타 (Other)</option>
                   </select>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                   <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                   <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                     재고 조정은 마스터 마스터 감사 로그에 기록되며, 취소가 불가능합니다. 실물 확인 후 신중히 입력하십시오.
                   </p>
                </div>

                <button 
                  onClick={handleAdjust}
                  className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#001A4D] transition-all flex items-center justify-center gap-3"
                >
                   <ShieldCheck size={18} /> 조정 내역 확정
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryAdjustment;
