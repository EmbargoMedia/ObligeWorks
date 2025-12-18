
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Ticket, 
  Search, 
  Info, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles,
  Zap,
  Gem,
  Plus,
  X,
  Loader2,
  Gift
} from 'lucide-react';

interface Voucher {
  id: string;
  name: string;
  amount: number;
  expiry: string;
  status: 'available' | 'used' | 'expired';
  description: string;
  type: 'PRESTIGE' | 'WELCOME' | 'PROMO';
}

const VoucherWallet: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available');
  const [isVoucherActive, setIsVoucherActive] = useState(() => {
    return localStorage.getItem('obligeworks_voucher_active') === 'true';
  });

  // Modal & Form States
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Stateful Vouchers to allow adding new ones
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: 'V-PRESTIGE-2024',
      name: '프레스티지 등급 연간 특별 바우처',
      amount: 50000,
      expiry: '2024-12-31',
      status: isVoucherActive ? 'used' : 'available',
      description: 'ObligeWorks 맞춤 주문 제작 시 즉시 사용 가능한 ₩50,000 할인권입니다.',
      type: 'PRESTIGE'
    },
    {
      id: 'V-WELCOME-001',
      name: '회원가입 환영 바우처',
      amount: 10000,
      expiry: '2024-03-01',
      status: 'used',
      description: '첫 주문 시 사용 가능한 소정의 할인권입니다.',
      type: 'WELCOME'
    },
    {
      id: 'V-PROMO-99',
      name: '여름 시즌 디자인 프로모션',
      amount: 30000,
      expiry: '2023-08-31',
      status: 'expired',
      description: '시즌 프로모션 제품 구매 시 적용 가능합니다.',
      type: 'PROMO'
    }
  ]);

  const filteredVouchers = vouchers.filter(v => {
    if (v.id === 'V-PRESTIGE-2024') {
        // Prestige voucher status sync with active state
        const currentStatus = isVoucherActive ? 'used' : 'available';
        return currentStatus === activeTab;
    }
    return v.status === activeTab;
  });

  const handleActivateVoucher = (id: string) => {
    if (id === 'V-PRESTIGE-2024') {
      if (confirm('이 바우처를 활성화하시겠습니까? 활성화 시 다음 주문 결제 단계에서 자동 적용됩니다.')) {
        localStorage.setItem('obligeworks_voucher_active', 'true');
        setIsVoucherActive(true);
      }
    } else {
        alert('이 바우처는 활성화가 필요 없는 자동 적용 또는 사용 완료된 바우처입니다.');
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsVerifying(true);

    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      
      let newVoucher: Voucher | null = null;
      const code = promoCode.toUpperCase();

      if (code === 'OBLIGE777') {
        newVoucher = {
          id: `V-PROMO-${Date.now()}`,
          name: '럭키 7 시크릿 바우처',
          amount: 70000,
          expiry: '2024-12-31',
          status: 'available',
          description: '특별 코드를 통해 지급된 럭키 7만원 할인권입니다.',
          type: 'PROMO'
        };
      } else if (code === 'WELCOME2025') {
        newVoucher = {
          id: `V-PROMO-${Date.now()}`,
          name: '2025 신년 맞이 감사 바우처',
          amount: 30000,
          expiry: '2025-02-28',
          status: 'available',
          description: '새해를 맞아 모든 고객님께 드리는 특별 선물입니다.',
          type: 'PROMO'
        };
      } else {
        alert('유효하지 않은 프로모션 코드입니다. 다시 확인해주세요.');
        return;
      }

      setVouchers(prev => [newVoucher!, ...prev]);
      setPromoCode('');
      setIsPromoModalOpen(false);
      setActiveTab('available');
      alert(`'${newVoucher.name}'가 성공적으로 등록되었습니다!`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">내 쿠폰함</h1>
            <p className="text-slate-500 font-medium">사용 가능한 바우처 및 혜택을 확인하세요.</p>
          </div>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm shrink-0">
          {[
            { id: 'available', label: '사용 가능' },
            { id: 'used', label: '사용 완료' },
            { id: 'expired', label: '기간 만료' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-[#002366] text-white shadow-lg shadow-blue-900/10' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'available' && isVoucherActive && (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">바우처가 현재 활성화되어 있습니다</p>
              <p className="text-xs text-emerald-700">다음 새 주문 제작 시 ₩50,000이 자동 할인됩니다.</p>
            </div>
          </div>
          <Link to="/orders/new" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">
            지금 주문하기
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredVouchers.length > 0 ? (
          filteredVouchers.map(voucher => (
            <div key={voucher.id} className={`relative overflow-hidden transition-all group ${voucher.status === 'available' ? 'opacity-100' : 'opacity-60 grayscale'}`}>
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row min-h-[200px]">
                <div className={`md:w-64 p-8 flex flex-col items-center justify-center text-center relative ${voucher.type === 'PRESTIGE' ? 'bg-[#002366] text-white' : voucher.type === 'PROMO' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}>
                  <div className="p-3 bg-white/20 rounded-2xl mb-4 backdrop-blur-md">
                    <Ticket size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{voucher.type} VOUCHER</span>
                  <h3 className="text-3xl font-black">₩{(voucher.amount / 10000).toLocaleString()}만</h3>
                  <p className="text-xs font-bold mt-1 opacity-80">Discount Off</p>
                  <div className="absolute right-0 top-4 bottom-4 w-px border-r-2 border-dashed border-white/30 hidden md:block"></div>
                </div>

                <div className="flex-1 p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{voucher.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md">{voucher.description}</p>
                    </div>
                    {voucher.status === 'available' && (
                      <div className="px-3 py-1 bg-blue-50 text-[#002366] rounded-lg text-[10px] font-black uppercase tracking-tight">Active Now</div>
                    )}
                  </div>
                  <div className="mt-auto pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <Clock size={14} /> 유효 기간: {voucher.expiry}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <Info size={14} /> 조건: 맞춤 제작 전용
                      </div>
                    </div>
                    {voucher.status === 'available' && (
                      <button 
                        onClick={() => handleActivateVoucher(voucher.id)}
                        disabled={isVoucherActive && voucher.id === 'V-PRESTIGE-2024'}
                        className={`px-8 py-3 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-2 ${isVoucherActive && voucher.id === 'V-PRESTIGE-2024' ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-[#002366] text-white hover:bg-[#001A4D] shadow-blue-900/10'}`}
                      >
                        {isVoucherActive && voucher.id === 'V-PRESTIGE-2024' ? <>활성화됨 <CheckCircle2 size={16} /></> : <>사용하기 (활성화) <ArrowRight size={16} /></>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[40px] py-24 text-center border border-dashed border-slate-200">
            <Ticket size={64} className="mx-auto text-slate-100 mb-6" />
            <p className="text-slate-400 font-bold">해당 내역의 바우처가 없습니다.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-[#002366] rounded-[40px] p-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl shadow-blue-900/20">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 group-hover:rotate-6 transition-transform">
              <Zap size={24} className="text-blue-300" />
            </div>
            <h3 className="text-xl font-black mb-2">프리미엄 포인트 혜택</h3>
            <div className="mb-8">
              <p className="text-sm text-blue-100/60 leading-relaxed italic">홍길동님은 현재 <span className="text-blue-300 font-black not-italic text-lg">124,500 P</span>를 보유 중입니다.</p>
              <p className="text-[11px] text-blue-300/80 mt-3 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-blue-300" /> 
                주문 금액의 1% 상시 적립 및 즉시 사용 가능
              </p>
            </div>
            <Link to="/membership/detail" className="w-full flex items-center justify-between px-6 py-4 bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 group/btn">
              포인트 상세 내역 분석 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Zap size={180} className="absolute -right-10 -bottom-10 text-blue-500 opacity-10 pointer-events-none" />
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 p-10 group shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-slate-50 text-[#002366] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-100">
                <Gem size={24} className="text-[#002366]" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">특별 프로모션 코드</h3>
            <p className="text-sm text-slate-500 leading-relaxed">지인 추천이나 이벤트 당첨을 통해 받은 프로모션 코드가 있다면 지금 등록하고 혜택을 받으세요.</p>
          </div>
          <button 
            onClick={() => setIsPromoModalOpen(true)}
            className="mt-8 flex items-center justify-center gap-2 px-6 py-4 bg-[#002366] text-white rounded-2xl text-xs font-black hover:bg-[#001A4D] transition-all active:scale-95 shadow-lg shadow-blue-900/10"
          >
            <Plus size={16} /> 코드 등록하기
          </button>
        </div>
      </div>

      {/* Promo Code Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 text-[#002366] rounded-xl border border-slate-100">
                            <Gift size={24} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">프로모션 코드 등록</h2>
                    </div>
                    <button onClick={() => setIsPromoModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handlePromoSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CODE NUMBER</label>
                        <input 
                            type="text" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="영문, 숫자 조합 코드를 입력하세요" 
                            className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-2xl font-bold outline-none transition-all placeholder:text-slate-300 uppercase tracking-wider"
                            required
                        />
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                        <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                            등록하신 코드는 즉시 바우처로 전환되어 쿠폰함에 보관됩니다. (테스트 코드: OBLIGE777)
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsPromoModalOpen(false)}
                            className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                        >
                            취소
                        </button>
                        <button 
                            type="submit" 
                            disabled={isVerifying || !promoCode}
                            className="flex-[2] py-4 bg-[#002366] text-white rounded-2xl font-bold hover:bg-[#001A4D] transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            {isVerifying ? '코드 검증 중...' : '등록 완료'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default VoucherWallet;
