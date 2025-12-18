
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import { User, Building2, Bell, Package, CheckCircle2, Clock, Sparkles, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.CUSTOMER);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(activeTab);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-inter">
      {/* 왼쪽: 실시간 알림 및 상태 섹션 (데스크탑 전용) */}
      <div className="hidden lg:flex w-1/2 bg-[#002366] relative overflow-hidden flex-col justify-center p-20">
        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
              <Sparkles size={14} className="text-blue-300" />
              Real-time Production Feed
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              당신의 주얼리가<br />
              완성되어가는 과정을<br />
              실시간으로 확인하세요.
            </h2>
          </div>

          {/* 알림 박스 (종 모양) */}
          <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 shadow-2xl space-y-6 animate-in slide-in-from-left-8 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-300">
                  <Bell size={24} />
                </div>
                <h3 className="font-bold text-white">최근 업데이트 알림</h3>
              </div>
              <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-1 rounded-md">NEW</span>
            </div>
            <div className="space-y-4">
              {[
                { title: "공정 업데이트", desc: "JF-2024-001 '제작중' 단계 진입", time: "방금 전", icon: Clock },
                { title: "검수 완료", desc: "다이아몬드 세팅 정밀 검수 통과", time: "2시간 전", icon: CheckCircle2 },
                { title: "배송 준비", desc: "고객님의 소중한 패키징이 완료되었습니다", time: "어제", icon: Package }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-default">
                  <div className="shrink-0 text-blue-300/50 group-hover:text-blue-300 transition-colors">
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white/90">{item.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-[10px] text-white/30 font-medium">{item.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold text-white/60 transition-all border border-white/5 flex items-center justify-center gap-2">
              전체 알림 히스토리 보기 <ChevronRight size={14} />
            </button>
          </div>

          {/* 미니 주문 카드 */}
          <div className="bg-white rounded-[24px] p-6 shadow-xl flex items-center gap-4 animate-in fade-in zoom-in duration-1000 delay-300 relative z-20">
             <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
               <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200" alt="18K Solitaire Ring" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
               <div className="flex justify-between items-start">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">JF-2024-001</p>
                 <span className="px-2 py-0.5 bg-blue-50 text-[#002366] text-[9px] font-black rounded uppercase">Production</span>
               </div>
               <p className="text-sm font-black text-slate-900 mt-0.5">18K 다이아몬드 솔리테어 링</p>
               <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-[#002366] w-2/3"></div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 로그인 폼 섹션 */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white lg:bg-slate-50">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-white rounded-[48px] shadow-2xl lg:shadow-xl border border-slate-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">ObligeWorks</h1>
              <p className="text-slate-500 font-bold tracking-tight text-sm">주얼리 주문 제작 관리 시스템</p>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10">
              <button 
                onClick={() => setActiveTab(UserRole.CUSTOMER)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${
                  activeTab === UserRole.CUSTOMER ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User size={18} /> 고객 로그인
              </button>
              <button 
                onClick={() => setActiveTab(UserRole.ADMIN)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${
                  activeTab === UserRole.ADMIN ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Building2 size={18} /> 기업 로그인
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">이메일/휴대폰 로그인</label>
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="이메일 또는 휴대폰 번호 입력"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Key</label>
                  <Link to="/forgot-password" className="text-[10px] text-slate-400 hover:text-[#002366] font-bold uppercase tracking-widest transition-colors">비밀번호를 잊으셨나요?</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 bg-[#002366] shadow-blue-900/20 hover:bg-[#001A4D]"
              >
                {activeTab === UserRole.ADMIN ? '시스템 관제 접속' : '포털 서비스 접속'}
              </button>
            </form>

            <div className="mt-10 text-center">
              {activeTab === UserRole.CUSTOMER ? (
                <p className="text-slate-500 text-xs font-bold">
                  아직 멤버가 아니신가요? 
                  <Link to="/signup?role=CUSTOMER" className="ml-2 text-[#002366] hover:underline">회원가입 요청</Link>
                </p>
              ) : (
                <p className="text-slate-500 text-xs font-bold">
                  신규 파트너사이신가요? 
                  <Link to="/signup?role=ADMIN" className="ml-2 text-[#002366] hover:underline">기업 파트너 등록</Link>
                </p>
              )}
            </div>
          </div>
          <div className="mt-12">
            <BusinessFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BusinessFooter = () => (
  <div className="text-center text-[10px] text-slate-400 space-y-1 leading-relaxed opacity-60 font-inter">
    <p className="font-bold text-slate-500 mb-1 uppercase tracking-wider">Business Intelligence by ObligeWorks</p>
    <div className="flex flex-wrap justify-center gap-x-2">
      <span>(주)엠바고미디어</span>
      <span>|</span>
      <span>대표: 장윤진</span>
      <span>|</span>
      <span>사업자: 474-81-03584</span>
    </div>
    <p>@EmbargoMedia,Inc All Rights Reserved</p>
  </div>
);

export default Login;
