
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Crown, 
  CreditCard, 
  ChevronRight, 
  Star, 
  History, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Gift,
  MoreVertical,
  X,
  Download,
  FileSpreadsheet,
  Check,
  Building,
  AlertCircle,
  Loader2,
  Ticket,
  User as UserIcon,
  Phone
} from 'lucide-react';
import { MOCK_USER } from '../mockData';

const tiers = [
  { 
    name: 'Standard', 
    color: 'text-slate-500', 
    bg: 'bg-slate-100', 
    border: 'border-slate-200',
    heroBg: 'bg-slate-600',
    accent: 'text-slate-300',
    description: 'ObligeWorks의 시작을 함께하는 모든 고객님을 위한 기본 멤버십입니다.',
    benefits: ['전 품목 1% 상시 결제 할인', '무료 기본 세척 서비스 (연 1회)', '기본 프리미엄 패키징 서비스', '뉴스레터 디자인 정보 제공'],
    requirement: '가입 시 자동 적용',
    nextTier: 'Silver',
    progress: 100
  },
  { 
    name: 'Silver', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    heroBg: 'bg-blue-600',
    accent: 'text-blue-200',
    description: '주얼리의 가치를 이해하기 시작한 실버 등급 고객님을 위한 혜택입니다.',
    benefits: ['제작 공정 우선 안내 서비스', 'A/S 공임비 5% 상시 할인', '생일 기념 3만원 바우처 발송', '신상품 런칭 사전 알림'],
    requirement: '누적 구매 200만원 이상',
    nextTier: 'Gold',
    progress: 85
  },
  { 
    name: 'Gold', 
    color: 'text-amber-500', 
    bg: 'bg-amber-50', 
    border: 'border-amber-200',
    heroBg: 'bg-amber-600',
    accent: 'text-amber-200',
    description: 'ObligeWorks의 소중한 파트너, 골드 등급 고객님께 드리는 특별한 예우입니다.',
    benefits: ['상시 5% 결제 할인 (일부 품목 제외)', '무료 택배 수거/배송 서비스', '전문 디자이너 1:1 전담 배치', '프라이빗 케어 키트 증정 (연 1회)'],
    requirement: '누적 구매 500만원 이상',
    nextTier: 'Prestige',
    progress: 60
  },
  { 
    name: 'Prestige', 
    color: 'text-[#002366]', 
    bg: 'bg-[#002366]/5', 
    border: 'border-[#002366]/20',
    heroBg: 'bg-[#002366]',
    accent: 'text-blue-300',
    description: '최상위 1%를 위한 오블리주 웍스 최고의 예우와 철학을 담았습니다.',
    benefits: ['상시 10% 결제 할인', '신작 런칭 프라이빗 뷰잉 초대', '프리미엄 픽업/딜리버리 서비스', '커스텀 보석 각인 서비스 무료', 'VVIP 전담 컨시어지 24/7'],
    requirement: '누적 구매 1,000만원 이상',
    nextTier: 'Black VIP',
    progress: 75,
    current: true
  }
];

