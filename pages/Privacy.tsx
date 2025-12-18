
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-10">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">개인정보 처리방침</h1>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <p className="font-medium">오블리주 웍스는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수하여 개인정보를 안전하게 보호하기 위해 최선을 다하고 있습니다.</p>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-600 pl-4">1. 수집하는 개인정보 항목</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>**필수항목:** 성명, 이메일 주소, 휴대폰 번호, 로그인 비밀번호</li>
                <li>**주문 시 수집항목:** 배송지 주소, 결제 정보(카드 정보 등은 PG사를 통해 처리됨), 주문 내역</li>
                <li>**서비스 이용 과정:** 접속 로그, 쿠키, 기기 정보</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-600 pl-4">2. 개인정보의 수집 및 이용 목적</h2>
              <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>**서비스 제공:** 주문 제작 진행 현황 공유, 공정 사진 전송, 실시간 커뮤니케이션</li>
                <li>**배송 및 결제:** 제품 배송, 결제 확인 및 정산</li>
                <li>**고객 관리:** 본인 확인, 불만 처리 및 A/S 요청 대응</li>
                <li>**마케팅 (선택 시):** 신상품 안내, 이벤트 홍보 및 광고성 정보 전달</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-600 pl-4">3. 개인정보의 보유 및 이용 기간</h2>
              <p>이용자의 개인정보는 원칙적으로 회원 탈퇴 시 지체 없이 파기합니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 다음과 같이 일정 기간 보관합니다.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-emerald-600 pl-4">4. 정보주체의 권리</h2>
              <p>이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 이용에 대한 동의를 철회할 수 있습니다. 개인정보와 관련된 문의는 "회원 정보" 메뉴를 통해 직접 처리하거나 고객센터를 통해 요청하실 수 있습니다.</p>
            </section>

            <div className="mt-12 pt-8 border-t text-sm text-slate-400">
              <p>시행일자: 2025년 1월 1일</p>
              <p className="mt-2">&copy; 2025 EmbargoMedia, Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
