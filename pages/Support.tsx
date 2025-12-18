
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  MessageSquare, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Star,
  ArrowRight,
  Headphones,
  X,
  Send,
  PenTool,
  Calendar,
  ImageIcon,
  ChevronDown,
  ShieldAlert,
  Gem,
  Lock,
  Construction,
  AlertCircle
} from 'lucide-react';

interface ConsultationRequest {
  id: string;
  title: string;
  status: 'PENDING' | 'DISCUSSING' | 'PROPOSED' | 'COMPLETED';
  date: string;
  category: string;
}

const MOCK_CONSULTATIONS: ConsultationRequest[] = [
  { id: 'C-9921', title: '다이아몬드 가드링 리세팅 문의', status: 'DISCUSSING', date: '2024-05-18', category: '리세팅' },
  { id: 'C-8812', title: '기념일 맞춤 뱅글 팔찌 초기 상담', status: 'COMPLETED', date: '2024-04-12', category: '커스텀' },
];

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const reasons = [
    {
      title: "디자인 지적재산권 및 독점성 보장",
      icon: Lock,
      content: "고객님과 함께 기획한 맞춤 디자인은 오직 고객님만을 위한 고유 자산입니다. 오블리주웍스는 해당 디자인을 타 고객에게 재판매하거나 상업적으로 복제하지 않음을 법적으로 보장하며, 모든 도면은 보안 서버에 암호화되어 보관됩니다."
    },
    {
      title: "전 세계 상위 0.1% 원석 수급 네트워크",
      icon: Gem,
      content: "제이미 디렉터의 글로벌 파트너십을 통해 GIA 감정 등급을 넘어서는 최상급 휘광성을 가진 원석을 우선적으로 확보합니다. 일반 매장에서는 접근하기 어려운 희귀 유색 보석과 특수 컷 다이아몬드를 직접 소싱하여 제안해 드립니다."
    },
    {
      title: "30년 경력 마스터와의 1:1 기술 매칭",
      icon: PenTool,
      content: "단순한 상담원이 아닌, 실제 제작 공정을 30년 이상 진두지휘한 마스터 장인과 제이미 디렉터가 팀을 이루어 상담에 참여합니다. 물리적으로 구현 불가능한 디자인 오류를 사전에 차단하고, 가장 견고하면서도 아름다운 세팅 기법을 직접 설계합니다."
    },
    {
      title: "프라이빗 자산 가치 관리 서비스",
      icon: ShieldAlert,
      content: "제작된 주얼리의 가치를 영구적으로 보존하기 위해 정기적인 현미경 검수 및 난집 조정 서비스를 무상 제공합니다. 또한, 추후 리세팅이나 자산 현금화가 필요할 때를 대비하여 원석의 시세 분석 및 프리미엄 재매입 우선권을 부여합니다."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 italic">Premium Jewelry Concierge</h1>
            <p className="text-slate-500 font-medium">홍길동님만을 위한 1:1 디자인 상담 센터</p>
          </div>
        </div>
        <button 
          onClick={() => setIsRequestOpen(true)}
          className="flex items-center gap-3 bg-[#002366] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-[#001A4D] transition-all active:scale-95"
        >
          신규 디자인 상담 신청 <PenTool size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#002366] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                  <Star size={24} className="text-blue-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Member Status</span>
              </div>
              <h2 className="text-2xl font-black mb-2">Prestige Priority</h2>
              <p className="text-blue-100/60 text-xs leading-relaxed mb-10">실시간 우선 매칭 서비스를 지원받습니다.</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
                <div>
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">평균 대기</p>
                  <p className="text-2xl font-black italic">15 min</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">담당자</p>
                  <p className="text-xl font-black italic">제이미 디렉터</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <ShieldCheck size={18} className="text-[#002366]" />
              상담 프로세스
            </h3>
            <div className="space-y-6">
              {['상담 요청', '디렉터 검토', '디자인 시안', '최종 확정'].map((label, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">0{i+1}</div>
                  <p className="text-xs font-black text-slate-900 mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare size={20} className="text-[#002366]" />
                내 상담 내역
              </h3>
            </div>

            <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
              {MOCK_CONSULTATIONS.map((c) => (
                <div key={c.id} onClick={() => setSelectedConsultation(c)} className={`p-8 hover:bg-[#002366]/5 transition-all cursor-pointer group ${selectedConsultation?.id === c.id ? 'bg-[#002366]/5' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#002366] flex items-center justify-center"><MessageSquare size={24} /></div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-slate-400">{c.id}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-[#002366] rounded text-[10px] font-black">{c.status}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-[#002366]">{c.title}</h4>
                      </div>
                    </div>
                    <ChevronRight size={24} className="text-slate-300 group-hover:text-[#002366]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Service Benefits Dropbox (Accordion) */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b bg-[#002366]/5">
                <h3 className="text-lg font-black text-[#002366] flex items-center gap-2">
                  <ShieldCheck size={22} />
                  오블리주웍스 프리미엄 서비스를 선택해야 하는 이유
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">제이미 디렉터와 함께하는 독보적인 보안 및 제작 환경</p>
             </div>
             <div className="divide-y divide-slate-50">
                {reasons.map((reason, idx) => (
                  <div key={idx} className="bg-white">
                    <button 
                      onClick={() => toggleAccordion(idx)}
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 group-hover:text-[#002366]">
                          <reason.icon size={20} />
                        </div>
                        <span className="font-bold text-slate-800">{reason.title}</span>
                      </div>
                      <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openAccordion === idx && (
                      <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                        <div className="pl-12 text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          {reason.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Service Under Construction Modal */}
      {isRequestOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-md p-12 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-100">
              <Clock size={40} className="animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-4">현재 서비스 준비 중입니다</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              제이미 주얼리 디렉터와 함께하는 1:1 상담 서비스는<br />
              현재 시스템 고도화 작업 중에 있습니다.<br />
              <span className="text-[#002366] font-bold">곧 더 완벽한 모습으로 찾아뵙겠습니다.</span>
            </p>

            <button 
              onClick={() => setIsRequestOpen(false)}
              className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black shadow-xl shadow-blue-900/10 hover:bg-[#001A4D] transition-all active:scale-95"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
