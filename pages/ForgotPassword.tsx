
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BusinessFooter } from './Login';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 mb-8">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/login" className="p-2 hover:bg-slate-50 rounded-full transition-colors mr-2">
              <ChevronLeft size={24} className="text-slate-400" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">비밀번호 찾기</h1>
          </div>

          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-slate-50 text-[#002366] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Mail size={32} />
                </div>
                <p className="text-slate-500 font-bold text-sm">가입하신 이메일 또는 휴대폰 번호를 입력하시면 인증번호를 보내드립니다.</p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">이메일 또는 휴대폰 번호</label>
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-slate-700"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-[#001A4D] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? "전송 중..." : "인증번호 받기"}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-slate-50 text-[#002366] rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <KeyRound size={32} />
                </div>
                <p className="text-slate-500 font-bold text-sm leading-relaxed">{identifier}로 전송된 인증번호와<br/>새 비밀번호를 입력해주세요.</p>
              </div>

              <form onSubmit={handleVerifyAndReset} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">인증번호</label>
                  <input 
                    type="text" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6자리 숫자"
                    className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all text-center tracking-widest font-black text-xl text-[#002366]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">새 비밀번호 설정</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#002366] outline-none transition-all font-bold text-slate-700"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-[#001A4D] active:scale-[0.98] transition-all"
                >
                  {isLoading ? "처리 중..." : "비밀번호 재설정 완료"}
                </button>
                
                <p className="text-center text-xs text-slate-400 font-bold">
                  인증번호를 받지 못하셨나요? 
                  <button type="button" onClick={() => setStep(1)} className="ml-2 text-[#002366] hover:underline">재전송 요청</button>
                </p>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">비밀번호 변경 완료</h2>
              <p className="text-slate-500 mb-10 text-sm font-bold leading-relaxed">보안을 위해 비밀번호가 성공적으로 변경되었습니다.<br/>새로운 비밀번호로 다시 로그인해주세요.</p>
              
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-5 bg-[#002366] text-white rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:bg-[#001A4D] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                로그인 화면으로 이동
                <ChevronLeft size={18} className="rotate-180" />
              </button>
            </div>
          )}

          {/* Decorative Shield Icon in background */}
          <ShieldCheck size={140} className="absolute -bottom-12 -right-12 text-[#002366] opacity-5 pointer-events-none -rotate-12" />
        </div>
      </div>
      
      <BusinessFooter />
    </div>
  );
};

export default ForgotPassword;
