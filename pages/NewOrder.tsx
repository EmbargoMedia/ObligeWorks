
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Gem, Scale, Hash, Scissors, Layers, ShieldCheck, 
  Loader2, PenTool, ClipboardCheck, Box, Clock, Zap, 
  AlertTriangle, FileText, Download, Layout,
  ArrowRight, Check, Settings, Award, PlusCircle, Info, Tag,
  User, Building2, UserCheck, AlertCircle, Sparkles, CheckCircle2,
  Trash2, Eye, Printer, Smartphone, Globe, Wrench, Coins, FileCheck,
  Dna, Ruler, FileSearch, ShieldAlert
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { OrderStatus, ProcessStatus, MaterialStatus, Order } from '../types';

const STEPS = [
  { id: 1, label: '기본 정보', icon: FileText },
  { id: 2, label: '금속 상세', icon: Scissors },
  { id: 3, label: '메인 원석', icon: Gem },
  { id: 4, label: '보조 원석', icon: Layers },
  { id: 5, label: '제작 & 세팅', icon: Settings },
  { id: 6, label: '감정 & 정산', icon: Award },
  { id: 7, label: '품질 & AS', icon: ShieldCheck },
  { id: 8, label: '최종 확인', icon: PenTool },
];

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 주문번호 자동 생성
  const generateOrderNo = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `OBL-${year}-${random}`;
  };

  // 1. 기본 정보
  const [orderInfo, setOrderInfo] = useState({
    orderNo: '', projectTitle: '', designerName: '', clientName: '', 
    workshopName: '', picName: '', itemType: 'Ring', quantity: '1', 
    dueDate: '', other: ''
  });

  useEffect(() => {
    setOrderInfo(prev => ({ ...prev, orderNo: generateOrderNo() }));
  }, []);

  // 2. 금속 상세
  const [metalSpec, setMetalSpec] = useState({
    type: '18K Gold', color: 'White', purity: 'Au750', engraving: '', finish: 'High Polish',
    plating: 'Rhodium', nickelFree: 'Yes', targetWeight: '', tolerance: '± 0.1g', source: '공방 제공', other: ''
  });

  // 3. 메인 원석
  const [mainStone, setMainStone] = useState({
    type: 'Diamond', origin: 'Natural', cut: 'Round', carat: '', size: '', color: '', clarity: '', grade: 'Excellent', setting: 'Prong', source: '공방 제공', other: ''
  });

  // 4. 보조 원석
  const [sideStone, setSideStone] = useState({
    exists: '없음', type: 'Diamond', count: '', weight: '', setting: 'Pavé', source: '공방 제공', other: ''
  });

  // 5. 제작 & 세팅
  const [manuSpec, setManuSpec] = useState({
    method: 'Wax Casting', difficulty: '일반', assembly: '통주물', comfortFit: '필수', thickness: '1.2mm', other: ''
  });

  // 6. 감정 · 증빙 · 정산
  const [settlement, setSettlement] = useState({
    hasCert: '있음', certAuth: 'GIA/우신', basis: '실중량 정산', taxInvoice: '발행 희망', other: ''
  });

  // 7. 품질 기준 & A/S
  const [qcPolicy, setQcPolicy] = useState({
    scratch: '불가', platingAs: '자연 마모 면책', resizing: '±1호 무상', cleaning: '평생 무상', other: ''
  });

  const [specialNote, setSpecialNote] = useState('');

  const handleFinalComplete = () => {
    const newOrderObj: Order = {
      id: `o-custom-${Date.now()}`,
      orderNumber: orderInfo.orderNo,
      customerName: orderInfo.clientName,
      workshopName: orderInfo.workshopName || '오블리주 파트너 아틀리에',
      projectTitle: orderInfo.projectTitle,
      itemName: `${metalSpec.type} ${orderInfo.itemType}`,
      status: OrderStatus.QUOTE_PENDING,
      ecd: orderInfo.dueDate || '상담 후 확정',
      lastUpdate: new Date().toLocaleString(),
      priority: 'NORMAL',
      quantity: parseInt(orderInfo.quantity),
      options: `디자이너: ${orderInfo.designerName}, 프로젝트: ${orderInfo.projectTitle}`,
      paymentStatus: '결제대기',
      materials: [
        { id: 'm1', type: '금속', spec: `${metalSpec.type} (${metalSpec.color})`, status: MaterialStatus.SECURING, source: metalSpec.source === '공방 제공' ? 'WORKSHOP' : 'CLIENT' },
        { id: 'm2', type: '메인 원석', spec: mainStone.type, status: MaterialStatus.SECURING, source: mainStone.source === '공방 제공' ? 'WORKSHOP' : 'CLIENT' }
      ],
      timeline: [
        { name: '지시서 발행', status: ProcessStatus.COMPLETED, updatedAt: new Date().toLocaleDateString(), comment: '기술 지시서가 공식 발행되었습니다.' },
        { name: '기술 검토', status: ProcessStatus.IN_PROGRESS, updatedAt: '-', comment: '공방에서 제작 타당성 및 재고를 확인 중입니다.' },
        { name: '견적 승인', status: ProcessStatus.WAITING, updatedAt: '-' },
        { name: '제작 시작', status: ProcessStatus.WAITING, updatedAt: '-' }
      ],
      attachments: [],
      isDesignVerified: true,
      isExpress: false,
      specs: {
        metal: metalSpec,
        mainStone: mainStone,
        sideStone: sideStone,
        manu: manuSpec,
        settlement: settlement,
        qc: qcPolicy,
        specialNote: specialNote
      }
    };

    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    localStorage.setItem('user_orders', JSON.stringify([newOrderObj, ...existingOrders]));
    navigate('/orders');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    const element = certificateRef.current;
    element.style.display = 'block';
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Oblige_WorkOrder_${orderInfo.orderNo}.pdf`);
    element.style.display = 'none';
  };

  const GuideBox = ({ dos, donts }: { dos: string[], donts: string[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-6">
        <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CheckCircle2 size={14} /> 권장 기입 (Dos)
        </h4>
        <ul className="space-y-2">
          {dos.map((d, i) => <li key={i} className="text-[11px] text-emerald-800 font-bold leading-tight">• {d}</li>)}
        </ul>
      </div>
      <div className="bg-rose-50/60 border border-rose-100 rounded-3xl p-6">
        <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertCircle size={14} /> 기입 지양 (Don'ts)
        </h4>
        <ul className="space-y-2">
          {donts.map((d, i) => <li key={i} className="text-[11px] text-rose-800 font-bold leading-tight">• {d}</li>)}
        </ul>
      </div>
    </div>
  );

  if (isSubmitSuccess) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#002366] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <ShieldCheck size={14} /> Order Authenticated v1.1
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">지시서 발행 완료</h1>
            <p className="text-slate-500 mt-2 font-medium">아래 프리뷰를 확인하고 공정 등록을 완료하십시오.</p>
        </div>

        <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden mb-12 relative group">
           <div className="absolute top-8 right-8 flex gap-2">
              <button onClick={handleDownloadPDF} className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-xl"><Download size={20}/></button>
           </div>
           
           <div ref={certificateRef} className="p-[15mm] md:p-[25mm] bg-white text-slate-900 font-serif min-h-[800px]">
              <div className="border-[1px] border-slate-900 p-10 h-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black uppercase tracking-[0.2em] mb-2">Jewelry Production Order</h2>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-slate-400">Authorized Artisan Interface v1.1 / ObligeWorks Official</p>
                </div>
                <div className="grid grid-cols-2 gap-y-8 text-[11px] leading-relaxed">
                   <div className="col-span-2 border-b border-slate-200 pb-2 flex justify-between items-end">
                      <span className="font-black uppercase tracking-widest text-[10px]">1. Identity</span>
                      <span className="text-slate-400">Date: {new Date().toLocaleDateString()}</span>
                   </div>
                   <div className="px-2">Order No: <span className="font-bold">{orderInfo.orderNo}</span></div>
                   <div className="px-2">Project: <span className="font-bold">{orderInfo.projectTitle}</span></div>
                   <div className="px-2">Designer: <span className="font-bold">{orderInfo.designerName}</span></div>
                   <div className="px-2">Workshop: <span className="font-bold">{orderInfo.workshopName}</span></div>
                   
                   <div className="col-span-2 border-b border-slate-200 pb-2 mt-4 flex justify-between items-end">
                      <span className="font-black uppercase tracking-widest text-[10px]">2. Technical Summary</span>
                   </div>
                   <div className="px-2">Metal: <span className="font-bold">{metalSpec.type} / {metalSpec.color}</span></div>
                   <div className="px-2">Main Stone: <span className="font-bold">{mainStone.type} ({mainStone.setting})</span></div>
                   <div className="px-2">Side Stone: <span className="font-bold">{sideStone.exists === '있음' ? `${sideStone.type} ${sideStone.count}pcs` : 'None'}</span></div>
                   <div className="px-2">Method: <span className="font-bold">{manuSpec.method}</span></div>
                   <div className="col-span-2 px-2 mt-4 text-slate-500 italic">"{specialNote || 'No additional notes.'}"</div>
                </div>
                <div className="mt-40 pt-10 border-t border-slate-200 grid grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <p className="text-[9px] font-black uppercase tracking-widest">Client Signature</p>
                        <div className="h-px bg-slate-300 w-full"></div>
                    </div>
                    <div className="space-y-12">
                        <p className="text-[9px] font-black uppercase tracking-widest">Workshop Master Approval</p>
                        <div className="h-px bg-slate-300 w-full"></div>
                    </div>
                </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
            <button onClick={() => navigate('/orders')} className="px-12 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">목록으로</button>
            <button 
              onClick={handleFinalComplete} 
              className="px-20 py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
            >
                <CheckCircle2 size={18}/> 공정 등록 완료 및 전송
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
              <PenTool size={28} className="text-[#002366]" /> 신규 제작 지시서 v1.1
            </h1>
            <p className="text-slate-400 text-sm font-medium italic mt-1">Authorized Artisan Interface Active</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white p-2 rounded-[32px] border border-slate-100 shadow-sm flex overflow-x-auto hide-scrollbar">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`flex-1 min-w-[110px] flex flex-col items-center gap-2 py-4 rounded-[24px] transition-all ${step === s.id ? 'bg-[#002366] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <s.icon size={18} />
            <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Identity Info */}
        {step === 1 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">01</div>
              기본 식별 정보 (Production Identity)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">주문 번호 (자동 생성)</label>
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                  <Tag size={16} className="text-[#002366] opacity-40" />
                  <span className="font-black text-[#002366] tracking-widest uppercase">{orderInfo.orderNo}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">프로젝트 명칭</label>
                <input type="text" placeholder="예: 한소희 웨딩 밴드 리뉴얼" value={orderInfo.projectTitle} onChange={e => setOrderInfo({...orderInfo, projectTitle: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#002366] transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">디자이너 실명</label>
                <input type="text" placeholder="예: 김디자인 실장" value={orderInfo.designerName} onChange={e => setOrderInfo({...orderInfo, designerName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#002366] transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">의뢰인 실명</label>
                <input type="text" placeholder="예: 이소희 고객님" value={orderInfo.clientName} onChange={e => setOrderInfo({...orderInfo, clientName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#002366] transition-all" required />
              </div>
            </div>
            <div className="mt-12 flex justify-end">
              <button type="button" onClick={() => setStep(2)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95">금속 상세 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 2: Metal Spec */}
        {step === 2 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">02</div>
              금속 상세 명세 (Metal Specs)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">금속 종류</label>
                <select value={metalSpec.type} onChange={e => setMetalSpec({...metalSpec, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-[#002366]/10">
                  <option>14K Gold</option><option>18K Gold</option><option>Platinum PT950</option><option>Silver 925</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">합금 컬러</label>
                <select value={metalSpec.color} onChange={e => setMetalSpec({...metalSpec, color: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-[#002366]/10">
                  <option>White</option><option>Yellow</option><option>Rose</option><option>Champagne</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">제공 주체</label>
                <select value={metalSpec.source} onChange={e => setMetalSpec({...metalSpec, source: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-[#002366]/10">
                  <option>공방 제공</option><option>의뢰인 제공</option>
                </select>
              </div>
            </div>
            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">이전</button>
              <button type="button" onClick={() => setStep(3)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">메인 원석 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 3: Main Stone */}
        {step === 3 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">03</div>
              메인 원석 정보 (Main Stone)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">원석 종류 및 등급</label>
                <input type="text" placeholder="예: GIA 0.5ct F/VS2" value={mainStone.type} onChange={e => setMainStone({...mainStone, type: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#002366] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">세팅 방식</label>
                <select value={mainStone.setting} onChange={e => setMainStone({...mainStone, setting: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-[#002366]/10">
                  <option>Prong (프롱)</option><option>Bezel (베젤)</option><option>Tension (텐션)</option>
                </select>
              </div>
            </div>
            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">이전</button>
              <button type="button" onClick={() => setStep(4)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">보조 원석 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 4: 보조 원석 (Side Stone) */}
        {step === 4 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">04</div>
              보조 원석 구성 (Side Stone)
            </h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">보조 원석 유무</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                   {['있음', '없음'].map(opt => (
                     <button key={opt} type="button" onClick={() => setSideStone({...sideStone, exists: opt})} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${sideStone.exists === opt ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400'}`}>{opt}</button>
                   ))}
                </div>
              </div>
              
              {sideStone.exists === '있음' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">원석 종류</label>
                    <input type="text" value={sideStone.type} onChange={e => setSideStone({...sideStone, type: e.target.value})} placeholder="예: 멜리 다이아몬드 / 블루 사파이어" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">수량 (pcs)</label>
                      <input type="number" value={sideStone.count} onChange={e => setSideStone({...sideStone, count: e.target.value})} placeholder="0" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">세팅 방식</label>
                      <select value={sideStone.setting} onChange={e => setSideStone({...sideStone, setting: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none">
                        <option>Pavé (파베)</option><option>Channel (채널)</option><option>Shared Prong</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">이전</button>
              <button type="button" onClick={() => setStep(5)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">제작 & 세팅 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 5: 제작 & 세팅 (Production & Setting) */}
        {step === 5 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">05</div>
              공법 및 제작 사양 (Manu Spec)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">제작 방식</label>
                <select value={manuSpec.method} onChange={e => setManuSpec({...manuSpec, method: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/10">
                   <option>Wax Casting (왁스 카스팅)</option><option>Hand-Fabricated (수작업 조립)</option><option>3D Printing Direct</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">조립 형태</label>
                <select value={manuSpec.assembly} onChange={e => setManuSpec({...manuSpec, assembly: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/10">
                   <option>통주물 (Solid)</option><option>파트 분할 (Multi-part)</option><option>가변형 (Adjustable)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">컴포트 핏 (Comfort Fit)</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                   {['필수', '미적용'].map(opt => (
                     <button key={opt} type="button" onClick={() => setManuSpec({...manuSpec, comfortFit: opt})} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${manuSpec.comfortFit === opt ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400'}`}>{opt}</button>
                   ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">권장 두께 (Thickness)</label>
                <input type="text" value={manuSpec.thickness} onChange={e => setManuSpec({...manuSpec, thickness: e.target.value})} placeholder="예: 1.5mm" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#002366] transition-all" />
              </div>
            </div>
            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(4)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">이전</button>
              <button type="button" onClick={() => setStep(6)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">감정 & 정산 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 6: 감정 & 정산 (Appraisal & Settlement) */}
        {step === 6 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">06</div>
              검증 및 정산 기준 (Settlement)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">자체/외부 감정서 발급</label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                   {['있음', '없음'].map(opt => (
                     <button key={opt} type="button" onClick={() => setSettlement({...settlement, hasCert: opt})} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${settlement.hasCert === opt ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400'}`}>{opt}</button>
                   ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">희망 감정 기관</label>
                <input type="text" value={settlement.certAuth} onChange={e => setSettlement({...settlement, certAuth: e.target.value})} placeholder="예: GIA / 우신 / 미래" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">정산 방식</label>
                <select value={settlement.basis} onChange={e => setSettlement({...settlement, basis: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none">
                   <option>실중량 정산 (해리 포함)</option><option>확정가 정산 (Flat rate)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">세금계산서/영수증</label>
                <select value={settlement.taxInvoice} onChange={e => setSettlement({...settlement, taxInvoice: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none">
                   <option>발행 희망</option><option>미발행 (개인 영수증)</option>
                </select>
              </div>
            </div>
            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(5)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">이전</button>
              <button type="button" onClick={() => setStep(7)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">품질 & AS 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 7: 품질 기준 & A/S (Quality & CS) */}
        {step === 7 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">07</div>
              품질 보증 및 사후 관리 (Quality & CS)
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">육안 스크래치 허용도</label>
                  <select value={qcPolicy.scratch} onChange={e => setQcPolicy({...qcPolicy, scratch: e.target.value})} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none">
                     <option>불가 (Zero Tolerance)</option><option>미세 허용 (Standard)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">사이즈 무상 수선 범위</label>
                  <input type="text" value={qcPolicy.resizing} onChange={e => setQcPolicy({...qcPolicy, resizing: e.target.value})} placeholder="예: ±1호 1회 무상" className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold outline-none" />
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
                 <ShieldAlert size={20} className="text-[#002366] mt-1" />
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-[#002366]">AS Policy Summary</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                       도금 마모는 자연적인 현상으로 면책되며, 스톤 분실의 경우 난집 파손 여부에 따라 보증 범위가 결정됩니다. 
                       위 정책을 공방과 합의된 사항으로 간주합니다.
                    </p>
                 </div>
              </div>
            </div>
            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(6)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase">이전</button>
              <button type="button" onClick={() => setStep(8)} className="px-10 py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">최종 검토 단계 <ArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {/* Step 8: Final Review */}
        {step === 8 && (
          <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="text-lg font-black mb-10 flex items-center gap-3 italic text-[#002366]">
              <div className="w-10 h-10 rounded-2xl bg-[#002366] text-white flex items-center justify-center text-xs">08</div>
              최종 비고 및 의뢰 확정
            </h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">전역 특이 사항 (Final Notes)</label>
              <textarea 
                rows={8}
                value={specialNote}
                onChange={e => setSpecialNote(e.target.value)}
                placeholder="- 출고 전 검수 사진 3장 이상(정면, 측면, 각인부) 전송 필수&#10;- 보석 감정서 정본 제품과 함께 동봉 요망"
                className="w-full px-8 py-8 bg-slate-50 border-2 border-transparent focus:border-[#002366] rounded-[32px] font-bold outline-none transition-all resize-none text-sm leading-relaxed"
              />
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-[32px] flex items-start gap-4">
               <Sparkles className="text-[#002366] mt-1 shrink-0" size={20}/>
               <div className="space-y-1">
                 <p className="text-xs font-black text-[#002366] uppercase tracking-wider">Artisan Agreement v1.1</p>
                 <p className="text-[11px] text-blue-700 font-medium leading-relaxed italic">
                   본 지시서는 공방과 디자이너 간의 법적 계약 근거로 활용됩니다. 기입된 실명 정보와 수치 데이터가 정확한지 최종 검토하십시오.
                 </p>
               </div>
            </div>

            <div className="mt-12 flex justify-between">
              <button type="button" onClick={() => setStep(7)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs uppercase transition-all">이전 단계</button>
              <button type="submit" disabled={isSubmitting} className="px-16 py-5 bg-[#002366] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <ClipboardCheck size={20}/>}
                v1.1 지시서 발행 및 프리뷰 생성
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewOrder;
