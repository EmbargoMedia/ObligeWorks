
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Database, Gem, Coins, AlertCircle, 
  Search, ArrowRight, TrendingUp, TrendingDown,
  ArrowUpRight, Plus, Box, Info, Trash2, PlusCircle, X, ShieldCheck, User, Layers
} from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';
import { InventoryItem } from '../../types';

const AssetDrilldown: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [activeTab, setActiveTab] = useState<'METAL' | 'STONE' | 'ALERTS'>((location.state as any)?.tab || 'METAL');
  const [search, setSearch] = useState('');
  
  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.lotNumber.toLowerCase().includes(search.toLowerCase());
      if (activeTab === 'ALERTS') return matchesSearch && i.status !== 'SAFE' && i.ownership === 'BRAND';
      return matchesSearch && i.category === activeTab;
    });
  }, [items, activeTab, search]);

  const stats = useMemo(() => {
    const subTotals = filteredItems.reduce((acc, curr) => {
        acc.stock += curr.stock;
        acc.reserved += curr.reservedStock;
        return acc;
    }, { stock: 0, reserved: 0 });
    return subTotals;
  }, [filteredItems]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/inventory')} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#002366]">자산 카테고리 관제 포탈</h1>
            <p className="text-slate-500 font-medium">로트 단위 자재 할당 및 잔량 현황 상세 분석</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#002366] text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2">Category Summary</p>
            <h3 className="text-2xl font-black italic">{activeTab} ASSETS</h3>
            <div className="mt-8 flex justify-between items-end border-t border-white/10 pt-6">
                <div>
                    <p className="text-[9px] font-bold opacity-60 uppercase">Total Items</p>
                    <p className="text-xl font-black">{filteredItems.length}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold opacity-60 uppercase">Live Value (Est.)</p>
                    <p className="text-xl font-black text-blue-300">₩42.8M</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Stock (g/pcs)</p>
            <h3 className="text-3xl font-black text-slate-900">{(stats.stock - stats.reserved).toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 mt-4">
                <ArrowUpRight size={14} /> 오더 즉시 투입 가능
            </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Allocated (Reserved)</p>
            <h3 className="text-3xl font-black text-amber-500">{stats.reserved.toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 mt-4">
                <Layers size={14} /> 미차감 공정 예약분
            </div>
        </div>

        <div className="bg-rose-50 p-8 rounded-[40px] border border-rose-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Procurement Priority</p>
            <h3 className="text-3xl font-black text-rose-600">{filteredItems.filter(i => i.status === 'LOW').length}</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-rose-400 mt-4">
                <AlertCircle size={14} /> 임계치 미달 로트
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['METAL', 'STONE', 'ALERTS'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-[#002366] text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
                type="text" 
                placeholder="로트 또는 품목명 검색..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#002366]/10"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredItems.map(item => (
            <div key={item.id} className="p-8 flex items-center justify-between hover:bg-blue-50/10 transition-all group">
              <div className="flex items-center gap-8">
                <div className={`p-4 rounded-3xl ${item.ownership === 'BRAND' ? 'bg-blue-50 text-[#002366]' : 'bg-rose-50 text-rose-500'} transition-transform group-hover:scale-110`}>
                   {item.category === 'METAL' ? <Coins size={24} /> : <Gem size={24} />}
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.lotNumber}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${item.status === 'LOW' ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>{item.status}</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 group-hover:text-[#002366] transition-colors">{item.name}</h4>
                   <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 italic">입고: {item.arrivalDate}</span>
                      <span className="text-[10px] font-bold text-slate-400 italic">단가: ₩{item.unitPrice.toLocaleString()} / {item.unit}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Stock</p>
                    <p className="text-xl font-black text-slate-900">{item.stock.toLocaleString()} <span className="text-xs opacity-30 uppercase">{item.unit}</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-amber-500 uppercase mb-1">Allocated</p>
                    <p className="text-xl font-black text-amber-500">{item.reservedStock.toLocaleString()} <span className="text-xs opacity-30 uppercase">{item.unit}</span></p>
                 </div>
                 <div className="w-px h-10 bg-slate-100"></div>
                 <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">
                    로트 상세 관제
                 </button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-32 text-center">
              <Database size={64} className="mx-auto text-slate-100 mb-6" />
              <p className="text-slate-400 font-black uppercase tracking-widest">No matching lots found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDrilldown;
