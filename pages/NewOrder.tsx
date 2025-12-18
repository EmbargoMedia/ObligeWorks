
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ImageIcon, 
  Trash2, 
  Gem,
  CircleDot,
  Sparkles,
  Award,
  Disc,
  Grid2X2,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Scale,
  Hash,
  Scissors,
  Layers,
  Heart,
  Square,
  Pentagon,
  Minus,
  Plus,
  ShieldCheck,
  Upload,
  Building2,
  Wallet,
  Zap,
  Search,
  // Added Loader2 to fix "Cannot find name 'Loader2'" error
  Loader2
} from 'lucide-react';
import { Order, OrderStatus, ProcessStatus, MaterialStatus, MaterialSource } from '../types';
import { MOCK_USER } from '../mockData';

const categories = [
  { id: 'ring', label: '반지', icon: CircleDot },
  { id: 'necklace', label: '목걸이', icon: Sparkles },
  { id: 'earring', label: '귀걸이', icon: Gem },
  { id: 'bracelet', label: '팔찌', icon: (props: any) => <Disc {...props} /> },
  { id: 'brooch', label: '브로치/핀', icon: Award },
  { id: 'pendant', label: '펜던트', icon: Disc },
  { id: 'cufflinks', label: '커프스 링크', icon: Grid2X2 },
];

