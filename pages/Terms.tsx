
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Scale } from 'lucide-react';

const Terms: React.FC = () => {
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
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Scale size={24} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">이용관리약관</h1>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">제1조 (목적)</h2>
              <p>본 약관은 오블리주 웍스(이하 "회사")가 제공하는 주얼리 주문 관리 포탈 서비스(이하 "서비스")의 이용 조건 및 절차, 이용자와 회사의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">제2조 (용어의 정의)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>"포탈"이란 회사가 이용자에게 주얼리 제작 공정 확인 및 커뮤니케이션 기능을 제공하기 위해 운영하는 웹 사이트를 말합니다.</li>
                <li>"이용자"란 본 약관에 동의하고 서비스를 이용하는 고객을 말합니다.</li>
                <li>"주문 제작"이란 이용자의 개별 요청에 따라 맞춤형으로 주얼리를 제작하는 과정을 말합니다.</li>
              </ul>
            </section>

            <section>
              <section className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">제3조 (주문 및 결제)</h2>
                <p>1. 모든 주문은 포탈 또는 오프라인 상담을 통해 확정되며, 이용자는 제공된 공정 확인 기능을 통해 진행 상황을 모니터링할 수 있습니다.</p>
                <p>2. 주문 제작의 특성상 결제가 완료된 시점부터 자재 확보 및 제작이 시작됩니다.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">제4조 (취소 및 환불 정책)</h2>
                <p>1. **디자인 확정 단계 이전:** 취소가 가능하며 전액 환불됩니다.</p>
                <p>2. **제작 진행 중 (PRODUCTION):** 맞춤 제작의 특성상 원칙적으로 취소가 불가합니다. 부득이한 취소 시 이미 투입된 자재 비용 및 공임비가 차감된 후 환불될 수 있습니다.</p>
                <p>3. **완료 및 배송 후:** 제품 자체의 결함이 있는 경우를 제외하고는 단순 변심에 의한 환불이 불가합니다.</p>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-4">제5조 (A/S 및 품질 보증)</h2>
                <p>1. 회사는 제작된 제품에 대해 일정한 품질 보증 기간을 제공합니다.</p>
                <p>2. 이용자는 "A/S 및 요청" 메뉴를 통해 상시 수선 및 이슈 등록을 진행할 수 있으며, 회사는 이에 대해 성실히 답변할 의무가 있습니다.</p>
              </section>
            </section>

            <div className="mt-12 pt-8 border-t text-sm text-slate-400">
              <p>최종 수정일: 2025년 1월 1일</p>
              <p className="mt-2">&copy; 2025 EmbargoMedia, Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
