
import React, { useState, useEffect } from 'react';
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
  Activity,
  UserCheck,
  Settings2,
  Tag
} from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';
import { InventoryAuditLog, AdjustmentReason } from '../../types';

const LotManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightedLot = (location.state as any)?.lot;
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  
  const selectedLot = MOCK_INVENTORY.find(i => i.id === selectedLotId);

  // 로트 정보 및 수치 조정을 위한 통합 상태 관리
  const [adjustData, setAdjustData] = useState({
    amount: '',
    reason: 'ERROR' as AdjustmentReason,
    note: '',
    operator: '',
    lotNumber: '', // 로트 번호 수정용
    category: ''   // 카테고리 수정용
  });

  // 모달이 열릴 때 선택된 로트의 기본 정보로 초기화
  useEffect(() => {
    if (selectedLot) {
      setAdjustData({
        amount: '',
        reason: 'ERROR',
        note: '',
        operator: '',
        lotNumber: selectedLot.lotNumber,
        category: selectedLot.category
      });
    }
  }, [selectedLotId, selectedLot]);

  const mockAuditLogs: InventoryAuditLog[] = [
    { id: 'log-1', itemId: 'inv-1', changeAmount: -12.5, afterStock: 850.5, reason: 'REMAKE', orderId: 'JF-2024-001', timestamp: '2024-06-12 14:00', operatorName: '김마스터' },
    { id: 'log-2', itemId: 'inv-1', changeAmount: -0.5, afterStock: 863.0, reason: 'LOSS', timestamp: '2024-06-10 09:15', operatorName: '장윤진' },
    { id: 'log-3', itemId: 'inv-1', changeAmount: 1000.0, afterStock: 863.5, reason: 'INITIAL_STOCK', timestamp: '2024-06-01 11:30', operatorName: 'System' },
  ];

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustData.operator.trim()) {
      alert("감사 로그 기록을 위해 수정 담당자 성함을 반드시 입력해야 합니다.");
      return;
    }
    
    const changeDesc = [];
    if (selectedLot?.lotNumber !== adjustData.lotNumber) changeDesc.push(`LOT ID: ${selectedLot?.lotNumber} -> ${adjustData.lotNumber}`);
    if (selectedLot?.category !== adjustData.category) changeDesc.push(`CATEGORY: ${selectedLot?.category} -> ${adjustData.category}`);
    if (adjustData.amount) changeDesc.push(`STOCK: ${adjustData.amount}${selectedLot?.unit} 조정`);

    alert(`[자산 기술 감사 완료]\n담당자: ${adjustData.operator}\n내용: ${changeDesc.join(', ') || '정보 보정'}\n\n모든 변경 사항은 마스터 로그에 영구 귀속되었습니다.`);
    
    setSelectedLotId(null);
    setAdjustData({ amount: '', reason: 'ERROR', note: '', operator: '', lotNumber: '', category: '' });
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
                      <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">{item.category} / {item.subCategory}</span>
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
           <div className="bg-white rounded-[48px] w-full max-w-5xl p-12 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-10 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-[#002366] rounded-2xl"><Layers size={28}/></div>
                    <div>
                       <h2 className="text-2xl font-black text-slate-900">로트 통합 분석 및 기술 감사</h2>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                         CURRENT LOT: {selectedLot.lotNumber} • {selectedLot.ownership} ASSET
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedLotId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={32}/></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto pr-4 hide-scrollbar">
                 {/* Left: Audit Logs */}
                 <div className="space-y-8">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={16} /> Audit Trail (Recent Activities)
                    </h4>
                    <div className="space-y-6">
                        {mockAuditLogs.map((log, i) => (
                        <div key={i} className="flex gap-6 group relative">
                            {i < mockAuditLogs.length - 1 && <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-100"></div>}
                            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 z-10 shadow-sm border border-slate-100`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${log.changeAmount < 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            </div>
                            <div className="pb-8 flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{log.timestamp}</p>
                                    <span className={`text-[10px] font-black ${log.changeAmount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.changeAmount > 0 ? '+' : ''}{log.changeAmount}{selectedLot.unit}</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900">{log.reason} {log.orderId && <span className="text-[#002366] underline ml-1">@{log.orderId}</span>}</h4>
                                <p className="text-[11px] text-slate-500 font-medium mt-1 italic">Operator: {log.operatorName}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                 </div>

                 {/* Right: Adjustment Interface */}
                 <div className="bg-slate-50 rounded-[40px] p-8 space-y-8 h-fit border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-3">
                        <Settings2 className="text-[#002366]" size={24} />
                        <h4 className="text-lg font-black text-slate-900">로트 정보 및 수치 보정</h4>
                    </div>
                    
                    <form onSubmit={handleAdjust} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Tag size={12}/> LOT ID</label>
                              <input 
                                  type="text" 
                                  value={adjustData.lotNumber}
                                  onChange={e => setAdjustData({...adjustData, lotNumber: e.target.value})}
                                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-[#002366]/10 font-bold text-sm"
                                  required
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Box size={12}/> Category</label>
                              <select 
                                  value={adjustData.category}
                                  onChange={e => setAdjustData({...adjustData, category: e.target.value})}
                                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-[#002366]/10 font-black text-[10px] uppercase"
                              >
                                  <option value="METAL">METAL</option>
                                  <option value="STONE">STONE</option>
                                  <option value="OTHER">OTHER</option>
                              </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">수량 조정 ({selectedLot.unit})</label>
                            <input 
                                type="number" 
                                value={adjustData.amount}
                                onChange={e => setAdjustData({...adjustData, amount: e.target.value})}
                                placeholder="예: -0.5 (차감) / 1.0 (추가)"
                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-[#002366]/10 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">수정 사유</label>
                            <select 
                                value={adjustData.reason}
                                onChange={e => setAdjustData({...adjustData, reason: e.target.value as AdjustmentReason})}
                                className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-[#002366]/10 font-black text-[10px] uppercase"
                            >
                                <option value="ERROR">데이터 기입/계량 오차</option>
                                <option value="LOSS">자재 분실</option>
                                <option value="DAMAGE">파손/변형</option>
                                <option value="REMAKE">재제작 투입</option>
                                <option value="SAMPLE">샘플 제작용</option>
                            </select>
                        </div>

                        {/* 담당자 실명 입력 필드 - 필수 */}
                        <div className="space-y-2 pt-4 border-t border-slate-200/60 bg-amber-50/50 -mx-8 px-8 py-4">
                            <label className="text-[11px] font-black text-[#002366] uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                <UserCheck size={16}/> 기술 감사 담당자 (실명 필수)
                            </label>
                            <input 
                                type="text" 
                                value={adjustData.operator}
                                onChange={e => setAdjustData({...adjustData, operator: e.target.value})}
                                placeholder="예: 장윤진 마스터"
                                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-amber-200 outline-none focus:border-[#002366] focus:ring-4 focus:ring-[#002366]/5 font-black text-sm text-slate-800 shadow-sm"
                                required
                            />
                            <p className="text-[10px] text-amber-800 font-bold px-1 italic">
                                * 담당자 성함이 없는 기록은 확정되지 않습니다.
                            </p>
                        </div>

                        <button 
                          type="submit" 
                          disabled={!adjustData.operator.trim()}
                          className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                          <ShieldCheck size={16} /> 기술 감사 승인 및 보정 확정
                        </button>
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