const stoneList = {
  diamond: [
    { id: 'natural_white', label: '천연 다이아몬드 (White)', group: 'Natural' },
    { id: 'natural_fancy', label: '천연 팬시 컬러 다이아몬드', group: 'Natural' },
    { id: 'lab_white', label: '랩그로운 다이아몬드 (White)', group: 'Lab' },
    { id: 'lab_fancy', label: '랩그로운 컬러 다이아몬드', group: 'Lab' },
    { id: 'moissanite', label: '모이사나이트 (Moissanite)', group: 'Simulant' },
  ],
  colored: [
    { id: 'ruby', label: '루비 (Ruby)', group: 'Precious' },
    { id: 'sapphire_blue', label: '블루 사파이어 (Blue Sapphire)', group: 'Precious' },
    { id: 'sapphire_pink', label: '핑크 사파이어 (Pink Sapphire)', group: 'Precious' },
    { id: 'sapphire_yellow', label: '옐로우 사파이어 (Yellow Sapphire)', group: 'Precious' },
    { id: 'emerald', label: '에메랄드 (Emerald)', group: 'Precious' },
    { id: 'alexandrite', label: '알렉산드라이트 (Alexandrite)', group: 'Rare' },
    { id: 'tanzanite', label: '탄자나이트 (Tanzanite)', group: 'Rare' },
    { id: 'paraiba', label: '파라이바 투어말린 (Paraiba)', group: 'Rare' },
    { id: 'spinel', label: '스피넬 (Spinel)', group: 'Popular' },
    { id: 'tsavorite', label: '차보라이트 (Tsavorite)', group: 'Popular' },
    { id: 'morganite', label: '모거나이트 (Morganite)', group: 'Popular' },
    { id: 'aquamarine', label: '아쿠아마린 (Aquamarine)', group: 'Popular' },
    { id: 'topaz_london', label: '런던 블루 토파즈', group: 'Semi' },
    { id: 'topaz_swiss', label: '스위스 블루 토파즈', group: 'Semi' },
    { id: 'amethyst', label: '자수정 (Amethyst)', group: 'Semi' },
    { id: 'citrine', label: '황수정 (Citrine)', group: 'Semi' },
    { id: 'peridot', label: '페리도트 (Peridot)', group: 'Semi' },
    { id: 'opal_white', label: '화이트 오팔 (Opal)', group: 'Opal' },
    { id: 'opal_black', label: '블랙 오팔 (Black Opal)', group: 'Opal' },
    { id: 'tourmaline_multi', label: '멀티 컬러 투어말린', group: 'Popular' },
  ],
  organic: [
    { id: 'pearl_akoya', label: '아코야 진주 (Akoya)', group: 'Pearl' },
    { id: 'pearl_southsea', label: '남양 진주 (South Sea)', group: 'Pearl' },
    { id: 'pearl_tahitian', label: '타히티 흑진주 (Tahitian)', group: 'Pearl' },
    { id: 'pearl_fresh', label: '담수 진주 (Freshwater)', group: 'Pearl' },
    { id: 'pearl_mabe', label: '마베 진주 (Mabe)', group: 'Pearl' },
    { id: 'coral_red', label: '적산호 (Red Coral)', group: 'Others' },
    { id: 'amber', label: '호박 (Amber)', group: 'Others' },
    { id: 'mother_of_pearl', label: '자개 (Mother of Pearl)', group: 'Others' },
  ]
};

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [workshopName, setWorkshopName] = useState('');
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [isExpress, setIsExpress] = useState(false);
  
  const [metalCategory, setMetalCategory] = useState<'gold' | 'platinum' | 'silver' | ''>('');
  const [metalPurity, setMetalPurity] = useState('');
  const [metalSource, setMetalSource] = useState<MaterialSource>('WORKSHOP');
  const [stoneCategory, setStoneCategory] = useState<'diamond' | 'colored' | 'organic' | 'none' | ''>('');
  const [stoneType, setStoneType] = useState('');
  const [stoneSource, setStoneSource] = useState<MaterialSource>('WORKSHOP');
  const [stoneCount, setStoneCount] = useState(1);
  const [stoneSearch, setStoneSearch] = useState('');

  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = 5 - photos.length;
      Array.from(files).slice(0, remainingSlots).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setPhotos(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    const newOrder: Order = {
      id: `custom-${Date.now()}`,
      orderNumber: `JF-2024-C${Math.floor(Math.random() * 900) + 100}`,
      customerName: MOCK_USER.name,
      workshopName: workshopName || '미지정 공방',
      itemName: itemName || `${categories.find(c => c.id === selectedCategory)?.label} 맞춤 제작`,
      status: OrderStatus.RECEIVED,
      ecd: '상담 후 확정',
      lastUpdate: `${formattedDate} 10:00`,
      quantity: 1,
      options: `${metalPurity}${stoneType ? `, ${stoneType}(${stoneCount}pcs)` : ''}`,
      paymentStatus: '결제대기',
      estimatedBudget,
      isExpress,
      isDesignVerified: false,
      materials: [
        { id: `m1`, type: '금속', spec: metalPurity, status: MaterialStatus.SECURING, source: metalSource },
        { id: `m2`, type: '원석', spec: stoneType, status: MaterialStatus.SECURING, source: stoneSource }
      ],
      timeline: [{ name: '의뢰 접수', status: ProcessStatus.COMPLETED, updatedAt: formattedDate, comment: '주문 의뢰가 성공적으로 접수되었습니다.' }],
      attachments: photos
    };

    const existing = JSON.parse(localStorage.getItem('user_orders') || '[]');
    localStorage.setItem('user_orders', JSON.stringify([newOrder, ...existing]));
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/', { state: { newOrderAdded: true } });
    }, 1500);
  };

  const renderStoneGrid = (type: 'diamond' | 'colored' | 'organic') => {
    const list = stoneList[type].filter(s => s.label.toLowerCase().includes(stoneSearch.toLowerCase()));
    const groups = Array.from(new Set(list.map(s => s.group)));

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="보석 종류 검색..." 
            value={stoneSearch}
            onChange={(e) => setStoneSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#002366]/10"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-8 hide-scrollbar">
          {groups.map(group => (
            <div key={group}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{group}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {list.filter(s => s.group === group).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStoneType(s.label)}
                    className={`px-4 py-3.5 rounded-xl border-2 text-left text-xs font-bold transition-all ${
                      stoneType === s.label ? 'border-[#002366] bg-[#002366]/5 text-[#002366]' : 'border-slate-50 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">새 주문 제작 의뢰</h1>
          <p className="text-slate-500 font-medium">홍길동님만의 고유한 주얼리 디자인을 시작합니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm animate-in slide-in-from-right-4 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Building2 size={24} className="text-[#002366]" /> 의뢰 정보
                </h2>
                <button type="button" onClick={() => setIsExpress(!isExpress)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isExpress ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                  <Zap size={14} className="inline mr-1" /> Express
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">의뢰 공방</label>
                  <input type="text" value={workshopName} onChange={e => setWorkshopName(e.target.value)} placeholder="예: 오블리주 아틀리에 청담" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#002366]/10 font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">희망 예산 (KRW)</label>
                  <input type="text" value={estimatedBudget} onChange={e => setEstimatedBudget(e.target.value)} placeholder="예: 5,000,000" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#002366]/10 font-bold" />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">제작 품목 선택</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => setSelectedCategory(cat.id)} className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-4 transition-all ${selectedCategory === cat.id ? 'border-[#002366] bg-[#002366]/5 text-[#002366] shadow-xl' : 'border-slate-100 text-slate-400 hover:border-[#002366]/20'}`}>
                    <cat.icon size={32} />
                    <span className="font-bold text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="flex justify-end pt-6 border-t">
              <button type="button" disabled={!selectedCategory || !workshopName} onClick={() => setStep(2)} className="px-12 py-4 bg-[#002366] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#001A4D] disabled:opacity-50 transition-all">다음 단계</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm animate-in slide-in-from-right-4 space-y-12">
            <section className="space-y-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#002366] text-white flex items-center justify-center text-xs">01</div>
                메인 스톤(보석) 구성
              </h3>
              
              <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                {(['diamond', 'colored', 'organic', 'none'] as const).map(c => (
                  <button key={c} type="button" onClick={() => { setStoneCategory(c); setStoneType(''); setStoneSearch(''); }} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${stoneCategory === c ? 'bg-[#002366] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>{c}</button>
                ))}
              </div>

              {stoneCategory && stoneCategory !== 'none' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">스톤 종류 선택</label>
                    {renderStoneGrid(stoneCategory as any)}
                  </div>
                  <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selection Info</p>
                          {stoneType && <span className="text-[10px] font-black text-[#002366] bg-white px-3 py-1 rounded-full shadow-sm animate-pulse">선택됨</span>}
                       </div>
                       <h4 className="text-xl font-black text-slate-900">{stoneType || '보석을 선택해주세요'}</h4>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">세팅 개수</label>
                          <div className="flex items-center gap-6">
                             <button type="button" onClick={() => setStoneCount(Math.max(1, stoneCount - 1))} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#002366] hover:bg-blue-50 transition-all"><Minus size={20}/></button>
                             <span className="text-2xl font-black text-slate-900 w-8 text-center">{stoneCount}</span>
                             <button type="button" onClick={() => setStoneCount(stoneCount + 1)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#002366] hover:bg-blue-50 transition-all"><Plus size={20}/></button>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">스톤 공급 방식</label>
                       <div className="flex gap-2">
                          <button type="button" onClick={() => setStoneSource('WORKSHOP')} className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all border-2 ${stoneSource === 'WORKSHOP' ? 'border-[#002366] bg-[#002366]/5 text-[#002366]' : 'border-slate-50 text-slate-400'}`}>공방 제공</button>
                          <button type="button" onClick={() => setStoneSource('CLIENT')} className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all border-2 ${stoneSource === 'CLIENT' ? 'border-[#002366] bg-[#002366]/5 text-[#002366]' : 'border-slate-50 text-slate-400'}`}>의뢰인 지참</button>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#002366] text-white flex items-center justify-center text-xs">02</div>
                금속 소재 설정
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {(['gold', 'platinum', 'silver'] as const).map(m => (
                      <button key={m} type="button" onClick={() => { setMetalCategory(m); setMetalPurity(''); }} className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase transition-all ${metalCategory === m ? 'border-[#002366] bg-[#002366]/5 text-[#002366]' : 'border-slate-50 text-slate-400'}`}>{m}</button>
                    ))}
                  </div>
                  {metalCategory && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in">
                      {(metalCategory === 'gold' ? ['14K Gold', '18K Gold', '24K Gold'] : metalCategory === 'platinum' ? ['PT900', 'PT950'] : ['Sterling Silver']).map(p => (
                        <button key={p} type="button" onClick={() => setMetalPurity(p)} className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all ${metalPurity === p ? 'bg-[#002366] text-white border-[#002366]' : 'bg-slate-50 text-slate-500 border-transparent'}`}>{p}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">참고 이미지 업로드</label>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((p, i) => (
                      <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden border relative group shadow-sm">
                        <img src={p} className="w-full h-full object-cover" alt="u" />
                        <button type="button" onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 size={18}/></button>
                      </div>
                    ))}
                    {photos.length < 5 && (
                      <button type="button" onClick={() => galleryInputRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-[#002366]/20 hover:text-[#002366] transition-all">
                        <Upload size={20} />
                        <span className="text-[8px] font-black mt-1 uppercase">Upload</span>
                      </button>
                    )}
                  </div>
                  <input type="file" ref={galleryInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                </div>
              </div>
            </section>

            <div className="flex justify-between pt-10 border-t">
              <button type="button" onClick={() => setStep(1)} className="px-10 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all">이전으로</button>
              <button type="submit" disabled={isSubmitting || !metalPurity} className="px-12 py-4 bg-[#002366] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#001A4D] active:scale-[0.98] transition-all flex items-center gap-3">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {isSubmitting ? '전송 중' : '의뢰 신청 완료'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewOrder;
