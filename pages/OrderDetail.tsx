
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ImageIcon,
  Check,
  Download,
  X,
  Maximize2,
  CreditCard,
  AlertCircle,
  ShieldAlert,
  Scissors,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  Lock,
  Gem,
  Building2,
  Hammer,
  Settings2,
  PlusCircle,
  Zap,
  Wallet,
  CircleDollarSign,
  ArrowRight,
  Activity,
  Send,
  History,
  FileText,
  Printer,
  ExternalLink,
  ShieldQuestion,
  ReceiptText,
  CreditCard as StripeIcon,
  Copy,
  Globe,
  Trash2,
  Eye,
  Smartphone,
  AlertTriangle,
  Info,
  Layers,
  Settings
} from 'lucide-react';
import { MOCK_ORDERS, getAllOrders, MOCK_USER, MOCK_ADMIN } from '../mockData';
import { OrderStatus, ProcessStatus, MaterialStatus, UserRole, Order, OrderAdjustment } from '../types';
import { StatusBadge } from './Dashboard';

interface PhotoLog {
  id: string;
  user: string;
  action: 'ADD' | 'DELETE';
  timestamp: string;
  fileName?: string;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const allOrders = getAllOrders();
  const initialOrder = allOrders.find(o => o.id === id);
  
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const userRole = localStorage.getItem('userRole') as UserRole;
  const isAdmin = userRole === UserRole.ADMIN;
  const currentUser = isAdmin ? MOCK_ADMIN.name : MOCK_USER.name;

  const [activeTab, setActiveTab] = useState<'timeline' | 'materials' | 'specs' | 'communication'>('timeline');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'stripe' | 'toss' | null>(null);
  
  const [photos, setPhotos] = useState<string[]>(initialOrder?.attachments || []);
  const [photoLogs, setPhotoLogs] = useState<PhotoLog[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!order) return <div className="p-8 text-center font-bold text-slate-400">Project not found.</div>;

  const getFullTimestamp = () => {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0') + ' ' + 
           String(now.getHours()).padStart(2, '0') + ':' + 
           String(now.getMinutes()).padStart(2, '0') + ':' + 
           String(now.getSeconds()).padStart(2, '0');
  };

