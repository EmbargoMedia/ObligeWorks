
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Search, 
  AlertCircle, 
  ChevronLeft, 
  Box, 
  Zap, 
  Filter, 
  PlusCircle, 
  RotateCcw, 
  Layers, 
  TrendingDown, 
  User, 
  Gem, 
  Coins, 
  ArrowRight,
  ClipboardList,
  LayoutDashboard
} from 'lucide-react';
import { MOCK_INVENTORY } from '../../mockData';
import { InventoryItem, OwnershipType } from '../../types';

const AdminInventory: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [ownerFilter, setOwnerFilter] = useState<OwnershipType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const displayItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.lotNumber.toLowerCase().includes(search.toLowerCase());
      const matchesOwner = ownerFilter === 'ALL' || item.ownership === ownerFilter;
      return matchesSearch && matchesOwner;
    });
  }, [items, ownerFilter, search]);

  const stats = useMemo(() => {
    const brandAssets = items.filter(i => i.ownership === 'BRAND');
    const totalValuation = brandAssets.reduce((acc, curr) => acc + (curr.stock * curr.unitPrice), 0);
    const lowStockCount = items.filter(i => i.status === 'LOW').length;
    const clientStockCount = items.filter(i => i.ownership === 'CLIENT').length;

    return { totalValuation, lowStockCount, clientStockCount };
  }, [items]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#002366] tracking-tight">Inventory Master Control</h1>
            <p className="text-slate-500 font-medium">기업 자산 및 고객 지참물 로트 단위 통합 관제 시스템</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => navigate('/admin/inventory/lots/new')}
              className="flex items-center gap-2 bg-[#002366] text-white px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-[#001A4D] transition-all"
            >
                <PlusCircle size={16} /> 신규 로트 입고
            </button>
            <button 
              onClick={() => navigate('/admin/inventory/overview')}
              className="flex items-center gap-2 bg-white border border-slate-200 text-[#002366] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
                <LayoutDashboard size={16} /> 통합 관제 리포트
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/admin/inventory/overview', { state: { tab: 'valuation' } })}
          className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm group hover:border-[#002366]/20 transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-50 text-[#002366] rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingDown size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Asset Valuation</p>
                    <h3 className="text-2xl font-black text-slate-900">₩{(stats.totalValuation / 1000000).toFixed(1)}M</h3>
                </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t pt-4">
                <span>자산 가치 분석 상세 보기</span>
                <ArrowRight size={14} />
            </div>
        </div>

        <div 
          onClick={() => navigate('/admin/inventory/overview', { state: { tab: 'alerts' } })}
          className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm group hover:border-rose-200 transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <AlertCircle size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock Alerts</p>
                    <h3 className="text-2xl font-black text-rose-600">{stats.lowStockCount} Items</h3>
                </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-400 border-t pt-4">
                <span>부족 자재 현황 상세 보기</span>
                <ArrowRight size={14} />
            </div>
        </div>

        <div 
          onClick={() => navigate('/admin/inventory/overview', { state: { tab: 'client' } })}
          className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm group hover:border-indigo-200 transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <User size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client-Brought Items</p>
                    <h3 className="text-2xl font-black text-slate-900">{stats.clientStockCount} Records</h3>
                </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 border-t pt-4">
                <span>고객 지참물 리스트 상세보기</span>
                <ArrowRight size={14} />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b flex flex-col md:flex-row gap-6 items-center bg-slate-50/30">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="로트 번호, 자재 명칭, 수급 파트너 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] focus:ring-4 focus:ring-[#002366]/5 outline-none transition-all font-bold text-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
            {(['ALL', 'BRAND', 'WORKSHOP', 'CLIENT'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOwnerFilter(type)}
                className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all border ${
                  ownerFilter === type 
                  ? 'bg-[#002366] text-white border-[#002366] shadow-lg' 
                  : 'bg-white text-slate-400 border-slate-200 hover:border-[#002366]/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Lot ID / Ownership</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Material Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Allocated (Reserved)</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Available Stock</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-black text-[#002366] mb-1 uppercase">{item.lotNumber}</p>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        item.ownership === 'BRAND' ? 'bg-blue-100 text-[#002366]' : 
                        item.ownership === 'CLIENT' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>{item.ownership}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-white transition-colors`}>
                            {item.category === 'METAL' ? <Coins size={16} /> : <Gem size={16} />}
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 group-hover:text-[#002366] transition-colors">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Arrival: {item.arrivalDate}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100/50">
                        <Layers size={12} />
                        <span className="text-xs font-black">{item.reservedStock} <span className="text-[9px] opacity-60">{item.unit}</span></span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <p className={`text-base font-black ${item.status === 'LOW' ? 'text-rose-500' : 'text-slate-900'}`}>
                            {(item.stock - item.reservedStock).toLocaleString()} <span className="text-[10px] opacity-40 uppercase">{item.unit}</span>
                        </p>
                        {item.status === 'LOW' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => navigate('/admin/inventory/lots', { state: { lot: item.lotNumber } })}
                      className="p-2.5 hover:bg-[#002366] hover:text-white rounded-xl text-slate-300 transition-all shadow-sm"
                    >
                        <ClipboardList size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