const Membership: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tiers' | 'payment' | 'history'>('tiers');
  const [activeTier, setActiveTier] = useState(tiers[3]); 
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [mainCardIndex, setMainCardIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExcelDownloading, setIsExcelDownloading] = useState(false);
  
  // Dynamic history from localStorage
  const [payHistory, setPayHistory] = useState<any[]>([]);

  useEffect(() => {
    const localHistory = JSON.parse(localStorage.getItem('payment_history') || '[]');
    const defaultHistory = [
      { id: 'pay_001', date: '2024-05-14', title: 'JF-2024-002 결제 건', amount: '₩2,450,000', status: '승인완료' },
      { id: 'pay_002', date: '2024-04-10', title: '정기 점검 및 유상 폴리싱', amount: '₩45,000', status: '승인완료' },
    ];
    setPayHistory([...localHistory.reverse(), ...defaultHistory]);
  }, [activeTab]);

  const [receiptConfig, setReceiptConfig] = useState({
    type: 'personal' as 'personal' | 'business',
    number: MOCK_USER.phone,
    isSaving: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    usePassword: true,
    blockOverseas: false
  });

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('멤버십 등급 안내서가 성공적으로 다운로드되었습니다.');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">멤버십 & 결제 관리</h1>
          <p className="text-slate-500 font-medium">{MOCK_USER.name}님의 특별한 혜택과 결제 정보를 관리하세요.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'tiers', label: '등급 및 혜택', icon: Crown },
            { id: 'payment', label: '결제 수단', icon: CreditCard },
            { id: 'history', label: '결제 내역', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-[#002366] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'tiers' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className={`${activeTier.heroBg} rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl transition-all duration-500`}>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-6 backdrop-blur-md">
                  <Crown size={80} className={activeTier.accent} />
                </div>
                <div className="text-center">
                  <span className={`text-xs font-black uppercase tracking-[0.3em] ${activeTier.accent} mb-2 block`}>Membership Tier</span>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">{activeTier.name}</h2>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-2">{activeTier.current ? `당신은 ${activeTier.name} 등급 회원입니다.` : `${activeTier.name} 등급 혜택을 확인해보세요.`}</h3>
                  <p className="text-white/70 text-sm leading-relaxed max-w-xl">{activeTier.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className={`text-[10px] font-bold ${activeTier.accent} uppercase tracking-widest`}>Next Tier: {activeTier.nextTier}</span>
                    <span className="text-xs font-bold">{activeTier.progress}% Achieved</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${activeTier.progress}%` }}></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link to="/membership/detail" className="flex-1 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2">멤버십 실적 상세 보기 <ArrowUpRight size={16} /></Link>
                  <button onClick={handleDownloadPDF} className="flex-1 bg-white/10 text-white px-6 py-4 rounded-2xl font-black text-xs hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2">
                    {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 안내서 (PDF)
                  </button>
                </div>
              </div>
            </div>
            <Crown size={400} className="absolute -right-20 -bottom-20 text-white opacity-5 pointer-events-none -rotate-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {tiers.map((tier, idx) => (
              <div key={idx} onClick={() => setActiveTier(tier)} className={`p-8 rounded-[32px] border-2 transition-all cursor-pointer relative overflow-hidden group ${activeTier.name === tier.name ? 'border-slate-900 bg-white shadow-2xl scale-105 z-10' : 'border-slate-100 bg-white hover:border-slate-300 shadow-sm'}`}>
                {tier.current && <div className="absolute top-4 right-4"><div className="bg-emerald-50 px-2 py-0.5 rounded text-[8px] font-black uppercase text-emerald-600">내 등급</div></div>}
                <div className={`w-12 h-12 rounded-2xl ${tier.bg} flex items-center justify-center ${tier.color} mb-6 transition-transform group-hover:rotate-12`}><Crown size={24} /></div>
                <h4 className="text-lg font-black text-slate-900 mb-1">{tier.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6">{tier.requirement}</p>
                <ul className="space-y-4 mb-8">
                  {tier.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-600 font-medium"><div className={`shrink-0 ${tier.color} mt-0.5 opacity-60`}><Zap size={12} /></div><span className="truncate">{b}</span></li>
                  ))}
                </ul>
                <div className={`w-full py-3 rounded-xl border-2 transition-all text-center text-[10px] font-black uppercase ${activeTier.name === tier.name ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-100 text-slate-400'}`}>{activeTier.name === tier.name ? '선택됨' : '혜택 보기'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><CreditCard size={20} className="text-[#002366]" />등록된 결제 수단</h3>
              <div className="space-y-4">
                {[{ id: 'card1', name: 'KB국민 프리미엄', num: '4502 • • • • 9921', type: 'Mastercard' }, { id: 'card2', name: '현대카드 M2', num: '1192 • • • • 8821', type: 'VISA' }].map((card, idx) => (
                  <div key={card.id} onClick={() => setMainCardIndex(idx)} className={`p-8 rounded-[32px] transition-all cursor-pointer relative overflow-hidden group border-2 ${mainCardIndex === idx ? 'bg-[#002366] text-white shadow-xl border-[#002366]' : 'bg-white border-slate-100 hover:border-[#002366]/20'}`}>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12">
                        <div className={`p-3 rounded-xl backdrop-blur-md ${mainCardIndex === idx ? 'bg-white/20' : 'bg-slate-50 border text-slate-400'}`}><CreditCard size={24} /></div>
                        {mainCardIndex === idx && <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Main Card</span>}
                      </div>
                      <p className={`text-xl font-medium tracking-widest mb-2 ${mainCardIndex === idx ? 'text-white' : 'text-slate-900'}`}>{card.num}</p>
                      <div className="flex justify-between items-end">
                        <div><p className={`text-[9px] uppercase mb-0.5 ${mainCardIndex === idx ? 'opacity-60' : 'text-slate-400'}`}>Card Holder</p><p className={`text-sm font-bold uppercase ${mainCardIndex === idx ? 'text-white' : 'text-slate-800'}`}>{MOCK_USER.name}</p></div>
                        <span className={`text-xs font-black italic ${mainCardIndex === idx ? 'opacity-80' : 'text-blue-300'}`}>{card.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setIsAddCardOpen(true)} className="w-full py-6 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#002366] transition-all"><Plus size={24} /><span className="text-xs font-bold uppercase tracking-widest">새 카드 등록하기</span></button>
              </div>
            </section>
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-600" />보안 및 자동 설정</h3>
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-bold text-slate-800">결제 비밀번호 사용</p><p className="text-xs text-slate-400 mt-0.5">결제 시 마다 6자리 비밀번호를 확인합니다.</p></div>
                  <button onClick={() => setSecuritySettings(s => ({...s, usePassword: !s.usePassword}))} className={`w-12 h-6 rounded-full relative p-1 transition-all ${securitySettings.usePassword ? 'bg-[#002366]' : 'bg-slate-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${securitySettings.usePassword ? 'right-1' : 'left-1'}`}></div></button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><History size={20} className="text-[#002366]" />전체 결제 히스토리</h3>
              <button className="px-4 py-2 bg-[#002366] text-white rounded-xl text-xs font-bold flex items-center gap-2"><FileSpreadsheet size={16} /> 엑셀 다운로드</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-50/50 border-b"><th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">일자</th><th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">내역</th><th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">금액</th><th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">상태</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {payHistory.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#002366]/5 transition-colors group">
                      <td className="px-8 py-6 text-sm font-medium text-slate-500">{pay.date}</td>
                      <td className="px-8 py-6"><p className="text-sm font-bold text-slate-900">{pay.title}</p><p className="text-[10px] text-slate-400">ID: {pay.id}</p></td>
                      <td className="px-8 py-6 text-sm font-black text-slate-900">{pay.amount}</td>
                      <td className="px-8 py-6 text-right"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase">{pay.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
