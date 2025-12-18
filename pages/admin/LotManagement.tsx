
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Layers, 
  Search, 
  Clock, 
  Box, 
  User, 
  ArrowUpRight, 
  Database, 
  Gem, 
  Coins, 
  X, 
  CheckCircle2, 
  RotateCcw, 
  Package, 
  ShieldCheck,
  AlertTriangle,
  History,
  Activity
} from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';
import { InventoryAuditLog, AdjustmentReason } from '../../types';

const LotManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightedLot = (location.state as any)?.lot;
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  
  // 5. 감사 로그 및 조정 사유 필수화
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustData, setAdjustData] = useState({
    amount: '',
    reason: 'ERROR' as AdjustmentReason,
    note: ''
  });

  const selectedLot = MOCK_INVENTORY.find(i => i.id === selectedLotId);

  const mockAuditLogs: InventoryAuditLog[] = [
    { id: 'log-1', itemId: 'inv-1', changeAmount: -12.5, afterStock: 850.5, reason: 'REMAKE', orderId: 'JF-2024-001', timestamp: '2024-06-12 14:00', operatorName: '김마스터' },
    { id: 'log-2', itemId: 'inv-1', changeAmount: -0.5, afterStock: 863.0, reason: 'LOSS', timestamp: '2024-06-10 09:15', operatorName: '장윤진' },
    { id: 'log-3', itemId: 'inv-1', changeAmount: 1000.0, afterStock: 863.5, reason: 'INITIAL_STOCK', timestamp: '2024-06-01 11:30', operatorName: 'System' },
  ];

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`조정 완료: ${adjustData.reason} 사유로 ${adjustData.amount}${selectedLot?.unit} 수치가 보정되었습니다.\n마스터 감사 로그에 영구 기록됩니다.`);
    setIsAdjustmentModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/inventory')} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#002366]">로트 단위 정밀 이력 관제 (Lot Track)</h1>
            <p className="text-slate-500 font-medium">개별 입고 단위별 자재 이동, 오더 할당 및 공정 소진 이력</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="로트 번호 또는 자재명 검색..." 
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-[#002366]" />
              전체 로트 타임라인 리스트
           </h3>
           <span className="text-[10px] font-black text-slate-400 uppercase">최근 90일 활동 이력 기준</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">LOT ID / CATEGORY</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Ownership</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Arrival / Price</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Net Balance</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_INVENTORY.map((item) => (
                <tr key={item.id} className={`hover:bg-blue-50/20 transition-all group ${highlightedLot === item.lotNumber ? 'bg-blue-50 animate-pulse ring-2 ring-[#002366]/10' : ''}`}>
                   <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-[#002366] uppercase mb-1">{item.lotNumber}</p>
                      <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">{item.subCategory}</span>
                   </td>
                   <td className="px-8 py-6 text-center">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                          item.ownership === 'BRAND' ? 'bg-blue-100 text-[#002366]' : 
                          item.ownership === 'CLIENT' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                      }`}>{item.ownership}</span>
                   </td>
                   <td className="px-8 py-6 text-sm font-medium text-slate-500">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold">{item.arrivalDate}</span>
                        <span className="text-[10px]">₩{item.unitPrice.toLocaleString()} / {item.unit}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'SAFE' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                         <span className="text-xs font-bold text-slate-700">{(item.stock - item.reservedStock).toLocaleString()} {item.unit} <span className="text-slate-300 font-medium">(Reserved: {item.reservedStock})</span></span>
                      </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedLotId(item.id)}
                        className="p-2.5 bg-slate-50 text-[#002366] hover:bg-[#002366] hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 font-black text-[10px] uppercase ml-auto"
                      >
                         <History size={14} /> 이력/조정
                      </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lot Detail & Audit Modal */}
      {selectedLotId && selectedLot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[48px] w-full max-w-4xl p-12 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-10 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-[#002366] rounded-2xl"><Layers size={28}/></div>
                    <div>
                       <h2 className="text-2xl font-black text-slate-900">로트 통합 분석 및 기술 감사</h2>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">LOT: {selectedLot.lotNumber} • {selectedLot.ownership} ASSET</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedLotId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={32}/></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto pr-4 hide-scrollbar">
                 {/* Audit Logs */}
                 <div className="space-y-8">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={16} /> Audit Trail (Recent 10)
                    </h4>
                    <div className="space-y-6">
                        {mockAuditLogs.map((log, i) => (
                        <div key={i} className="flex gap-6 group relative">
                            {i < mockAuditLogs.length - 1 && <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-100"></div>}
                            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 z-10 shadow-sm border border-slate-100`}>
                                <div className={`w-2 h-2 rounded-full ${log.changeAmount < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            </div>
                            <div className="pb-8 flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{log.timestamp}</p>
                                    <span className={`text-[10px] font-black ${log.changeAmount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.changeAmount > 0 ? '+' : ''}{log.changeAmount}{selectedLot.unit}</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900">{log.reason} {log.orderId && <span className="text-[#002366] underline ml-1">@{log.orderId}</span>}</h4>
                                <p className="text-[11px] text-slate-500 font-medium mt-1">Operator: {log.operatorName}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                 </div>

                 {/* Adjustment Interface */}
                 <div className="bg-slate-50 rounded-[40px] p-8 space-y-8 h-fit border border-slate-100">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-amber-500" size={24} />
                        <h4 className="text-lg font-black text-slate-900">긴급 수치 조정 (Audit Required)</h4>
                    </div>
                    
                    <form onSubmit={handleAdjust} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">조정 수량 ({selectedLot.unit})</label>
                            <input 
                                type="number" 
                                value={adjustData.amount}
                                onChange={e => setAdjustData({...adjustData, amount: e.target.value})}
                                placeholder="예: -0.5 또는 1.2"
                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-[#002366]/10 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">조정 사유 선택</label>
                            <select 
                                value={adjustData.reason}
                                onChange={e => setAdjustData({...adjustData, reason: e.target.value as AdjustmentReason})}
                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-[#002366]/10 font-black text-xs uppercase"
                            >
                                <option value="ERROR">전산 계량 오차 (Scale Error)</option>
                                <option value="LOSS">자재 분실 (Inventory Loss)</option>
                                <option value="DAMAGE">파손/변형 (Material Damaged)</option>
                                <option value="REMAKE">재제작 공정 투입 (Remake Process)</option>
                                <option value="SAMPLE">샘플 제작용 (Sample Usage)</option>
                            </select>
                        </div>
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                            <ShieldCheck className="text-amber-600 shrink-0" size={20} />
                            <p className="text-[10px] text-amber-900 leading-relaxed font-bold">
                                모든 재고 조정은 시스템 마스터 계정의 기술 감사를 받으며, 임의 삭제가 불가능합니다. 실물 실사 후 기록하십시오.
                            </p>
                        </div>
                        <button type="submit" className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">감사 로그 등록 및 조정 확정</button>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LotManagement;
