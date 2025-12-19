
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  FileText,
  Clock,
  ArrowRight,
  Maximize2,
  X,
  Printer,
  Download,
  Hammer,
  ShieldCheck,
  Star,
  Gem,
  UserCheck,
  User as UserIcon,
  Smile,
  Paperclip,
  Trash2,
  Settings2,
  Building2,
  Wrench,
  Activity,
  Check,
  PlusCircle,
  RotateCcw,
  AlertTriangle,
  History,
  Zap
} from 'lucide-react';
import { MOCK_ISSUES, MOCK_ORDERS } from '../mockData';
import { IssueStatus, ASServiceCategory, ASServiceType, UserRole, IssueTicket } from '../types';
import { IssueStatusBadge } from './Issues';

const COMMON_EMOJIS = ['😊', '🙏', '💎', '✨', '💍', '👍', '😮', '💖', '✅', '📍'];

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin';
  name: string;
  text: string;
  time: string;
  image?: string;
}

const CAT_KO: Record<ASServiceCategory, string> = {
  POLISHING: '고밀도 폴리싱',
  SETTING_CHECK: '세팅 정밀 점검',
  REMAKE: '제품 리메이크',
  RESIZING: '사이즈 조정',
  CLEANING: '초음파 세척',
  OTHER: '기타 수선'
};

