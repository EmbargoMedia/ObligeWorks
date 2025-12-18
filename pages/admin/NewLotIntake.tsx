
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Database, PlusCircle, ShieldCheck, 
  User, Box, Coins, Gem, Scale, Hash, 
  Wallet, Calendar, CheckCircle2, AlertTriangle, Loader2,
  Package, Truck, ArrowRight
} from 'lucide-react';
import { OwnershipType } from '../../types';

const NewLotIntake: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    ownership: 'BRAND' as OwnershipType,
    category: 'METAL' as 'METAL' | 'STONE',
    subCategory: '',
    name: '',
    stock: '',
    unit: 'g',
    threshold: '',
    unitPrice: '',
    supplier: '',
    note: ''
  });

  const [lotNumber] = useState(`L${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(Math.random() * 900) + 100}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`신규 로트 [${lotNumber}] 가 성공적으로 DB에 등록되었습니다.`);
      navigate('/admin/inventory');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/inventory')} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#002366]">신규 자재 로트 입고 (New Lot Intake)</h1>
          <p className="text-slate-500 font-medium">개별 입고 단위별 자산 식별 정보 및 취득 가액을 기록합니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b bg-slate-50/50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-[#002366] text-white rounded-2xl shadow-lg"><PlusCircle size={28}/></div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automatic Batch Identity</p>
                 <h2 className="text-xl font-black text-[#002366] tracking-tighter">LOT NO: {lotNumber}</h2>
              </div>
           </div>
           <div className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
              시스템 자동 채번 완료
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-12">
          {/* Section 1: Ownership & Category */}
          <section className="space-y-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
               <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
               소유권 및 자산 분류 (Ownership & Category)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">자산 소유 주체</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  {(['BRAND', 'WORKSHOP', 'CLIENT'] as OwnershipType[]).map(o => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, ownership: o }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.ownership === o ? 'bg-[#002366] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">자재 대분류</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  {(['METAL', 'STONE'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: c, unit: c === 'METAL' ? 'g' : 'pcs' }))}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.category === c ? 'bg-[#002366] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {c === 'METAL' ? <span className="flex items-center justify-center gap-2"><Coins size={14}/> METAL</span> : <span className="flex items-center justify-center gap-2"><Gem size={14}/> STONE</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Detailed Specs */}
          <section className="space-y-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
               <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
               자재 상세 식별 정보 (Material Identity)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">품목 세부 명칭</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="예: 18K Yellow Gold Grain / 0.5ct GIA Diamond"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">공급처 / 출처</label>
                  <input 
                    type="text" name="supplier" value={formData.supplier} onChange={handleInputChange}
                    placeholder="예: LME 공식 파트너사 / 홍길동 고객 지참"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                  />
               </div>
               <div className="grid grid-cols-3 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">입고 수량/중량</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number" name="stock" value={formData.stock} onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">단위</label>
                    <select 
                      name="unit" value={formData.unit} onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all appearance-none"
                    >
                      <option value="g">그램 (g)</option>
                      <option value="pcs">피스 (pcs)</option>
                      <option value="ct">캐럿 (ct)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">부족 임계치 (Alert)</label>
                    <input 
                      type="number" name="threshold" value={formData.threshold} onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                    />
                  </div>
               </div>
            </div>
          </section>

          {/* Section 3: Financials */}
          <section className="space-y-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
               <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
               자산 취득 정보 (Financial Valuation)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">취득 단가 (Unit Price - KRW)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="number" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange}
                      placeholder="0"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all"
                      disabled={formData.ownership === 'CLIENT'}
                    />
                  </div>
                  {formData.ownership === 'CLIENT' && <p className="text-[10px] text-indigo-500 font-bold ml-1">고객 지참물은 취득 단가 0원으로 기록됩니다.</p>}
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">입고 특이사항</label>
                  <textarea 
                    name="note" value={formData.note} onChange={handleInputChange}
                    placeholder="자재의 보관 금고 위치, 감정서 유무 등 기록..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all h-[56px] resize-none"
                  />
               </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-[32px] flex items-start gap-4">
               <ShieldCheck size={24} className="text-[#002366] mt-1 shrink-0" />
               <p className="text-[11px] text-blue-900 font-bold leading-relaxed">
                 본 입고 정보는 마스터 감사 로그에 기록되며 등록 후에는 로트 번호와 입고 단가를 임의로 수정할 수 없습니다. 
                 실물 계량 오차 및 자재 순도를 반드시 확인한 후 승인하십시오.
               </p>
            </div>
          </section>

          <div className="pt-8 flex gap-4">
             <button type="button" onClick={() => navigate(-1)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-3xl font-black uppercase text-xs hover:bg-slate-100 transition-all">입고 취소</button>
             <button 
                type="submit" 
                disabled={isSubmitting || !formData.name || !formData.stock}
                className="flex-[2] py-5 bg-[#002366] text-white rounded-3xl font-black uppercase text-xs shadow-xl shadow-blue-900/20 hover:bg-[#001A4D] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Package size={18} />}
                신규 자재 로트 입고 승인
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewLotIntake;
