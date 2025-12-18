
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Add missing Loader2 import from lucide-react
import { ChevronLeft, ShoppingCart, Database, AlertCircle, CheckCircle2, XCircle, Package, Send, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';

const BulkOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const lowStockItems = MOCK_INVENTORY.filter(i => i.status !== 'SAFE');
  const [selectedItems, setSelectedItems] = useState<string[]>(lowStockItems.map(i => i.id));
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleExecuteBulkOrder = () => {
    if (selectedItems.length === 0) return alert('발주할 품목을 선택해주세요.');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`${selectedItems.length}개 품목에 대한 공식 발주서 작성이 완료되어 파트너사로 전송되었습니다.`);
      navigate('/admin/inventory');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#002366]">일괄 발주 요청 관리</h1>
            <p className="text-slate-500 font-medium">부족하거나 품절된 자재에 대해 파트너사에 공식 발주서를 발송합니다.</p>
          </div>
        </div>
        <div className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-rose-100">
          <AlertCircle size={14} /> Critical Stock Level: {lowStockItems.length} Items
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">발주 대상 품목 리스트</h3>
                <button 
                  onClick={() => setSelectedItems(selectedItems.length === lowStockItems.length ? [] : lowStockItems.map(i => i.id))}
                  className="text-xs font-black text-[#002366] hover:underline"
                >
                  {selectedItems.length === lowStockItems.length ? '전체 해제' : '전체 선택'}
                </button>
             </div>
             <div className="divide-y divide-slate-50">
                {lowStockItems.map((item) => (
                  <div key={item.id} className={`p-8 flex items-center justify-between transition-all ${selectedItems.includes(item.id) ? 'bg-blue-50/30' : ''}`}>
                     <div className="flex items-center gap-6">
                        <button 
                          onClick={() => toggleSelect(item.id)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedItems.includes(item.id) ? 'bg-[#002366] border-[#002366] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200'}`}
                        >
                           {selectedItems.includes(item.id) && <CheckCircle2 size={14} />}
                        </button>
                        <div className={`p-3 rounded-2xl bg-white border shadow-sm ${item.status === 'OUT' ? 'text-rose-500' : 'text-amber-500'}`}>
                           <Database size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{item.category} • ID: {item.id}</p>
                           <h4 className="font-bold text-slate-900">{item.name}</h4>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-rose-500 uppercase mb-1">Stock: {item.stock} {item.unit}</p>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${item.status === 'OUT' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                           {item.status === 'OUT' ? '품절 (Out of stock)' : '부족 (Low stock)'}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#002366] text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <ShoppingCart size={32} className="text-blue-300 mb-6" />
                 <h3 className="text-xl font-black mb-10 italic">ORDER EXECUTION</h3>
                 
                 <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center text-xs">
                       <span className="opacity-60">선택된 발주 품목</span>
                       <span className="font-black">{selectedItems.length} UNITS</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="opacity-60">예상 입고 소요일</span>
                       <span className="font-black text-amber-400">3~5 Working Days</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="opacity-60">파트너 통보 방식</span>
                       <span className="font-black">ERP Webhook / Email</span>
                    </div>
                 </div>

                 <button 
                  onClick={handleExecuteBulkOrder}
                  disabled={isProcessing || selectedItems.length === 0}
                  className="w-full py-5 bg-white text-[#002366] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {isProcessing ? 'Processing Order...' : '일괄 발주 요청 실행'}
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2.5 bg-slate-50 text-[#002366] rounded-xl"><FileText size={18}/></div>
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">최근 발주 내역</h3>
              </div>
              <div className="space-y-4">
                 {[
                   { partner: 'LME Metal Partner', items: 3, date: '2024.06.10', status: '입고중' },
                   { partner: 'Antwerp Stone Co.', items: 12, date: '2024.06.05', status: '완료' },
                 ].map((log, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-blue-50 transition-all">
                      <div className="space-y-1">
                         <p className="text-xs font-black text-slate-800">{log.partner}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{log.date} • {log.items} Items</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-[#002366]" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderManagement;
