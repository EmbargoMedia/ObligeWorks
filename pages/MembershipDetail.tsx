
import React, { useState } from 'react';
// Added Link to imports from react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Award, 
  ArrowUpRight,
  Zap,
  Target,
  X,
  ShieldCheck,
  Star,
  Gem,
  Truck,
  UserCheck,
  Crown,
  History,
  Info,
  CheckCircle2,
  Gift,
  ArrowRight
} from 'lucide-react';

const MembershipDetail: React.FC = () => {
  const navigate = useNavigate();
  const [isVIPModalOpen, setIsVIPModalOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const blackVIPBenefits = [
    { title: '상시 15% 특별 할인', desc: '전 품목(일부 품목 제외) 15% 할인 혜택을 제공합니다.', icon: Star },
    { title: '프라이빗 방문 컨시어지', desc: '고객님이 원하시는 장소로 전문 상담원과 제품이 방문합니다.', icon: Truck },
    { title: '평생 무상 리사이징/케어', desc: '제품의 가치를 유지하기 위한 모든 관리를 평생 무상 지원합니다.', icon: ShieldCheck },
    { title: 'VVIP 전용 다이아몬드 소싱', desc: '전 세계 희귀 원석을 우선적으로 수배하여 제안해 드립니다.', icon: Gem },
    { title: '기념일 디렉터 방문 이벤트', desc: '특별한 날, ObligeWorks 디렉터가 직접 방문하여 이벤트를 지원합니다.', icon: UserCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">포인트 및 실적 분석 리포트</h1>
          <p className="text-slate-500 font-medium">홍길동님의 프리미엄 포인트 혜택 상세 내역입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Main Point Summary Card */}
          <div className="bg-[#002366] rounded-[40px] border border-blue-900/10 p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-2">Total Points Balance</p>
                  <h2 className="text-5xl font-black italic">124,500 P</h2>
                </div>
                <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10">
                  <Zap size={32} className="text-amber-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest opacity-60">금월 적립 포인트</p>
                  <p className="text-2xl font-bold text-emerald-400">+ 24,500 P</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest opacity-60">소멸 예정 포인트 (30일 이내)</p>
                  <p className="text-2xl font-bold text-rose-400">0 P</p>
                </div>
              </div>
            </div>
            <Zap size={300} className="absolute -right-20 -bottom-20 text-white opacity-5 pointer-events-none" />
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#002366]" />
                월별 구매 및 적립 추이
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">Unit: KRW</span>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
              {[3500000, 4500000, 3000000, 6000000, 8500000, 7500000, 12450000].map((val, i) => {
                const max = 13000000;
                const h = (val / max) * 100;
                return (
                  <div key={i} className="flex-1 group/bar flex flex-col items-center gap-3 relative" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                    {hoveredBar === i && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black whitespace-nowrap z-20 animate-in fade-in slide-in-from-bottom-2 shadow-xl">
                        ₩{val.toLocaleString()} <br/>
                        <span className="text-blue-300 font-bold">+{(val * 0.01).toLocaleString()}P 적립</span>
                      </div>
                    )}
                    <div className="w-full bg-slate-50 rounded-full h-full relative overflow-hidden">
                      <div className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000 ease-out cursor-pointer ${i === 6 ? 'bg-[#002366] shadow-[0_0_15px_rgba(0,35,102,0.3)]' : 'bg-slate-200'}`} style={{ height: `${h}%` }}></div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase transition-colors ${i === 6 ? 'text-[#002366]' : 'text-slate-400'}`}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed History Table */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <History size={20} className="text-[#002366]" />
                최근 포인트 변동 내역
              </h3>
              <button className="text-xs font-bold text-[#002366] hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">전체 내역 추출</button>
            </div>
            <div className="divide-y">
              {[
                { id: 'PT-9921', date: '2024.05.14', label: 'JF-2024-002 결제 적립 (1%)', value: '+ 24,500 P', type: 'earn' },
                { id: 'PT-8821', date: '2024.04.10', label: '케어 서비스 결제 적립', value: '+ 450 P', type: 'earn' },
                { id: 'PT-7712', date: '2024.02.15', label: '웰컴 포인트 지급', value: '+ 10,000 P', type: 'earn' },
                { id: 'PT-6601', date: '2024.01.20', label: '연말 구매 실적 감사 포인트', value: '+ 50,000 P', type: 'earn' },
              ].map((item, idx) => (
                <div key={idx} className="p-8 flex items-center justify-between hover:bg-[#002366]/5 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#002366] group-hover:scale-110 transition-transform">
                        <Zap size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">ID: {item.id} • {item.date}</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-[#002366]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#002366] text-white rounded-[40px] p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-8 opacity-60">Reward Potential</h3>
              <p className="text-3xl font-black mb-4 leading-tight italic">PREMIUM<br/>CASH BACK</p>
              <p className="text-xs text-blue-100 opacity-80 mb-10 leading-relaxed">
                보유하신 124,500 포인트는 다음 맞춤 제작 결제 시 ₩124,500으로 현금처럼 사용 가능합니다.
              </p>
              
              <div className="bg-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-md border border-white/10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-70">실제 현금 가치</span>
                  <span className="text-lg">₩124,500</span>
                </div>
                <button onClick={() => navigate('/orders/new')} className="w-full py-4 bg-white text-[#002366] rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                  주문에 포인트 사용하기 <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <Target size={200} className="absolute -right-10 -bottom-10 text-white opacity-5 pointer-events-none" />
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
              <Info size={16} className="text-[#002366]" />
              프리미엄 포인트 가이드
            </h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002366]">
                    <Star size={18} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">전 품목 상시 1% 적립</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">모든 결제 금액에 대해 1%가 한도 없이 적립됩니다.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Gift size={18} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">포토 리뷰 특별 혜택</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">제작 완료 후 공정별 만족도를 포토와 함께 작성 시 5,000P가 추가 지급됩니다.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Calendar size={18} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">2년의 넉넉한 유효기간</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">적립일로부터 24개월간 유지되며, 소멸 1개월 전 알림을 보내드립니다.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t flex flex-col gap-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Actions</p>
                <Link to="/support" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-[#002366]">포인트 사용법 문의</span>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-[#002366] group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetail;
