
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Server, ShieldCheck, Globe, Activity, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const SupplyChainSync: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('공급망 시스템 전역 동기화가 완료되었습니다.');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#002366]">실시간 공급망 동기화 포탈</h1>
            <p className="text-slate-500 font-medium">파트너 공방 및 해외 자재 수급망과의 데이터 통신 현황입니다.</p>
          </div>
        </div>
        <button 
          onClick={handleManualSync}
          disabled={isSyncing}
          className="bg-[#002366] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {isSyncing ? 'Synchronizing...' : '전체 수동 동기화 실행'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Global Network', value: 'Connected', icon: Globe, color: 'text-blue-500' },
          { label: 'Local Workshops', value: '12 Active', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'System Latency', value: '45ms', icon: Activity, color: 'text-amber-500' },
          { label: 'Data Integrity', value: '99.9%', icon: Server, color: 'text-[#002366]' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
             <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800">공급망 실시간 연동 리스트</h3>
           <span className="text-[10px] font-black text-emerald-500 animate-pulse flex items-center gap-1.5"><Activity size={12}/> LIVE FEED</span>
        </div>
        <div className="divide-y divide-slate-50">
           {[
             { name: 'GIA New York Central Lab', type: 'API Connection', status: 'Healthy', time: '12 sec ago' },
             { name: '청담 아틀리에 메인 서버', type: 'Database Sync', status: 'Healthy', time: '5 sec ago' },
             { name: 'Antwerp Diamond Exchange', type: 'Market Price Feed', status: 'Slow', time: '1 min ago' },
             { name: '종로 골드 마스터즈', type: 'Manual Check', status: 'Pending', time: '14 min ago' },
             { name: 'HK Jewelry Expo Partner', type: 'External Feed', status: 'Offline', time: '2 hours ago' },
           ].map((partner, i) => (
             <div key={i} className="p-8 flex items-center justify-between hover:bg-blue-50/20 transition-all group">
                <div className="flex items-center gap-6">
                   <div className={`w-3 h-3 rounded-full ${partner.status === 'Healthy' ? 'bg-emerald-500' : partner.status === 'Slow' ? 'bg-amber-500' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]'}`}></div>
                   <div>
                      <h4 className="font-bold text-slate-900">{partner.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">{partner.type} • {partner.time}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                     partner.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 
                     partner.status === 'Slow' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                   }`}>{partner.status}</span>
                   <button className="p-2 hover:bg-slate-100 rounded-xl transition-all"><RefreshCw size={14} className="text-slate-300" /></button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SupplyChainSync;
