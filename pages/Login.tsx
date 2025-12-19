
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';
import { User, Building2, Bell, Package, CheckCircle2, Clock, Sparkles, ChevronRight, Mail, Smartphone } from 'lucide-react';

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
            <h2 className="text-4xl font-black text-white leading-tight italic tracking-tighter">
              디자인 확정부터 결제,<br />
              완성되는 전 공정을<br />
              한눈에 확인하세요.
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/10 shadow-2xl space-y-6 animate-in slide-in-from-left-8 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-300">
                  <Bell size={24} />
                </div>
                <h3 className="font-bold text-white">결제 및 공정 알림</h3>
              </div>
              <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-1 rounded-md">NEW</span>
            </div>
            <div className="space-y-4">
              {[
                { title: "견적 완료", desc: "디자인 및 재고 파악 완료. 결제를 진행해주세요.", time: "방금 전", icon: CheckCircle2 },
                { title: "제작 시작", desc: "결제 확인 완료. 공정 개시", time: "2시간 전", icon: Clock },
                { title: "배송 준비", desc: "최종 검수 통과 및 패키징 완료", time: "어제", icon: Package }
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
          </div>
        </div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 오른쪽: 로그인 폼 섹션 */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white lg:bg-slate-50">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-white rounded-[48px] shadow-2xl lg:shadow-xl border border-slate-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">ObligeWorks</h1>
              <p className="text-slate-400 font-black tracking-widest text-[10px] uppercase">Authorized Artisan Interface</p>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10">
              <button 
                onClick={() => setActiveTab(UserRole.CUSTOMER)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                  activeTab === UserRole.CUSTOMER ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User size={16} /> 고객 로그인
              </button>
              <button 
                onClick={() => setActiveTab(UserRole.ADMIN)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                  activeTab === UserRole.ADMIN ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Building2 size={16} /> 기업 로그인
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">이메일 또는 휴대폰 번호</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="example@email.com / 010-0000-0000"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">비밀번호</label>
                  <Link to="/forgot-password" opacity-60 className="text-[10px] text-slate-400 hover:text-[#002366] font-bold uppercase tracking-widest transition-colors">비밀번호 찾기</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-slate-700 shadow-inner"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 bg-[#002366] shadow-blue-900/20 hover:bg-black uppercase tracking-[0.2em] text-xs"
              >
                시스템 접속하기
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                처음 방문하셨나요? 
                <Link to="/signup?role=CUSTOMER" className="ml-2 text-[#002366] font-black hover:underline">회원가입 신청</Link>
              </p>
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
  <div className="text-center text-[10px] text-slate-300 space-y-1 leading-relaxed font-inter">
    <p className="font-black text-slate-400 mb-1 uppercase tracking-widest italic">Business Intelligence by ObligeWorks</p>
    <div className="flex flex-wrap justify-center gap-x-2 font-bold">
      <span>(주)엠바고미디어</span>
      <span>|</span>
      <span>대표: 장윤진</span>
      <span>|</span>
      <span>사업자: 474-81-03584</span>
    </div>
    <p className="opacity-60">@EmbargoMedia,Inc All Rights Reserved</p>
  </div>
);

export default Login;
