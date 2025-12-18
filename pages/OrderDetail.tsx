
// Fix: Added missing state and utility functions for image inspection modal in OrderDetail component.
// Updated references to 'issue' with 'order' where applicable to match the local scope.

import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Clock, 
  Box, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  FileText,
  Paperclip,
  Send,
  Image as ImageIcon,
  Check,
  Download,
  Printer,
  X,
  Maximize2,
  Sparkles,
  CreditCard,
  AlertCircle,
  ShieldAlert,
  Scale,
  Hash,
  Scissors,
  ShieldCheck,
  FileDown,
  User as UserIcon,
  Smile,
  Loader2,
  Award,
  Gem,
  Building2,
  Hammer,
  Settings2,
  PlusCircle,
  Zap,
  Wallet,
  FileSearch,
  CheckCircle,
  XCircle,
  BellRing,
  FileUp,
  RotateCcw,
  Info
} from 'lucide-react';
import { MOCK_ORDERS, getAllOrders } from '../mockData';
import { OrderStatus, ProcessStatus, MaterialStatus, UserRole, Order } from '../types';
import { StatusBadge } from './Dashboard';

interface ChatMessage {
  id: number;
  sender: 'user' | 'admin';
  text: string;
  time: string;
  image?: string;
}

const STATUS_KO: Record<OrderStatus, string> = {
  [OrderStatus.RECEIVED]: '오더 접수 완료',
  [OrderStatus.QUOTE_PENDING]: '견적 산출 중',
  [OrderStatus.PAYMENT_WAITING]: '결제 대기',
  [OrderStatus.PRODUCTION]: '생산/제작 중',
  [OrderStatus.INSPECTION]: '최종 검수 중',
  [OrderStatus.READY_FOR_SHIP]: '배송 준비 완료',
  [OrderStatus.SHIPPING]: '제품 배송 중',
  [OrderStatus.COMPLETED]: '모든 공정 완료'
};

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const allOrders = getAllOrders();
  const initialOrder = allOrders.find(o => o.id === id);
  
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const userRole = localStorage.getItem('userRole') as UserRole;
  const isAdmin = userRole === UserRole.ADMIN;

  const [activeTab, setActiveTab] = useState<'timeline' | 'materials' | 'communication'>('timeline');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [quoteInput, setQuoteInput] = useState(order?.finalQuote?.toString() || '');
  
  // Fix: Added missing state and helper functions for image inspection
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (imgUrl: string) => {
    if (!order) return;
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `obligeworks-order-${order.orderNumber}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (imgUrl: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ObligeWorks - Print Document</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
              @media print { img { max-width: 100%; max-height: 100%; } }
            </style>
          </head>
          <body>
            <img src="${imgUrl}" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (order && chatMessages.length === 0) {
      setChatMessages([
        { id: 1, sender: 'admin', text: `[마스터 시스템] ${order.customerName} 고객님의 오더 관제가 활성화되었습니다.`, time: '오전 10:15' }
      ]);
    }
  }, [order]);

  useEffect(() => {
    if (activeTab === 'communication') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, chatMessages]);

  if (!order) return <div className="p-8 text-center text-slate-500 font-bold">주문을 찾을 수 없습니다.</div>;

  const handleUpdateStepStatus = (stepIdx: number) => {
    if (!isAdmin) return;
    const newTimeline = [...order.timeline];
    const current = newTimeline[stepIdx].status;
    let next = ProcessStatus.WAITING;
    if (current === ProcessStatus.WAITING) next = ProcessStatus.IN_PROGRESS;
    else if (current === ProcessStatus.IN_PROGRESS) next = ProcessStatus.COMPLETED;
    
    newTimeline[stepIdx] = { 
      ...newTimeline[stepIdx], 
      status: next, 
      updatedAt: new Date().toISOString().split('T')[0] 
    };
    setOrder({ ...order, timeline: newTimeline });
  };

  const handleUpdateOrderStatus = (newStatus: OrderStatus) => {
    if (!isAdmin) return;
    setOrder({ ...order, status: newStatus });
  };

  const handleVerifyDesign = () => {
    if (!isAdmin) return;
    setOrder({ ...order, isDesignVerified: !order.isDesignVerified });
    alert(order.isDesignVerified ? '기술 검토 승인이 취소되었습니다.' : '기술 검토 및 도면 승인이 완료되었습니다.');
  };

  const handleSetFinalQuote = () => {
    if (!isAdmin) return;
    const amount = parseInt(quoteInput);
    if (isNaN(amount) || amount <= 0) return alert('유효한 견적 금액을 입력하세요.');
    
    setOrder({ ...order, finalQuote: amount, status: OrderStatus.PAYMENT_WAITING });
    alert(`최종 견적가 ₩${amount.toLocaleString()}이 확정되어 '결제 대기' 상태로 전환되었습니다.`);
  };

  const handleSendProposal = () => {
    if (!isAdmin) return;
    alert(`${order.customerName} 고객(기업)에게 공식 결제 제안서(PDF) 전송이 완료되었습니다.`);
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'admin',
      text: `[시스템 안내] 공식 결제 제안서 전송 완료. 승인 시 제작이 즉시 시작됩니다.`,
      time: '방금'
    }]);
  };

  const handleSendReminder = () => {
    if (!isAdmin) return;
    alert('미결제 건에 대한 결제 독려 알림톡/메일이 발송되었습니다.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* 관리자 전용 마스터 제어 포탈 V.BETA.1.0 */}
      {isAdmin && (
        <div className="bg-[#002366] text-white p-8 rounded-[40px] shadow-2xl space-y-8 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl shadow-lg">
                <Settings2 size={24} className="text-white" />
              </div>
              <div>
                <span className="font-black text-lg uppercase tracking-tight">관리자 전용 마스터 제어 포탈</span>
                <p className="text-[10px] text-blue-200/60 font-bold mt-0.5 italic flex items-center gap-1.5 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-blue-300" /> PRODUCTION MASTER CONTROL V.BETA.1.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${order.isDesignVerified ? 'bg-white/20 text-white border-white/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                기술 검토: {order.isDesignVerified ? '검증 완료' : '검토 대기'}
              </div>
              {order.isExpress && <span className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase animate-pulse shadow-lg">긴급 제작건</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* 견적 확정 섹션: 입력칸 줄이고 승인 버튼 박스 내부 배치 */}
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-5">
              <h4 className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-2">
                <Wallet size={16} className="text-blue-300" /> 견적 확정 및 승인 처리
              </h4>
              <div className="bg-black/20 p-5 rounded-[24px] border border-white/5 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-blue-200/50 font-bold uppercase">의뢰인 희망 예산</p>
                  <p className="text-sm text-white font-black">{order.estimatedBudget || '상담 후 산출'}</p>
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                  <input 
                    type="number" 
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                    placeholder="금액" 
                    className="w-32 bg-transparent px-3 py-2 text-sm font-bold outline-none text-white placeholder:text-white/20"
                  />
                  <button 
                    onClick={handleSetFinalQuote} 
                    className="flex-1 py-2.5 bg-white text-[#002366] rounded-lg text-xs font-black hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                  >
                    승인
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-5">
              <h4 className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-2">
                <FileSearch size={16} className="text-blue-300" /> 생산 공정 진입 제어
              </h4>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleVerifyDesign}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition-all ${order.isDesignVerified ? 'bg-white/10 text-white border border-white/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl'}`}
                >
                  {order.isDesignVerified ? <><CheckCircle size={16}/> 기술 검토 승인됨</> : <><ShieldCheck size={16}/> 기술 검토 최종 승인</>}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleUpdateOrderStatus(OrderStatus.PRODUCTION)} 
                    disabled={!order.isDesignVerified || !order.finalQuote} 
                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 ${(!order.isDesignVerified || !order.finalQuote) ? 'bg-white/5 text-blue-200/30 cursor-not-allowed' : 'bg-white text-[#002366] hover:bg-blue-50'}`}
                  >
                    <Hammer size={14} /> 생산 시작
                  </button>
                  <button 
                    onClick={() => handleUpdateOrderStatus(OrderStatus.INSPECTION)} 
                    className="py-3.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> 검수 단계
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-5">
              <h4 className="text-[11px] font-black text-blue-200 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-blue-300" /> 공정 상태 강제 오버라이드
              </h4>
              <div className="space-y-3">
                <div className="relative">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(e.target.value as OrderStatus)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-xs font-black outline-none focus:border-white/40 appearance-none cursor-pointer text-white"
                  >
                    {Object.values(OrderStatus).map(s => (
                      <option key={s} value={s} className="bg-[#002366] text-white">
                        {STATUS_KO[s]}
                      </option>
                    ))}
                  </select>
                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-blue-300 pointer-events-none" />
                </div>
                <p className="text-[9px] text-blue-200/40 font-bold leading-tight flex gap-1.5 items-start px-1">
                  <AlertCircle size={10} className="shrink-0 mt-0.5" />
                  <span>강제 오버라이드는 시스템 자동화 프로세스를 무시하고 데이터를 즉시 수정합니다. 신중히 사용하십시오.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 기본 헤더 섹션 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={isAdmin ? "/" : "/orders"} className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-[#002366] bg-blue-50 px-2.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">{order.orderNumber}</span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5"><Building2 size={12} /> {order.workshopName}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{order.itemName}</h1>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-[#002366] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#001A4D] transition-all">
          <ShieldCheck size={18} className="text-blue-300" />
          공식 제작 리포트 발급
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* 결제 및 견적 관리 (상태 표시 영역 크기 최적화) */}
          <div className="bg-white rounded-[40px] border-2 border-[#002366]/5 p-10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-xl font-black flex items-center gap-3 text-slate-900">
                <div className="p-2.5 bg-blue-50 rounded-xl text-[#002366]">
                  <Wallet size={24} />
                </div>
                결제 및 견적 관리 현황
              </h2>
              {order.status === OrderStatus.PAYMENT_WAITING && (
                <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tight animate-pulse border border-rose-100">결제 승인 대기중</span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-2">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">최종 확정 견적가</p>
                <p className="text-5xl font-black text-[#002366] italic tracking-tighter">
                  {order.finalQuote ? `₩${order.finalQuote.toLocaleString()}` : '검토 중'}
                </p>
                <p className="text-[11px] text-slate-400 font-bold mt-2">부가가치세(VAT) 포함 및 공임비 전체 포함</p>
              </div>
              
              <div className="flex flex-col justify-center gap-4">
                {isAdmin && order.status === OrderStatus.PAYMENT_WAITING ? (
                  <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right-4">
                    <button 
                      onClick={handleSendReminder}
                      className="w-full py-4.5 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2.5"
                    >
                      <BellRing size={18} /> 결제 독려 알림 발송
                    </button>
                    <button 
                      onClick={handleSendProposal}
                      className="w-full py-4.5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#001A4D] transition-all flex items-center justify-center gap-2.5"
                    >
                      <FileUp size={18} /> 공식 결제 제안서 전송
                    </button>
                    <p className="text-[10px] text-slate-400 font-bold text-center italic mt-2">개인/기업 고객 맞춤형 제안서가 자동 생성 및 발송됩니다.</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-inner">
                    <span className="text-xs font-bold text-slate-500">현재 결제 상태</span>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-md ${order.paymentStatus === '결제완료' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{order.paymentStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm overflow-hidden">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 shadow-inner">
              {(['timeline', 'materials', 'communication'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase transition-all duration-300 ${activeTab === tab ? 'bg-white text-[#002366] shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'timeline' ? (isAdmin ? '공정 타임라인 관리' : '제작 공정 타임라인') : tab === 'materials' ? '자재 상세 정보' : '디렉터 1:1 관제'}
                </button>
              ))}
            </div>

            {activeTab === 'timeline' && (
              <div className="space-y-8 px-4">
                {isAdmin && <div className="mb-4 text-[10px] font-black text-[#002366] uppercase tracking-widest flex items-center gap-2 bg-blue-50 p-4 rounded-2xl border border-blue-100"><Info size={14}/> 아이콘을 클릭하여 각 공정 단계의 상태를 '대기-진행-완료' 순으로 순환 업데이트 하십시오.</div>}
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-6 relative">
                    {idx < order.timeline.length - 1 && <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100" />}
                    <div 
                      onClick={() => handleUpdateStepStatus(idx)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${isAdmin ? 'cursor-pointer hover:scale-125 shadow-lg ring-offset-2 ring-blue-500/20' : ''} ${step.status === ProcessStatus.COMPLETED ? 'bg-[#002366] text-white shadow-[#002366]/20' : step.status === ProcessStatus.IN_PROGRESS ? 'bg-blue-100 text-[#002366] ring-4 ring-blue-50' : 'bg-slate-50 text-slate-300'}`}
                    >
                      {step.status === ProcessStatus.COMPLETED ? <Check size={20} /> : step.status === ProcessStatus.IN_PROGRESS ? <Loader2 size={20} className="animate-spin" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                    </div>
                    <div className="pb-10 flex-1">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900">{step.name}</span>
                          {isAdmin && <RotateCcw size={12} className="text-[#002366]/30" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${step.status === ProcessStatus.COMPLETED ? 'bg-blue-50 text-[#002366]' : 'bg-slate-100 text-slate-400'}`}>{step.status === 'COMPLETED' ? '완료' : step.status === 'IN_PROGRESS' ? '진행중' : '대기'}</span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{step.updatedAt}</span>
                        </div>
                      </div>
                      {step.comment && <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-6">
                {order.materials.map(m => (
                  <div key={m.id} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col gap-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-[#002366]">
                          {m.type === '금속' ? <Scissors size={24} /> : <Gem size={24} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{m.source === 'CLIENT' ? '의뢰인 지참 자재' : '공방 제공 자재'}</p>
                          <p className="font-black text-slate-900 text-lg">{m.spec}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm ${
                        m.status === MaterialStatus.APPRAISAL_COMPLETED ? 'bg-blue-100 text-[#002366]' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {m.status === MaterialStatus.APPRAISAL_NEEDED ? '정밀 감정 대기' : 
                         m.status === MaterialStatus.APPRAISAL_COMPLETED ? '감정 승인 완료' : '준비 완료'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="flex flex-col h-[550px]">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 hide-scrollbar">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-6 rounded-[32px] text-sm font-bold shadow-sm ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'bg-[#002366] text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'}`}>
                        {msg.text}
                        <p className={`text-[9px] mt-2 font-black opacity-50 uppercase tracking-tighter ${msg.sender === (isAdmin ? 'admin' : 'user') ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if(!message) return; setChatMessages([...chatMessages, { id: Date.now(), sender: isAdmin ? 'admin' : 'user', text: message, time: '방금' }]); setMessage(''); }} className="flex gap-3 bg-slate-50 p-3 rounded-[32px] border border-slate-200 shadow-inner">
                  <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="실시간 메시지를 입력하세요..." className="flex-1 px-5 py-3 bg-transparent border-none text-sm font-bold outline-none" />
                  <button type="submit" className="p-4 bg-[#002366] text-white rounded-2xl shadow-xl hover:bg-[#001A4D] transition-all"><Send size={18} /></button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
              <ImageIcon size={16} /> 미디어 및 도면 아카이브
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {order.attachments.map((at, ai) => (
                <div 
                  key={ai} 
                  onClick={() => setSelectedImage(at)}
                  className="aspect-square rounded-[28px] overflow-hidden border border-slate-100 group relative shadow-md cursor-pointer"
                >
                  <img src={at} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={`At ${ai}`} />
                  <div className="absolute inset-0 bg-[#002366]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={24} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
            {isAdmin && (
              <button className="w-full py-4.5 border-2 border-dashed border-slate-200 rounded-[28px] text-[11px] font-black uppercase text-slate-400 hover:border-[#002366] hover:text-[#002366] transition-all flex items-center justify-center gap-2">
                <PlusCircle size={16} /> 신규 작업 이미지 추가
              </button>
            )}
          </div>

          <div className="bg-[#002366] rounded-[40px] p-10 flex flex-col items-center text-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="p-5 bg-white/10 rounded-3xl border border-white/10">
              <ShieldCheck size={40} className="text-blue-300" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] text-blue-200 font-black leading-relaxed uppercase tracking-[0.3em] mb-2">Authenticated History</p>
              <p className="text-xs text-white/70 font-bold leading-relaxed">디지털 정품 인증 및 블록체인 이력 관리가 이 오더의 신뢰를 보증합니다.</p>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-2 animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-[110] bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white space-y-1">
                <h4 className="font-black text-base md:text-lg uppercase tracking-[0.2em]">Evidence Ultra Inspection</h4>
                <p className="text-[11px] text-white/50 font-bold">{order.orderNumber} • {order.customerName} 고객님 요청 이미지</p>
            </div>
            <div className="flex gap-3 md:gap-5">
                <button 
                onClick={(e) => { e.stopPropagation(); handlePrint(selectedImage); }}
                className="text-white h-12 w-12 md:h-14 md:w-14 bg-white/5 hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center shadow-2xl border border-white/5 group"
                title="인쇄"
                >
                <Printer size={24} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                onClick={(e) => { e.stopPropagation(); handleDownload(selectedImage); }}
                className="text-white h-12 w-12 md:h-14 md:w-14 bg-white/5 hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center shadow-2xl border border-white/5 group"
                title="저장"
                >
                <Download size={24} className="group-hover:scale-110 transition-transform" />
                </button>
                <button 
                onClick={() => setSelectedImage(null)}
                className="text-white h-12 w-12 md:h-14 md:w-14 bg-rose-600 hover:bg-rose-700 rounded-2xl transition-all flex items-center justify-center shadow-2xl group"
                title="닫기"
                >
                <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
          </div>
          
          <div className="w-full h-full flex items-center justify-center p-4">
            <img 
                src={selectedImage} 
                alt="Enlarged" 
                className="max-w-full max-h-[96vh] rounded-3xl md:rounded-[48px] shadow-[0_0_120px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 border border-white/5 object-contain"
                onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.6em] animate-pulse pointer-events-none">
            ESC OR CLICK OUTSIDE TO EXIT INSPECTION
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
