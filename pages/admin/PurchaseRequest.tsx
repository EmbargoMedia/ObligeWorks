
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Added AlertCircle to the imported icons from lucide-react
import { ChevronLeft, ShoppingCart, Send, Database, Search, Plus, Trash2, Loader2, Package, AlertCircle } from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';

const PurchaseRequest: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fix: Property 'isClientProvided' does not exist on type 'InventoryItem'. Use ownership check instead.
  const lowStockItems = MOCK_INVENTORY.filter(i => i.ownership !== 'CLIENT' && i.status !== 'SAFE');
  
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const addToCart = (item: any) => {
    if (selectedItems.find(i => i.id === item.id)) return;
    setSelectedItems([...selectedItems, { ...item, orderAmount: item.threshold * 2 }]);
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('공식 발주서가 파트너사로 전송되었습니다.');
      navigate('/admin/inventory');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#002366]">자재 발주 요청 (Procurement)</h1>
          <p className="text-slate-500 font-medium">재고 부족 품목을 파악하고 신규 공급을 요청합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm overflow-hidden">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <AlertCircle size={20} className="text-rose-500" />
                재고 보충 권장 품목
             </h3>
             <div className="space-y-3">
                {lowStockItems.map(item => (
                  <div key={item.id} className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm text-[#002366]">
                           <Database size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">{item.category} • {item.subCategory}</p>
                           <h4 className="font-bold text-slate-800">{item.name}</h4>
                           <p className="text-xs text-rose-500 font-bold mt-0.5">현재: {item.stock} {item.unit} (임계치: {item.threshold})</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => addToCart(item)}
                        className="p-3 bg-white border border-slate-200 text-[#002366] rounded-xl hover:bg-[#002366] hover:text-white transition-all shadow-sm"
                     >
                        <Plus size={20} />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#002366] text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <ShoppingCart size={32} className="text-blue-300 mb-6" />
                 <h3 className="text-xl font-black mb-8 italic uppercase tracking-widest">Order Draft</h3>
                 
                 <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-8 hide-scrollbar">
                    {selectedItems.map((item, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center animate-in slide-in-from-right-2">
                         <div>
                            <p className="text-[10px] font-black text-blue-300">{item.name}</p>
                            <p className="text-sm font-bold">Qty: {item.orderAmount} {item.unit}</p>
                         </div>
                         <button 
                          onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}
                          className="text-white/30 hover:text-rose-400"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                    ))}
                    {selectedItems.length === 0 && <p className="text-center py-10 text-xs text-blue-200/40 font-bold italic">No items selected</p>}
                 </div>

                 <button 
                    onClick={handleRequest}
                    disabled={isSubmitting || selectedItems.length === 0}
                    className="w-full py-5 bg-white text-[#002366] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    발주 요청 전송
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequest;
