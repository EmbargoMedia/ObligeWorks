
import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  BellRing, 
  Save, 
  ImageIcon, 
  CheckCircle2, 
  Loader2, 
  Ticket, 
  Zap, 
  Crown, 
  ArrowRight,
  X,
  Search,
  MapPin,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../mockData';

const MOCK_ADDRESSES = [
  { zip: '06164', addr: '서울특별시 강남구 테헤란로 123', detail: '오블리주웍스 빌딩' },
  { zip: '04524', addr: '서울특별시 중구 세종대로 110', detail: '서울시청' },
  { zip: '03062', addr: '서울특별시 종로구 가회동 1', detail: '북촌한옥마을' },
  { zip: '06043', addr: '서울특별시 강남구 도산대로 158', detail: '청담빌딩' },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string>("https://picsum.photos/200/200?random=user");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  
  // Modals State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
    shippingName: MOCK_USER.name,
    shippingPhone: MOCK_USER.phone,
    zipCode: '06164',
    address: MOCK_USER.address,
    addressDetail: '402호'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addr: typeof MOCK_ADDRESSES[0]) => {
    setFormData(prev => ({
      ...prev,
      zipCode: addr.zip,
      address: addr.addr,
      addressDetail: addr.detail
    }));
    setIsAddressModalOpen(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">회원 정보 관리</h1>
          <p className="text-slate-500">계정 정보, 연락처 및 배송지 설정을 관리하세요.</p>
        </div>
        
        {showSavedToast && (
          <div className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-emerald-200 animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">정보가 저장되었습니다.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm text-center relative overflow-hidden group">
            <div className="relative z-10">
              <div className="relative inline-block mx-auto mb-6 group/img">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-[40px] bg-slate-50 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner border-4 border-white transition-all cursor-pointer group-hover/img:border-[#002366]/10"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="text-white" size={28} />
                  </div>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-3 bg-[#002366] text-white rounded-2xl shadow-lg border-4 border-white hover:bg-[#001A4D] active:scale-95 transition-all z-10">
                  <ImageIcon size={18} />
                </button>
              </div>
              <h2 className="text-xl font-black text-slate-900">{formData.name}</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">{formData.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield size={18} className="text-[#002366]" />
              보안 및 알림
            </h3>
            <div className="space-y-4">
              <div onClick={() => setEmailNotifications(!emailNotifications)} className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${emailNotifications ? 'bg-[#002366]/5 text-[#002366]' : 'bg-slate-50 text-slate-400'}`}>
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">이메일 알림</span>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-all ${emailNotifications ? 'bg-[#002366]' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${emailNotifications ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>

              <div onClick={() => setPushNotifications(!pushNotifications)} className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-colors ${pushNotifications ? 'bg-[#002366]/5 text-[#002366]' : 'bg-slate-50 text-slate-400'}`}>
                    <BellRing size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">푸시 알림</span>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-all ${pushNotifications ? 'bg-[#002366]' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${pushNotifications ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 shadow-sm">
            <div className="space-y-10">
              <section>
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#002366] rounded-full"></div>
                  기본 계정 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">사용자 이름</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#002366] transition-all font-bold text-slate-700 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">이메일 주소</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#002366] transition-all font-bold text-slate-700 outline-none" />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#002366] rounded-full"></div>
                  기본 배송지 설정
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="shippingName" value={formData.shippingName} onChange={handleInputChange} placeholder="수령인 성함" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#002366] transition-all font-bold text-slate-700 outline-none" />
                    <input type="tel" name="shippingPhone" value={formData.shippingPhone} onChange={handleInputChange} placeholder="수령인 연락처" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#002366] transition-all font-bold text-slate-700 outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <input type="text" name="zipCode" value={formData.zipCode} readOnly className="w-24 px-5 py-4 bg-slate-100 border-2 border-transparent rounded-2xl font-bold text-slate-700 outline-none" />
                    <button 
                      type="button" 
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-[#001A4D] transition-all shadow-lg active:scale-95"
                    >
                      주소 찾기
                    </button>
                  </div>
                  <input type="text" name="address" value={formData.address} readOnly className="w-full px-5 py-4 bg-slate-100 border-2 border-transparent rounded-2xl font-bold text-slate-700 outline-none" />
                  <input type="text" name="addressDetail" value={formData.addressDetail} onChange={handleInputChange} placeholder="상세 주소" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#002366] transition-all font-bold text-slate-700 outline-none" />
                </div>
              </section>
            </div>

            <div className="mt-12 flex gap-4 justify-end pt-10 border-t">
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-3 bg-[#002366] text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-blue-900/10 hover:bg-[#001A4D] active:scale-[0.98] transition-all">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                정보 저장하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Search Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900">주소 찾기</h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="도로명 또는 지번 주소 입력" 
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#002366]/20" 
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                {MOCK_ADDRESSES.filter(a => a.addr.includes(addressSearch)).map((addr, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSelectAddress(addr)}
                    className="w-full p-6 text-left hover:bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#002366]/5 group-hover:text-[#002366]">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 mb-1">{addr.zip}</p>
                        <p className="text-sm font-bold text-slate-900">{addr.addr}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{addr.detail}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
