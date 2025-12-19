
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, AlertCircle, User as UserIcon, Menu, X, LogOut, ChevronRight,
  ChevronLeft, Bell, Search, PlusCircle, MessageSquare, Truck, Hammer, Settings, ShieldCheck, Sparkles,
  Check, Mail, UserCheck, CreditCard, Crown, Ticket, Database, Users, TrendingUp, Clock,
  PenTool, Star, ArrowUpRight, CheckCircle2, Info, FileText, Wallet, Boxes, Gem
} from 'lucide-react';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import NewOrder from './pages/NewOrder';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Support from './pages/Support';
import Membership from './pages/Membership';
import MembershipDetail from './pages/MembershipDetail';
import VoucherWallet from './pages/VoucherWallet';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminIssues from './pages/admin/AdminIssues';
import AssetValuation from './pages/admin/AssetValuation';
import SupplyChainSync from './pages/admin/SupplyChainSync';
import DailyOutbound from './pages/admin/DailyOutbound';
import MaterialOutbound from './pages/admin/MaterialOutbound';
import LotManagement from './pages/admin/LotManagement';
import AssetDrilldown from './pages/admin/AssetDrilldown';
import AssetOverview from './pages/admin/AssetOverview';
import NewLotIntake from './pages/admin/NewLotIntake';

import { MOCK_USER, MOCK_ADMIN } from './mockData';
import { UserRole } from './types';

