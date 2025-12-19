
import { Order, OrderStatus, ProcessStatus, MaterialStatus, IssueTicket, IssueStatus, UserRole, InventoryItem, OwnershipType } from './types';

export const MOCK_USER = {
  id: 'u1',
  name: '홍길동',
  email: 'gildong@example.com',
  phone: '010-1234-5678',
  address: '서울특별시 강남구 테헤란로 123, 402호',
  role: UserRole.CUSTOMER
};

export const MOCK_ADMIN = {
  id: 'admin1',
  name: '마스터(장윤진)',
  email: 'admin@obligeworks.com',
  role: UserRole.ADMIN
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'JF-2024-001',
    customerName: '홍길동',
    workshopName: '오블리주 아틀리에 청담',
    itemName: '18K 다이아몬드 솔리테어 링',
    status: OrderStatus.PAYMENT_WAITING, // 테스트를 위해 결제 대기 상태로 설정
    ecd: '2024-05-20',
    lastUpdate: '2024-05-15 14:30',
    // Added priority to fix error in mockData.ts
    priority: 'NORMAL',
    quantity: 1,
    options: '사이즈: 12호, 각인: "G.D & M.J"',
    paymentStatus: '결제대기',
    isDesignVerified: true,
    isExpress: false,
    materials: [
      { id: 'm1', type: '금속', spec: '18K 화이트골드', status: MaterialStatus.SECURED, source: 'WORKSHOP', linkedLotNumber: 'L2405-WG18' },
      { id: 'm2', type: '원석', spec: '0.5ct 다이아몬드 (GIA)', status: MaterialStatus.SECURED, source: 'WORKSHOP', linkedLotNumber: 'D-NAT-2044' }
    ],
    timeline: [
      { name: '의뢰 접수', status: ProcessStatus.COMPLETED, updatedAt: '2024-05-10', comment: '주문 의뢰가 정상 접수되었습니다.' },
      { name: '디자인/재고 확인', status: ProcessStatus.COMPLETED, updatedAt: '2024-05-12', comment: '디자인 검토 완료 및 18K 화이트골드 로트 할당 완료' },
      { name: '제작중', status: ProcessStatus.WAITING, updatedAt: '-', comment: '결제 확인 후 공정이 시작됩니다.' },
      { name: '검수', status: ProcessStatus.WAITING, updatedAt: '-' },
      { name: '출고', status: ProcessStatus.WAITING, updatedAt: '-' }
    ],
    attachments: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600']
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', category: 'METAL', subCategory: '18K', name: '18K Yellow Gold Grain', stock: 850.5, reservedStock: 120.0, unit: 'g', threshold: 500, status: 'SAFE', ownership: 'BRAND', lotNumber: 'L2406-YG-01', arrivalDate: '2024-06-01', unitPrice: 98000 },
  { id: 'inv-2', category: 'METAL', subCategory: '18K', name: '18K White Gold Grain', stock: 320.0, reservedStock: 250.0, unit: 'g', threshold: 400, status: 'LOW', ownership: 'BRAND', lotNumber: 'L2405-WG-03', arrivalDate: '2024-05-15', unitPrice: 102000 },
  { id: 'inv-3', category: 'STONE', subCategory: 'Natural', name: '0.5ct Diamond Round GIA F/VS2', stock: 12, reservedStock: 5, unit: 'pcs', threshold: 5, status: 'SAFE', ownership: 'BRAND', lotNumber: 'D-NAT-2044', arrivalDate: '2024-04-10', unitPrice: 2450000 },
  { id: 'inv-4', category: 'METAL', subCategory: '14K', name: '14K Rose Gold Wire', stock: 1200.0, reservedStock: 0, unit: 'g', threshold: 300, status: 'SAFE', ownership: 'WORKSHOP', lotNumber: 'W-L2406-RG', arrivalDate: '2024-06-05', unitPrice: 78000 },
  { id: 'inv-5', category: 'METAL', subCategory: '18K', name: 'Client: HKD Old Gold (18K)', stock: 15.2, reservedStock: 15.2, unit: 'g', threshold: 0, status: 'SAFE', ownership: 'CLIENT', lotNumber: 'CL-HKD-001', arrivalDate: '2024-06-10', unitPrice: 0 },
  { id: 'inv-6', category: 'STONE', subCategory: 'Natural', name: 'Client: Heirloom Diamond 1.0ct', stock: 1, reservedStock: 1, unit: 'pcs', threshold: 0, status: 'SAFE', ownership: 'CLIENT', lotNumber: 'CL-HKD-D01', arrivalDate: '2024-06-10', unitPrice: 0 },
];

export const MOCK_ISSUES: IssueTicket[] = [
  {
    id: 'i1',
    orderId: 'o1',
    orderNumber: 'JF-2024-001',
    customerName: '홍길동',
    title: '원석 유격 및 광택 점검 요청',
    status: IssueStatus.SOLUTION_PROPOSED,
    createdAt: '2024-05-16',
    description: '착용 중 메인 스톤이 미세하게 흔들리는 느낌이 있습니다. 또한 전체적인 광택 복원도 함께 진행하고 싶습니다.',
    photos: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'],
    serviceCategory: 'SETTING_CHECK',
    serviceType: 'FREE',
    responsibleWorkshop: '오블리주 아틀리에 청담',
    estimatedDuration: '약 3~5 영업일',
    technicalLogs: [
      { time: '2024-05-16 14:00', action: '접수 확인', note: '디렉터 1차 외관 검수 완료' },
      { time: '2024-05-17 10:30', action: '마스터 배정', note: '원본 로트(D-NAT-2044) 이력 대조 중' },
      { time: '2024-05-18 09:00', action: '수선 진행', note: '동일 사양 로트 자재 0.1g 추가 투입 예정' }
    ]
  }
];

export const getAllOrders = (): Order[] => {
  const localOrdersStr = localStorage.getItem('user_orders');
  const localOrders: Order[] = localOrdersStr ? JSON.parse(localOrdersStr) : [];
  return [...MOCK_ORDERS, ...localOrders];
};
