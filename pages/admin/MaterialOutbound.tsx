
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Database, 
  Package, 
  User, 
  Clock, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Gem,
  Loader2,
  Zap
} from 'lucide-react';
import { MOCK_INVENTORY, MOCK_ORDERS } from '../../mockData';
import { InventoryItem, Order } from '../../types';

const MaterialOutbound: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selection States
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [amount, setAmount] = useState('');
  const [pic, setPic] = useState('');
  const [step, setStep] = useState(1);

  const [searchItem, setSearchItem] = useState('');
  const [searchOrder, setSearchOrder] = useState('');

  const filteredItems = MOCK_INVENTORY.filter(i => 
    i.name.toLowerCase().includes(searchItem.toLowerCase()) || 
    i.category.toLowerCase().includes(searchItem.toLowerCase())
  );

  const filteredOrders = MOCK_ORDERS.filter(o => 
    o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchOrder.toLowerCase())
  );

  const handleCompleteOutbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedOrder || !amount || !pic) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`${selectedItem.name} ${amount}${selectedItem.unit}이(가) ${selectedOrder.orderNumber} 공정으로 성공적으로 출고 처리되었습니다.`);
      navigate('/admin/inventory/outbound');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#002366]">자재 출고 기록 등록</h1>
          <p className="text-slate-500 font-medium">금고 자산을 공정 단계로 안전하게 반출 처리합니다.</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm mb-10">
        {[
          { s: 1, label: '자재 선택' },
          { s: 2, label: '대상 오더' },
          { s: 3, label: '상세 기록' }
        ].map((item) => (
          <div 
            key={item.s}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all ${step === item.s ? 'bg-[#002366] text-white shadow-lg' : 'text-slate-400'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${step === item.s ? 'border-white/40 bg-white/10' : 'border-slate-200 bg-slate-50'}`}>
              0{item.s}
            </span>
            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleCompleteOutbound} className="space-y-8">
        {step === 1 && (
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Database size={24} className="text-[#002366]" />
              출고할 자재 검색 및 선택
            </h2>
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="금고 내 자재명, 카테고리 검색..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/10 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto hide-scrollbar p-1">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedItem?.id === item.id ? 'border-[#002366] bg-[#002366]/5 shadow-md' : 'border-slate-50 hover:border-slate-200 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${selectedItem?.id === item.id ? 'bg-[#002366] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#002366]/10 group-hover:text-[#002366]'}`}>
                       <Database size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-500 uppercase">Stock</p>
                    <p className="text-sm font-black text-[#002366]">{item.stock.toLocaleString()} {item.unit}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-end">
              <button 
                type="button" 
                disabled={!selectedItem}
                onClick={() => setStep(2)}
                className="px-10 py-4 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#001A4D] transition-all disabled:opacity-50"
              >
                다음 단계로 <ArrowRight size={16} className="inline ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Package size={24} className="text-[#002366]" />
              투입 대상 오더 선택
            </h2>
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="오더 번호 또는 고객명 검색..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/10 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto hide-scrollbar p-1">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedOrder?.id === order.id ? 'border-[#002366] bg-[#002366]/5 shadow-md' : 'border-slate-50 hover:border-slate-200 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${selectedOrder?.id === order.id ? 'bg-[#002366] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-[#002366]/10 group-hover:text-[#002366]'}`}>
                       <Package size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.orderNumber}</p>
                      <h4 className="font-bold text-slate-800">{order.itemName}</h4>
                      <p className="text-[10px] text-[#002366] font-bold mt-0.5">고객: {order.customerName}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase">{order.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase transition-all">이전으로</button>
              <button 
                type="button" 
                disabled={!selectedOrder}
                onClick={() => setStep(3)}
                className="px-10 py-4 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#001A4D] transition-all disabled:opacity-50"
              >
                상세 정보 입력 <ArrowRight size={16} className="inline ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm animate-in slide-in-from-right-4 space-y-10">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
              최종 출고 명세 확인 및 기록
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outbound Material</p>
                 <div className="flex items-center gap-4">
                    <Gem size={32} className="text-[#002366]" />
                    <div>
                       <h4 className="text-lg font-black text-slate-900">{selectedItem?.name}</h4>
                       <p className="text-xs font-bold text-slate-500">Current Stock: {selectedItem?.stock} {selectedItem?.unit}</p>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Order</p>
                 <div className="flex items-center gap-4">
                    <ShieldCheck size={32} className="text-[#002366]" />
                    <div>
                       <h4 className="text-lg font-black text-slate-900">{selectedOrder?.orderNumber}</h4>
                       <p className="text-xs font-bold text-slate-500">{selectedOrder?.customerName} 고객님</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">출고 중량/수량 ({selectedItem?.unit})</label>
                    <div className="relative">
                       <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder={`숫자만 입력 (예: 1.5)`}
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                         required
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">반출 담당자 (PIC)</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="text" 
                         value={pic}
                         onChange={(e) => setPic(e.target.value)}
                         placeholder="담당자 성함 입력"
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                         required
                       />
                    </div>
                  </div>
               </div>
               
               <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                  <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
                  <p className="text-[11px] text-blue-900 leading-relaxed font-bold">
                    본 출고 기록은 시스템 인벤토리 DB에 즉시 반영되며, 추후 오더의 원가 분석 및 자재 추적 리포트에 공식 데이터로 활용됩니다. 담당자 확인 후 최종 반출을 승인하십시오.
                  </p>
               </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all uppercase text-xs">이전으로</button>
              <button 
                type="submit" 
                disabled={isSubmitting || !amount || !pic}
                className="flex-[2] py-5 bg-[#002366] text-white rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-blue-900/10 hover:bg-[#001A4D] uppercase text-xs tracking-widest flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {isSubmitting ? '데이터 처리 중...' : '자재 출고 승인 및 등록'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MaterialOutbound;