const INITIAL_NOTIFICATIONS = [
  { 
    id: 1, 
    type: 'design',
    title: '3D CAD 디자인 확정', 
    desc: '의뢰하신 [JF-2024-001] 반지의 렌더링 시안이 기술 검토를 통과하여 최종 확정되었습니다.', 
    orderNo: 'JF-2024-001',
    time: '방금 전', 
    icon: PenTool, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    read: false
  },
  { 
    id: 2, 
    type: 'material',
    title: '희귀 원석 매칭 완료', 
    desc: '요청하신 사양의 0.5ct GIA 다이아몬드 로트(D-NAT-2044)가 아틀리에 금고에서 출고되어 공정에 할당되었습니다.', 
    orderNo: 'JF-2024-001',
    time: '3시간 전', 
    icon: Gem, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    read: false
  },
  { 
    id: 3, 
    type: 'production',
    title: '제작 공정 : 난집 제작 중', 
    desc: '마스터 장인의 수작업으로 반지의 메인 난집 제작이 시작되었습니다. 제작 중인 사진이 타임라인에 업데이트되었습니다.', 
    orderNo: 'JF-2024-001',
    time: '5시간 전', 
    icon: Hammer, 
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    read: true
  },
  { 
    id: 4, 
    type: 'payment',
    title: '결제 제안서 발송', 
    desc: '신규 오더 [JF-2024-C125]에 대한 최종 기술 검토 결과가 포함된 공식 견적 제안서가 도착했습니다.', 
    orderNo: 'JF-2024-C125',
    time: '어제', 
    icon: FileText, 
    color: 'text-[#002366]',
    bgColor: 'bg-blue-50/50',
    read: true
  },
  { 
    id: 5, 
    type: 'system',
    title: '멤버십 등급 승급 알림', 
    desc: '축하합니다! 누적 구매 실적 500만원을 달성하여 [GOLD] 등급으로 승급되었습니다. 전용 혜택을 확인하세요.', 
    orderNo: null,
    time: '2일 전', 
    icon: Crown, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50/30',
    read: true
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || UserRole.CUSTOMER;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onSignUp={(role) => handleLogin(role)} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="flex h-screen overflow-hidden font-inter bg-slate-50">
          <Sidebar role={userRole} onLogout={handleLogout} />
          
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          <div className={`fixed inset-y-0 left-0 w-72 bg-white z-[70] md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar role={userRole} onLogout={handleLogout} isMobile onToggle={() => setIsMobileMenuOpen(false)} />
          </div>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header 
              role={userRole} 
              onLogout={handleLogout} 
              onMenuClick={() => setIsMobileMenuOpen(true)} 
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
              <Routes>
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/issues/:id" element={<IssueDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                {userRole === UserRole.CUSTOMER ? (
                  <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/new" element={<NewOrder />} />
                    <Route path="/issues" element={<Issues />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/membership/detail" element={<MembershipDetail />} />
                    <Route path="/vouchers" element={<VoucherWallet />} />
                    <Route path="/support" element={<Support />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/admin/inventory" element={<AdminInventory />} />
                    <Route path="/admin/inventory/overview" element={<AssetOverview />} />
                    <Route path="/admin/inventory/lots/new" element={<NewLotIntake />} />
                    <Route path="/admin/inventory/drilldown" element={<AssetDrilldown />} />
                    <Route path="/admin/inventory/lots" element={<LotManagement />} />
                    <Route path="/admin/inventory/assets" element={<AssetValuation />} />
                    <Route path="/admin/inventory/sync" element={<SupplyChainSync />} />
                    <Route path="/admin/inventory/outbound" element={<DailyOutbound />} />
                    <Route path="/admin/inventory/outbound/new" element={<MaterialOutbound />} />
                    <Route path="/admin/issues" element={<AdminIssues />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
};

const Header = ({ role, onLogout, onMenuClick }: { role: UserRole, onLogout: () => void, onMenuClick: () => void }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const currentUser = role === UserRole.ADMIN ? MOCK_ADMIN : MOCK_USER;
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-20 border-b bg-white/80 backdrop-blur-md flex items-center px-4 md:px-8 z-30 shrink-0 sticky top-0">
      <div className="flex items-center gap-2">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all mr-1 group"
            title="뒤로가기"
          >
            <ChevronLeft size={24} className="group-active:-translate-x-1 transition-transform" />
          </button>
        )}
        <div className="flex-none md:hidden">
          <button onClick={onMenuClick} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
            <Menu size={24} />
          </button>
        </div>
      </div>
      <div className="hidden md:block w-48 lg:w-64" />
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={role === UserRole.ADMIN ? "오더번호, 고객명 관제 검색..." : "주문번호 검색..."} 
            className="bg-slate-100/50 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-[#002366]/10 focus:bg-white outline-none font-medium transition-all"
          />
        </div>
      </div>
      <div className="flex-none flex items-center gap-4 ml-auto">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-2.5 rounded-xl transition-all relative ${isNotifOpen ? 'bg-[#002366] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Bell size={22} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-4 w-[380px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-2 z-50">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Real-time Feed</p>
                <button onClick={markAllAsRead} className="text-[10px] font-bold text-[#002366] hover:underline">모두 읽음 처리</button>
              </div>
              <div className="max-h-[480px] overflow-y-auto hide-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-6 flex gap-4 transition-colors hover:bg-slate-50/80 cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${n.bgColor} ${n.color} shadow-sm border border-white`}>
                          <n.icon size={20} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-xs font-black tracking-tight ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h4>
                            <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap ml-2 uppercase tracking-tighter">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                            {n.desc}
                          </p>
                          {n.orderNo && (
                            <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-[#002366] uppercase shadow-xs">
                              <Boxes size={10} />
                              {n.orderNo}
                            </div>
                          )}
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shadow-sm"></div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <Bell size={32} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xs font-bold">최근 알림이 없습니다.</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t bg-white text-center">
                <button className="text-[10px] font-black text-slate-400 hover:text-[#002366] transition-colors uppercase tracking-widest">
                  전체 알림 센터 열기
                </button>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-2xl transition-all"
        >
          <div className="h-10 w-10 rounded-2xl overflow-hidden border-2 border-slate-100">
            <img src={`https://picsum.photos/100/100?random=${role}`} alt="User" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-black text-slate-900 leading-none">{currentUser.name}</p>
            <p className="text-[10px] font-black mt-1 text-[#002366] uppercase tracking-tighter">
              {role === UserRole.ADMIN ? '기업 파트너' : '프레스티지 멤버'}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

const Sidebar = ({ role, onLogout, isMobile, onToggle }: { role: UserRole, onLogout: () => void, isMobile?: boolean, onToggle?: () => void }) => {
  const location = useLocation();
  const companyName = localStorage.getItem('admin_company_name');
  
  const customerNav = [
    { label: '대시보드', path: '/', icon: LayoutDashboard },
    { label: '내 주문 리스트', path: '/orders', icon: Package },
    { label: '멤버십 & 결제', path: '/membership', icon: CreditCard },
    { label: '내 쿠폰함', path: '/vouchers', icon: Ticket },
    { label: 'A/S 및 요청', path: '/issues', icon: AlertCircle },
  ];
  const adminNav = [
    { label: '기업 관제 대시보드', path: '/', icon: TrendingUp },
    { label: '인벤토리 현황', path: '/admin/inventory', icon: Database },
    { label: 'A/S 티켓 센터', path: '/admin/issues', icon: MessageSquare },
  ];
  const navItems = role === UserRole.ADMIN ? adminNav : customerNav;

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-72 border-r hidden md:flex'} bg-white h-full flex flex-col p-6`}>
      <div className="mb-12 px-2">
        <Link to="/" className="inline-block outline-none" onClick={onToggle}>
          <h1 className="text-2xl font-black text-[#002366] tracking-tighter hover:opacity-70 transition-opacity">ObligeWorks</h1>
        </Link>
        {role === UserRole.ADMIN && companyName && (
          <p className="text-[11px] text-slate-500 font-bold mt-1 truncate">{companyName}</p>
        )}
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">{role === UserRole.ADMIN ? 'BUSINESS SYSTEM' : 'CUSTOMER SYSTEM'}</p>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onToggle}
            className={`flex items-center gap-2.5 px-3 py-3 rounded-[16px] transition-all font-bold text-sm ${
              location.pathname === item.path ? 'bg-[#002366] text-white shadow-lg' : 'text-slate-600 hover:text-[#002366] hover:bg-slate-50'
            }`}
          >
            <item.icon size={18} className="shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t">
        <div className="px-6 mb-4">
          <span className="bg-slate-50 text-slate-300 px-2 py-0.5 rounded text-[9px] font-black tracking-tighter border border-slate-100 uppercase">System V.BETA.1.1</span>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[16px] transition-all font-bold text-sm">
          <LogOut size={18} /> <span className="truncate">로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

export default App;