const TYPE_KO: Record<ASServiceType, { label: string, color: string }> = {
  FREE: { label: '무상 케어', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  PAID: { label: '유상 서비스', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  POLICY_EXCEPTION: { label: '정책 예외 승인', color: 'bg-rose-50 text-rose-600 border-rose-100' }
};

const IssueDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') as UserRole;
  const isAdmin = userRole === UserRole.ADMIN;

  const initialIssue = MOCK_ISSUES.find(i => i.id === id);
  const [issue, setIssue] = useState<IssueTicket | undefined>(initialIssue);
  const order = issue ? MOCK_ORDERS.find(o => o.id === issue.orderId) : null;
  
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  // Admin Edit States
  const [newLogAction, setNewLogAction] = useState('');
  const [newLogNote, setNewLogNote] = useState('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'admin',
      name: 'ObligeWorks Designer',
      text: `안녕하세요 ${issue?.customerName} 고객님, '${issue?.title}' 요청 건에 대해 담당 디자이너가 배정되었습니다. 첨부해주신 사진을 바탕으로 마스터 장인과 함께 정밀 검토 중입니다.`,
      time: '오후 3:40'
    },
    {
      id: 2,
      sender: 'admin',
      name: 'ObligeWorks Designer',
      text: '메인 스톤을 고정하는 프롱 하나에 미세한 벌어짐이 발견되었습니다. 이 부분은 당사의 평생 무상 케어 서비스 항목으로, 즉시 수거하여 정밀 재세팅 및 전체 폴리싱을 진행해 드리겠습니다.',
      time: '오후 3:45'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (!issue) return <div className="p-8 text-center font-bold text-slate-400">요청 정보를 찾을 수 없습니다.</div>;

  // Admin Functions
  const handleUpdateStatus = (newStatus: IssueStatus) => {
    if (!isAdmin) return;
    setIssue({ ...issue, status: newStatus });
    alert(`티켓 상태가 '${newStatus}'로 변경되었습니다.`);
  };

  const handleUpdateTechSpec = (field: keyof IssueTicket, value: any) => {
    if (!isAdmin) return;
    setIssue({ ...issue, [field]: value });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogAction || !newLogNote) return;
    
    const newLog = {
      time: new Date().toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      action: newLogAction,
      note: newLogNote
    };

    setIssue({
      ...issue,
      technicalLogs: [newLog, ...(issue.technicalLogs || [])]
    });
    setNewLogAction('');
    setNewLogNote('');
    alert('작업 로그가 성공적으로 추가되었습니다.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && !attachedImage) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: isAdmin ? 'admin' : 'user',
      name: isAdmin ? 'System Master' : '나',
      text: comment,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      image: attachedImage || undefined
    };

    setChatMessages([...chatMessages, newMessage]);
    setComment('');
    setAttachedImage(null);
  };

  const steps = [
    { label: '접수', status: 'completed', date: issue.createdAt },
    { label: '확인중', status: issue.status === IssueStatus.RECEIVED ? 'pending' : 'completed' },
    { label: '해결안 제시', status: issue.status === IssueStatus.SOLUTION_PROPOSED ? 'active' : (issue.status === IssueStatus.IN_PROGRESS || issue.status === IssueStatus.RESOLVED ? 'completed' : 'pending') },
    { label: '진행중', status: issue.status === IssueStatus.IN_PROGRESS ? 'active' : (issue.status === IssueStatus.RESOLVED ? 'completed' : 'pending') },
    { label: '완료', status: issue.status === IssueStatus.RESOLVED ? 'completed' : 'pending' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 관리자 전용 A/S 마스터 제어 시스템 */}
      {isAdmin && (
        <div className="bg-[#002366] text-white p-8 rounded-[40px] shadow-2xl space-y-8 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl shadow-lg">
                <Settings2 size={24} className="text-white" />
              </div>
              <div>
                <span className="font-black text-lg uppercase tracking-tight">A/S 마스터 관제 시스템</span>
                <p className="text-[10px] text-blue-200/60 font-bold mt-0.5 italic flex items-center gap-1.5 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-blue-300" /> REPAIR CONTROL V.BETA.1.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               {Object.values(IssueStatus).map(s => (
                 <button 
                  key={s} 
                  onClick={() => handleUpdateStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${issue.status === s ? 'bg-white text-[#002366] shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* 서비스 유형 설정 */}
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
              <h4 className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-2">
                <Wrench size={16} className="text-blue-300" /> 서비스 정책 및 분류
              </h4>
              <div className="space-y-3">
                <select 
                  value={issue.serviceCategory} 
                  onChange={(e) => handleUpdateTechSpec('serviceCategory', e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none"
                >
                  <option value="">카테고리 선택</option>
                  {Object.entries(CAT_KO).map(([k, v]) => <option key={k} value={k} className="bg-[#002366]">{v}</option>)}
                </select>
                <select 
                  value={issue.serviceType} 
                  onChange={(e) => handleUpdateTechSpec('serviceType', e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none"
                >
                  <option value="">결제 정책 선택</option>
                  {Object.entries(TYPE_KO).map(([k, v]) => <option key={k} value={k} className="bg-[#002366]">{v.label}</option>)}
                </select>
              </div>
            </div>

            {/* 담당 공방 및 기간 */}
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
              <h4 className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={16} className="text-blue-300" /> 공정 할당 정보
              </h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={issue.responsibleWorkshop || ''} 
                  onChange={(e) => handleUpdateTechSpec('responsibleWorkshop', e.target.value)}
                  placeholder="담당 공방명 입력"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none placeholder:text-white/20"
                />
                <input 
                  type="text" 
                  value={issue.estimatedDuration || ''} 
                  onChange={(e) => handleUpdateTechSpec('estimatedDuration', e.target.value)}
                  placeholder="예상 소요 기간 (예: 3~5일)"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            {/* 마스터 작업 로그 추가 */}
            <form onSubmit={handleAddLog} className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4">
              <h4 className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle size={16} className="text-blue-300" /> 마스터 작업 로그 추가
              </h4>
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={newLogAction}
                  onChange={(e) => setNewLogAction(e.target.value)}
                  placeholder="작업 단계 (예: 정밀 폴리싱)" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none"
                />
                <textarea 
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  placeholder="세부 작업 내용 기록..." 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white outline-none h-12"
                />
                <button type="submit" className="w-full py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-[10px] font-black uppercase transition-all">로그 등록</button>
              </div>
            </form>
          </div>
          <Zap size={200} className="absolute -right-20 -bottom-20 text-white opacity-5 pointer-events-none -rotate-12" />
        </div>
      )}

      {/* 기본 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{issue.title}</h1>
            <p className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">티켓 번호: {issue.id} • 제작 번호: {issue.orderNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <IssueStatusBadge status={issue.status} />
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#002366] transition-all shadow-sm">
                <Printer size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 타임라인 */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm relative overflow-hidden">
            <h3 className="font-black text-slate-800 mb-12 flex items-center gap-2 text-sm uppercase tracking-[0.1em]">
              <Clock size={18} className="text-[#002366]" />
              Treatment Timeline
            </h3>
            <div className="flex items-center justify-between relative px-2 mb-4">
              <div className="absolute left-0 right-0 h-0.5 bg-slate-100 top-4.5 -z-0"></div>
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-700 ${
                    step.status === 'completed' ? 'bg-[#002366] shadow-lg' : 
                    step.status === 'active' ? 'bg-[#002366] ring-8 ring-[#002366]/10 animate-pulse' : 'bg-slate-200'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 rounded-full bg-white opacity-40" />}
                  </div>
                  <div className="text-center">
                    <span className={`text-[10px] block font-black uppercase tracking-tighter ${step.status !== 'pending' ? 'text-[#002366]' : 'text-slate-400'}`}>{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 증상 분석 */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8">A/S 요청 및 증상 분석</h3>
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10 shadow-inner">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-bold text-sm">{issue.description}</p>
            </div>
            {issue.photos && (
              <div className="grid grid-cols-2 gap-4">
                {issue.photos.map((p, idx) => (
                  <div key={idx} onClick={() => setSelectedImage(p)} className="aspect-video rounded-3xl overflow-hidden border border-slate-100 cursor-pointer relative group">
                    <img src={p} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Evidence" />
                    <div className="absolute inset-0 bg-[#002366]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Maximize2 size={24} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 커뮤니케이션 */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col h-[550px]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <MessageSquare size={18} className="text-[#002366]" />
                    Support Communication
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 hide-scrollbar">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-6 rounded-[32px] text-sm font-bold shadow-sm ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'bg-[#002366] text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'}`}>
                    <p className={`text-[9px] mb-1.5 opacity-60 uppercase font-black ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'text-blue-200' : 'text-[#002366]'}`}>{msg.name}</p>
                    {msg.text}
                    <p className="text-[9px] mt-2 opacity-40 font-bold">{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-3 bg-slate-50 p-3 rounded-[32px] border border-slate-200 shadow-inner">
              <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="실시간 메시지를 입력하세요..." className="flex-1 px-5 py-3 bg-transparent border-none text-sm font-bold outline-none" />
              <button type="submit" className="p-4 bg-[#002366] text-white rounded-2xl shadow-xl hover:bg-[#001A4D] transition-all"><Send size={18} /></button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          {/* 기술 명세 카드 */}
          <div className="bg-[#002366] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                   <Settings2 size={24} className="text-blue-300" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Technical Spec</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest opacity-60">Service Category</p>
                   <p className="text-lg font-black italic">{issue.serviceCategory ? CAT_KO[issue.serviceCategory] : '분석 진행중'}</p>
                </div>
                
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest opacity-60">Service Type / Policy</p>
                   <div className="flex">
                     {issue.serviceType ? (
                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${TYPE_KO[issue.serviceType].color}`}>
                         {TYPE_KO[issue.serviceType].label}
                       </span>
                     ) : <span className="text-sm font-bold">미정</span>}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest opacity-60">Workshop</p>
                      <p className="text-xs font-bold flex items-center gap-1.5"><Building2 size={12}/> {issue.responsibleWorkshop || '-'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest opacity-60">Duration</p>
                      <p className="text-xs font-bold flex items-center gap-1.5"><Clock size={12}/> {issue.estimatedDuration || '-'}</p>
                   </div>
                </div>
              </div>
            </div>
            <Wrench size={300} className="absolute -right-20 -bottom-20 text-white opacity-5 pointer-events-none -rotate-12" />
          </div>

          {/* 마스터 작업 로그 */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <h3 className="font-black text-slate-900 mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <Activity size={16} className="text-[#002366]" />
              Master Activity Logs
            </h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
               {issue.technicalLogs?.map((log, i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 group-first:ring-4 group-first:ring-blue-100"></div>
                       <div className="w-px flex-1 bg-slate-100 group-last:hidden mt-2"></div>
                    </div>
                    <div className="pb-6">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{log.time}</p>
                       <p className="text-xs font-black text-slate-800">{log.action}</p>
                       <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{log.note}</p>
                    </div>
                 </div>
               ))}
               {!issue.technicalLogs?.length && <p className="text-center py-10 text-xs text-slate-400 font-bold uppercase italic">No logs available yet</p>}
            </div>
          </div>

          {/* 제품 히스토리 요약 */}
          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                <h4 className="font-black mb-6 flex items-center gap-2 uppercase text-xs tracking-widest text-blue-300">
                    <History size={18} /> Product Asset History
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold border-b border-white/10 pb-2">
                        <span className="opacity-50">최초 제작일</span>
                        <span>2024.01.12</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold border-b border-white/10 pb-2">
                        <span className="opacity-50">누적 A/S 횟수</span>
                        <span>{issue.id === 'i1' ? '1회' : '0회'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="opacity-50">인증 등급</span>
                        <span className="text-blue-300">PREMIUM AUTHENTIC</span>
                    </div>
                </div>
             </div>
             <ShieldCheck size={180} className="absolute -left-10 -bottom-10 text-white opacity-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-2 animate-in fade-in duration-500" onClick={() => setSelectedImage(null)}>
          <div className="absolute top-0 left-0 right-0 p-10 flex justify-between items-center z-[110] bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white space-y-1">
                <h4 className="font-black text-lg uppercase tracking-[0.2em]">Evidence Ultra Inspection</h4>
                <p className="text-[11px] text-white/50 font-bold">{issue.orderNumber} • {issue.customerName} 고객님 요청 이미지</p>
            </div>
            <button onClick={() => setSelectedImage(null)} className="text-white h-14 w-14 bg-rose-600 hover:bg-rose-700 rounded-2xl transition-all flex items-center justify-center shadow-2xl group"><X size={28} /></button>
          </div>
          <div className="w-full h-full flex items-center justify-center p-4">
            <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-[96vh] rounded-[48px] shadow-[0_0_120px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 border border-white/5 object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetail;
