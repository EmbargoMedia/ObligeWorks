
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Building2, User, Briefcase, FileText, ShieldCheck } from 'lucide-react';
import { BusinessFooter } from './Login';
import { UserRole } from '../types';

interface SignUpProps {
  onSignUp: (role: UserRole) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.CUSTOMER);
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    businessNumber: '', 
    position: '',       
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'ADMIN') {
      setActiveTab(UserRole.ADMIN);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    // 기업명 정보 저장
    localStorage.setItem('user_company_name', formData.companyName);
    if (activeTab === UserRole.ADMIN) {
      localStorage.setItem('admin_company_name', formData.companyName);
    }

    alert(`${activeTab === UserRole.ADMIN ? '기업 파트너' : '고객'} 회원가입 신청이 완료되었습니다.`);
    onSignUp(activeTab);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-inter">
      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12">
          <div className="flex items-center mb-8">
            <Link to="/login" className="p-2 hover:bg-slate-50 rounded-full transition-colors mr-2">
              <ChevronLeft size={24} className="text-slate-400" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">시스템 이용 신청</h1>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10">
            <button 
              onClick={() => setActiveTab(UserRole.CUSTOMER)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${
                activeTab === UserRole.CUSTOMER ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User size={18} /> 고객 가입
            </button>
            <button 
              onClick={() => setActiveTab(UserRole.ADMIN)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all ${
                activeTab === UserRole.ADMIN ? 'bg-white text-[#002366] shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Building2 size={18} /> 기업 가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 상호명 및 사업자번호 (모든 회원 공통 노출) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-2">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-[#002366] uppercase tracking-widest ml-1 mb-1.5 italic">상호명 / 디자이너명 (필수)</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="상호 또는 브랜드명"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">사업자 등록번호 (선택)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    placeholder="000-00-00000"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">가입자 성함</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="성함 입력"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">
                  직함 / 소속
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder={activeTab === UserRole.ADMIN ? "과장 / 대표" : "디자이너 / 개인"}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">아이디 (이메일)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">휴대폰 번호</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">비밀번호 설정</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5">비밀번호 확인</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#002366]/20 focus:border-[#002366] outline-none transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 text-xs text-slate-600 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-0.5 rounded border-slate-300 text-[#002366] focus:ring-[#002366]" 
                  required 
                />
                <span className="font-medium">
                  <Link to="/terms" className="text-[#002366] font-black hover:underline">이용약관</Link> 및 
                  <Link to="/privacy" className="text-[#002366] font-black hover:underline"> 개인정보 처리방침</Link>에 동의합니다.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full py-5 text-white rounded-2xl font-black shadow-xl shadow-blue-900/10 hover:bg-[#001A4D] active:scale-[0.98] transition-all mt-2 flex items-center justify-center gap-2 bg-[#002366]"
            >
              <ShieldCheck size={20} />
              가입 승인 요청하기
            </button>
          </form>

          <div className="mt-10 text-center border-t pt-8 border-slate-50">
            <p className="text-slate-500 text-xs font-bold">
              이미 계정이 있으신가요? 
              <Link to="/login" className="ml-2 text-[#002366] font-black hover:underline">로그인하기</Link>
            </p>
          </div>
        </div>
      </div>
      
      <BusinessFooter />
    </div>
  );
};

export default SignUp;