  const addPhotoLog = (action: 'ADD' | 'DELETE', fileName?: string) => {
    const newLog: PhotoLog = {
      id: `log-${Date.now()}`,
      user: currentUser,
      action,
      timestamp: getFullTimestamp(),
      fileName
    };
    setPhotoLogs(prev => [newLog, ...prev]);
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos(prev => [...prev, result]);
        addPhotoLog('ADD', files[0].name);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmIndex !== null) {
      const index = deleteConfirmIndex;
      setPhotos(prev => prev.filter((_, i) => i !== index));
      addPhotoLog('DELETE', `Asset_Photo_${index + 1}`);
      setDeleteConfirmIndex(null);
    }
  };

  const updateLocalStorage = (updatedOrder: Order) => {
    const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    const newLocalOrders = localOrders.some((o: Order) => o.id === updatedOrder.id) 
      ? localOrders.map((o: Order) => o.id === updatedOrder.id ? updatedOrder : o)
      : [updatedOrder, ...localOrders];
    localStorage.setItem('user_orders', JSON.stringify(newLocalOrders));
  };

  const handleAdminApproveQuote = (quote: number) => {
    const updatedOrder = { 
      ...order, 
      finalQuote: quote, 
      status: OrderStatus.PAYMENT_WAITING,
      lastUpdate: new Date().toLocaleString()
    };
    setOrder(updatedOrder);
    updateLocalStorage(updatedOrder);
  };

  const handleProcessPaymentComplete = () => {
    if (!paymentMethod && !isAdmin) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      const updatedOrder = { 
        ...order, 
        paymentStatus: '결제완료',
        status: OrderStatus.PRODUCTION,
        lastUpdate: new Date().toLocaleString()
      };
      setOrder(updatedOrder);
      updateLocalStorage(updatedOrder);
      setIsProcessingPayment(false);
      
      const payHistory = JSON.parse(localStorage.getItem('payment_history') || '[]');
      payHistory.push({
        id: `PAY-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: `${updatedOrder.itemName} 결제 건`,
        amount: `₩${updatedOrder.finalQuote?.toLocaleString()}`,
        status: '승인완료'
      });
      localStorage.setItem('payment_history', JSON.stringify(payHistory));
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('계좌번호가 복사되었습니다.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* Admin Control Bar */}
      {isAdmin && (
        <div className="bg-[#002366] text-white p-6 rounded-[32px] shadow-xl border border-white/10 flex items-center justify-between animate-in slide-in-from-top-4">
           <div className="flex items-center gap-3">
              <Settings2 size={20} className="text-blue-300" />
              <span className="font-bold text-sm uppercase tracking-widest">Master Admin Console</span>
           </div>
           <div className="flex gap-3">
              {(order.status === OrderStatus.RECEIVED || order.status === OrderStatus.QUOTE_PENDING) && (
                <button 
                  onClick={() => handleAdminApproveQuote(3500000)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <CheckCircle2 size={14}/> 견적 확정 및 결제 요청
                </button>
              )}
              {order.status === OrderStatus.PAYMENT_WAITING && (
                <button 
                  onClick={handleProcessPaymentComplete}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <CreditCard size={14}/> 수동 결제 완료 처리
                </button>
              )}
           </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all group">
            <ChevronLeft size={20} className="group-active:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter border border-slate-100">{order.orderNumber}</span>
              <StatusBadge status={order.status} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{order.itemName}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-10 shadow-sm">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-10 overflow-x-auto hide-scrollbar">
              {(['timeline', 'materials', 'specs', 'communication'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[100px] py-3.5 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'timeline' ? 'Process' : tab === 'materials' ? 'Assets' : tab === 'specs' ? 'Specs' : 'Consult'}
                </button>
              ))}
            </div>

            {activeTab === 'timeline' && (
              <div className="space-y-10 px-2">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="flex gap-8 relative">
                    {idx < order.timeline.length - 1 && <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-100" />}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${step.status === ProcessStatus.COMPLETED ? 'bg-[#002366] text-white shadow-md' : step.status === ProcessStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600 ring-4 ring-blue-50' : 'bg-slate-50 text-slate-200'}`}>
                      {step.status === ProcessStatus.COMPLETED ? <Check size={20} /> : step.status === ProcessStatus.IN_PROGRESS ? <Loader2 size={20} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <div className="pb-8 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-slate-800">{step.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{step.updatedAt}</span>
                      </div>
                      {step.comment && <div className="text-sm text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-5 rounded-[24px] border border-slate-50 italic">"{step.comment}"</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 gap-4">
                {order.materials.map(m => (
                  <div key={m.id} className="p-7 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-600 group-hover:text-[#002366] border border-slate-100 transition-colors">
                          {m.type === '금속' ? <Scissors size={24} /> : <Gem size={24} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.type} IDENTITY</p>
                          <p className="font-bold text-slate-800 text-lg">{m.spec}</p>
                          <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase">Lot: {m.linkedLotNumber || 'Allocating...'}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-8 animate-in fade-in">
                 {order.specs ? (
                   <>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                           <div className="flex items-center gap-3 mb-4 text-[#002366]">
                              <Scissors size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Metal Details</h4>
                           </div>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs"><span className="text-slate-400">Type</span><span className="font-bold">{order.specs.metal.type}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">Color</span><span className="font-bold">{order.specs.metal.color}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">Finish</span><span className="font-bold">{order.specs.metal.finish}</span></div>
                           </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                           <div className="flex items-center gap-3 mb-4 text-[#002366]">
                              <Gem size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Main Stone</h4>
                           </div>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs"><span className="text-slate-400">Spec</span><span className="font-bold">{order.specs.mainStone.type}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">Setting</span><span className="font-bold">{order.specs.mainStone.setting}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-slate-400">Origin</span><span className="font-bold">{order.specs.mainStone.origin}</span></div>
                           </div>
                        </div>
                     </div>
                     <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                        <h4 className="text-[10px] font-black uppercase text-[#002366] mb-3 flex items-center gap-2">
                           <Info size={14}/> Designer Special Notes
                        </h4>
                        <p className="text-sm font-bold text-slate-700 italic leading-relaxed">
                           "{order.specs.specialNote || 'No additional specifications provided.'}"
                        </p>
                     </div>
                   </>
                 ) : (
                   <div className="py-20 text-center">
                      <AlertCircle size={40} className="mx-auto text-slate-100 mb-4" />
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Legacy Order: No Detailed Specs</p>
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 hide-scrollbar">
                   <div className="flex justify-start">
                      <div className="max-w-[80%] p-6 rounded-[28px] bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200 text-sm font-medium">
                        디자이너와 제작팀에게 궁금한 점을 문의하세요.
                      </div>
                   </div>
                </div>
                <div className="flex gap-3 p-3 bg-slate-100 rounded-[28px] border border-slate-200">
                   <input type="text" placeholder="Send a message..." className="flex-1 px-5 py-2 bg-transparent outline-none font-medium text-sm" />
                   <button className="p-3 bg-[#002366] text-white rounded-xl shadow-lg hover:bg-black transition-all active:scale-90"><Send size={18}/></button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <ImageIcon size={16} /> Asset Photos
               </h3>
               <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">Tracked</span>
             </div>
             
             <div className="grid grid-cols-2 gap-3 mb-6">
                {photos.map((at, ai) => (
                  <div key={ai} className="aspect-square rounded-[24px] overflow-hidden border border-slate-100 shadow-sm relative group">
                    <img src={at} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="asset" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                       <div className="flex gap-2">
                         <button 
                          onClick={() => setPreviewImage(at)}
                          className="p-2.5 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shadow-xl"
                          title="확대 보기"
                         >
                            <Eye size={18} />
                         </button>
                         <button 
                          onClick={() => setDeleteConfirmIndex(ai)}
                          className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-xl"
                          title="휴지통으로 이동"
                         >
                            <Trash2 size={18} />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => photoInputRef.current?.click()}
                  className="aspect-square rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:text-[#002366] hover:border-[#002366]/20 transition-all gap-1 group shadow-inner"
                >
                   <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Add Asset</span>
                </button>
                <input type="file" ref={photoInputRef} onChange={handleAddPhoto} className="hidden" accept="image/*" />
             </div>
          </div>

          {/* PAYMENT Center */}
          {order.paymentStatus !== '결제완료' && (
            <div className="bg-white rounded-[40px] border-2 border-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                <CreditCard size={16} /> Payment Center
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 shadow-inner relative overflow-hidden group">
                   <div className="relative z-10">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Amount Due</p>
                     <p className="text-2xl font-black text-[#002366] italic tracking-tighter">
                       {order.status === OrderStatus.PAYMENT_WAITING 
                         ? `₩${order.finalQuote?.toLocaleString()}` 
                         : '₩ 검수중'}
                     </p>
                   </div>
                   <Zap size={60} className="absolute -right-2 -bottom-2 text-[#002366] opacity-[0.03]" />
                </div>
                
                {order.status === OrderStatus.PAYMENT_WAITING ? (
                  <>
                    <div className="grid grid-cols-4 gap-2">
                      <button onClick={() => setPaymentMethod('card')} className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'bg-[#002366] border-[#002366] text-white shadow-lg' : 'bg-white border-slate-50 hover:border-[#002366]/20 text-slate-400'}`}>
                        <CreditCard size={16} />
                        <span className="text-[7px] font-black uppercase">카드</span>
                      </button>
                      <button onClick={() => setPaymentMethod('toss')} className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'toss' ? 'bg-[#0064FF] border-[#0064FF] text-white shadow-lg' : 'bg-white border-slate-50 hover:border-[#0064FF]/20 text-slate-400'}`}>
                        <Smartphone size={16} />
                        <span className="text-[7px] font-black uppercase">Toss</span>
                      </button>
                      <button onClick={() => setPaymentMethod('bank')} className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'bank' ? 'bg-[#002366] border-[#002366] text-white shadow-lg' : 'bg-white border-slate-50 hover:border-[#002366]/20 text-slate-400'}`}>
                        <Building2 size={16} />
                        <span className="text-[7px] font-black uppercase">무통장</span>
                      </button>
                      <button onClick={() => setPaymentMethod('stripe')} className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'stripe' ? 'bg-[#635BFF] border-[#635BFF] text-white shadow-lg' : 'bg-white border-slate-50 hover:border-[#635BFF]/20 text-slate-400'}`}>
                        <Globe size={16} />
                        <span className="text-[7px] font-black uppercase">Stripe</span>
                      </button>
                    </div>
                    <button 
                      onClick={handleProcessPaymentComplete}
                      disabled={isProcessingPayment || !paymentMethod}
                      className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                      {isProcessingPayment ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} className="text-blue-300" />}
                      Complete Payment
                    </button>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-4 relative z-10 border-t border-slate-100 pt-8">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 border-2 border-dashed border-slate-200 animate-pulse">
                        <ShieldQuestion size={32} />
                     </div>
                     <div className="space-y-1">
                       <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Technical Reviewing</p>
                       <p className="text-[10px] font-bold text-slate-400 leading-tight">작성하신 지시서를 바탕으로 공방에서 견적을 산출 중입니다.</p>
                     </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAYMENT COMPLETION INFO */}
          {order.paymentStatus === '결제완료' && (
            <div className="bg-emerald-50 rounded-[40px] border border-emerald-100 p-6 shadow-sm overflow-hidden relative animate-in fade-in duration-700">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg">
                      <CheckCircle2 size={18} />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-[0.1em] text-emerald-700">Payment Completed</h3>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowReceipt(true)} className="flex-1 py-3 bg-white text-emerald-600 rounded-xl font-black text-[9px] uppercase border border-emerald-100 shadow-sm hover:bg-emerald-100 transition-all">영수증 확인</button>
                </div>
              </div>
              <ShieldCheck size={120} className="absolute -right-6 -bottom-6 text-emerald-200 opacity-20 pointer-events-none" />
            </div>
          )}

        </div>
      </div>

      {/* Image Magnify Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
           <div className="absolute top-8 right-8 z-[210]">
              <button onClick={() => setPreviewImage(null)} className="p-4 bg-white/10 hover:bg-rose-500 text-white rounded-2xl backdrop-blur-md transition-all shadow-2xl group"><X size={32}/></button>
           </div>
           <div className="w-full h-full flex items-center justify-center">
              <img src={previewImage} className="max-w-full max-h-[90vh] object-contain rounded-[40px] animate-in zoom-in-95 duration-500 shadow-2xl" onClick={(e) => e.stopPropagation()} alt="Enlarged asset" />
           </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[48px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">ObligeWorks Receipt</h2>
                 <button onClick={() => setShowReceipt(false)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={28}/></button>
              </div>
              <div className="border-t-2 border-b-2 border-slate-100 py-10 space-y-6">
                <div className="flex justify-between text-xs font-bold">
                   <span className="text-slate-400 uppercase tracking-widest">Order No.</span>
                   <span className="text-slate-900 tracking-tight">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-sm font-black text-slate-900 uppercase italic">Total Payment</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tighter italic">₩{order.finalQuote?.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-10 flex gap-3">
                 <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                    <Download size={18}/> Save as PDF
                 </button>
              </div>
              <Gem size={350} className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 pointer-events-none" />
           </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
