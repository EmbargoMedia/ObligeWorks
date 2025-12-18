
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
  name: '관리자(장윤진)',
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
    status: OrderStatus.PRODUCTION,
    ecd: '2024-05-20',
    lastUpdate: '2024-05-15 14:30',
    quantity: 1,
    options: '사이즈: 12호, 각인: "G.D & M.J"',
    paymentStatus: '결제완료',
    isDesignVerified: true,
    isExpress: false,
    materials: [
      { id: 'm1', type: '금속', spec: '18K 화이트골드', status: MaterialStatus.SECURED, source: 'WORKSHOP', linkedLotNumber: 'L2405-WG18' },
      { id: 'm2', type: '원석', spec: '0.5ct 다이아몬드 (GIA)', status: MaterialStatus.SECURED, source: 'WORKSHOP', linkedLotNumber: 'D-NAT-2044' }
    ],
    timeline: [
      { name: '디자인 확정', status: ProcessStatus.COMPLETED, updatedAt: '2024-05-10', comment: '최종 시안 승인됨' },
      { name: '자재확보', status: ProcessStatus.COMPLETED, updatedAt: '2024-05-12', comment: '로트 할당 완료' },
      { name: '제작중', status: ProcessStatus.IN_PROGRESS, updatedAt: '2024-05-15', comment: '난집 제작중 (자재 실차감 완료)', photos: ['https://picsum.photos/400/300?random=1'] },
      { name: '세팅/마감', status: ProcessStatus.WAITING, updatedAt: '-' },
      { name: '검수', status: ProcessStatus.WAITING, updatedAt: '-' },
      { name: '포장', status: ProcessStatus.WAITING, updatedAt: '-' },
      { name: '출고', status: ProcessStatus.WAITING, updatedAt: '-' }
    ],
    attachments: ['https://picsum.photos/600/400?random=11']
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  // BRAND Owned (본사 자산)
  { id: 'inv-1', category: 'METAL', subCategory: '18K', name: '18K Yellow Gold Grain', stock: 850.5, reservedStock: 120.0, unit: 'g', threshold: 500, status: 'SAFE', ownership: 'BRAND', lotNumber: 'L2406-YG-01', arrivalDate: '2024-06-01', unitPrice: 98000 },
  { id: 'inv-2', category: 'METAL', subCategory: '18K', name: '18K White Gold Grain', stock: 320.0, reservedStock: 250.0, unit: 'g', threshold: 400, status: 'LOW', ownership: 'BRAND', lotNumber: 'L2405-WG-03', arrivalDate: '2024-05-15', unitPrice: 102000 },
  { id: 'inv-3', category: 'STONE', subCategory: 'Natural', name: '0.5ct Diamond Round GIA F/VS2', stock: 12, reservedStock: 5, unit: 'pcs', threshold: 5, status: 'SAFE', ownership: 'BRAND', lotNumber: 'D-NAT-2044', arrivalDate: '2024-04-10', unitPrice: 2450000 },
  
  // WORKSHOP Owned (공방 위탁)
  { id: 'inv-4', category: 'METAL', subCategory: '14K', name: '14K Rose Gold Wire', stock: 1200.0, reservedStock: 0, unit: 'g', threshold: 300, status: 'SAFE', ownership: 'WORKSHOP', lotNumber: 'W-L2406-RG', arrivalDate: '2024-06-05', unitPrice: 78000 },
  
  // CLIENT Provided (고객 지참)
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
    photos: ['https://picsum.photos/400/300?random=20'],
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
