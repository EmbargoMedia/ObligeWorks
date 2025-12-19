
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ImageIcon,
  X,
  Trash2,
  CheckCircle2,
  Camera,
  AlertCircle,
  Wrench,
  Package,
  Clock,
  ShieldAlert,
  Zap,
  ChevronDown,
  Info
} from 'lucide-react';
import { MOCK_ISSUES, getAllOrders } from '../mockData';
import { IssueStatus, ASServiceCategory } from '../types';

const ISSUE_CATEGORIES = [
  { id: 'POLISHING', label: '표면 스크래치 / 광택 복원' },
  { id: 'SETTING_CHECK', label: '원석 흔들림 / 유격 점검' },
  { id: 'RESIZING', label: '반지/팔찌 사이즈 조정' },
  { id: 'REMAKE', label: '부속 파손 / 전체 리메이크' },
  { id: 'CLEANING', label: '초음파 세척 및 딥클리닝' },
  { id: 'OTHER', label: '기타 기술 문의 및 수선' },
];

const Issues: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const userOrders = useMemo(() => getAllOrders(), []);
  
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [formData, setFormData] = useState({
    orderId: '',
    category: '',
    urgency: 'NORMAL',
    method: 'COURIER',
    description: ''
  });

  const filteredIssues = MOCK_ISSUES.filter(issue => 
    issue.title.toLowerCase().includes(search.toLowerCase()) || 
    issue.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = 5 - selectedPhotos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];
      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setSelectedPhotos(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
    if (event.target) event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderId || !formData.category) {
      alert('대상 오더와 증상 카테고리를 선택해주세요.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setSelectedPhotos([]);
      alert('기술 지원 티켓이 마스터 장인에게 전송되었습니다. 실시간 피드를 확인해주세요.');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Care & Support</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">오블리주 웍스의 모든 자산은 평생 가치를 보장받습니다.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-4 bg-[#002366] text-white px-12 py-6 rounded-[28px] font-black text-base uppercase tracking-[0.1em] hover:bg-black transition-all shadow-2xl shadow-blue-900/20 active:scale-95 group"
        >
          <Wrench size={24} className="group-hover:rotate-45 transition-transform" />
          새 A/S 요청 등록하기
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="티켓 제목 또는 주문번호로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#002366]/5 transition-all text-sm font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <div key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)} className="p-10 hover:bg-[#002366]/5 transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#002366] bg-blue-50 px-2.5 py-1 rounded uppercase tracking-tighter border border-blue-100">{issue.orderNumber}</span>
                      <IssueStatusBadge status={issue.status} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#002366] transition-colors tracking-tight">{issue.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Clock size={14}/> {issue.createdAt} 등록</span>
                       <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                       <span className="text-[#002366]">기술 지원 담당 배정 완료</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#002366] group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={28} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center">
              <AlertCircle size={64} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-400 font-black uppercase tracking-widest">Active Tickets Not Found</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[56px] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="p-10 md:p-12 border-b bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#002366] text-white rounded-3xl shadow-xl">
                  <Zap size={28} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Issue Report v1.1</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Artisan Technical Support Protocol</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white hover:text-rose-500 rounded-full transition-all text-slate-400 shadow-sm border border-transparent hover:border-slate-100">
                 <X size={32} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-10 md:p-12 space-y-12 hide-scrollbar">
              
              {/* Section 1: Order Select */}
              <section className="space-y-6">
                <h3 className="text-xs font-black text-[#002366] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package size={16} /> 01. 대상 오더 선택
                </h3>
                <div className="relative">
                  <select 
                    value={formData.orderId}
                    onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                    className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-sm text-slate-700 appearance-none shadow-inner"
                    required
                  >
                    <option value="">A/S가 필요한 제품(오더)을 선택하세요</option>
                    {userOrders.map(o => (
                      <option key={o.id} value={o.id}>{o.orderNumber} - {o.itemName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                </div>
              </section>

              {/* Section 2: Category & Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6">
                  <h3 className="text-xs font-black text-[#002366] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Wrench size={16} /> 02. 증상 분류
                  </h3>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-sm text-slate-700 appearance-none shadow-inner"
                      required
                    >
                      <option value="">증상 카테고리 선택</option>
                      {ISSUE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xs font-black text-[#002366] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap size={16} /> 03. 긴급도
                  </h3>
                  <div className="flex bg-slate-100 p-1.5 rounded-[24px]">
                    {['NORMAL', 'URGENT'].map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setFormData({...formData, urgency: u})}
                        className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase transition-all ${formData.urgency === u ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {u === 'NORMAL' ? '일반' : '긴급 (Urgent)'}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Section 3: Description */}
              <section className="space-y-6">
                <h3 className="text-xs font-black text-[#002366] uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert size={16} /> 04. 상세 증상 기술
                </h3>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="제품의 현재 상태와 수선 요청 사항을 구체적으로 적어주세요. (예: 6시 방향 프롱 유격으로 다이아몬드 흔들림 발생 등)"
                  className="w-full px-8 py-8 rounded-[32px] bg-slate-50 border-none outline-none focus:ring-4 focus:ring-[#002366]/5 focus:bg-white transition-all font-bold text-sm text-slate-700 leading-relaxed shadow-inner"
                  required
                ></textarea>
              </section>

              {/* Section 4: Photos */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black text-[#002366] uppercase tracking-[0.2em] flex items-center gap-2">
                    <ImageIcon size={16} /> 05. 실물 사진 증빙
                  </h3>
                  <span className="text-[10px] font-black text-slate-300">{selectedPhotos.length} / 5</span>
                </div>
                <div className="flex flex-wrap gap-5">
                  {selectedPhotos.map((p, i) => (
                    <div key={i} className="w-28 h-28 rounded-[32px] overflow-hidden border-2 border-slate-100 relative group shadow-lg">
                      <img src={p} alt="p" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)} className="absolute inset-0 bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm"><Trash2 size={28} /></button>
                    </div>
                  ))}
                  {selectedPhotos.length < 5 && (
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="w-28 h-28 rounded-[36px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-[#002366] hover:text-[#002366] hover:bg-blue-50 transition-all gap-1 shadow-inner group">
                      <Camera size={32} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Attach</span>
                    </button>
                  )}
                  <input type="file" ref={galleryInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
                </div>
                <div className="flex items-start gap-3 bg-blue-50 p-5 rounded-3xl border border-blue-100 mt-4">
                   <Info size={18} className="text-[#002366] shrink-0 mt-0.5" />
                   <p className="text-[11px] text-blue-800 leading-relaxed font-bold">
                     다각도에서 촬영된 고해상도 이미지는 담당 디자이너와 마스터 장인의 정확한 원인 파악 및 수선 계획 수립에 큰 도움이 됩니다.
                   </p>
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="p-10 md:p-12 border-t bg-white shrink-0">
               <button 
                onClick={handleRegister}
                disabled={isSubmitting} 
                className="w-full py-7 bg-[#002366] text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/20 hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <CheckCircle2 size={24}/>}
                {isSubmitting ? 'Transmitting Data...' : 'Submit Issue Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const IssueStatusBadge = ({ status }: { status: IssueStatus }) => {
  const configs: Record<IssueStatus, { label: string, classes: string }> = {
    [IssueStatus.RECEIVED]: { label: '접수됨', classes: 'bg-slate-100 text-slate-600' },
    [IssueStatus.REVIEWING]: { label: '확인중', classes: 'bg-[#002366]/10 text-[#002366]' },
    [IssueStatus.SOLUTION_PROPOSED]: { label: '해결안 제시', classes: 'bg-amber-100 text-amber-700' },
    [IssueStatus.IN_PROGRESS]: { label: '진행중', classes: 'bg-[#002366] text-white shadow-lg shadow-blue-900/10' },
    [IssueStatus.RESOLVED]: { label: '완료', classes: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  };
  const config = configs[status];
  return <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-tight ${config.classes}`}>{config.label}</span>;
};

// Fix: Add missing Loader2 import from lucide-react if not already there
const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

export default Issues;
