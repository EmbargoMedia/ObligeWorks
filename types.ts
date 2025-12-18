
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  QUOTE_PENDING = 'QUOTE_PENDING',
  PAYMENT_WAITING = 'PAYMENT_WAITING',
  PRODUCTION = 'PRODUCTION',
  INSPECTION = 'INSPECTION',
  READY_FOR_SHIP = 'READY_FOR_SHIP',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED'
}

export enum ProcessStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum MaterialStatus {
  SECURED = 'SECURED',
  SECURING = 'SECURING',
  APPRAISAL_NEEDED = 'APPRAISAL_NEEDED',
  APPRAISAL_COMPLETED = 'APPRAISAL_COMPLETED',
  SUBSTITUTE_NEEDED = 'SUBSTITUTE_NEEDED'
}

export enum IssueStatus {
  RECEIVED = 'RECEIVED',
  REVIEWING = 'REVIEWING',
  SOLUTION_PROPOSED = 'SOLUTION_PROPOSED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export type ASServiceCategory = 'POLISHING' | 'SETTING_CHECK' | 'REMAKE' | 'RESIZING' | 'CLEANING' | 'OTHER';
export type ASServiceType = 'FREE' | 'PAID' | 'POLICY_EXCEPTION';

// 1. 재고 소유권 구분
export type OwnershipType = 'BRAND' | 'WORKSHOP' | 'CLIENT';

// 2. 자재 할당 상태
export type AllocationStatus = 'AVAILABLE' | 'RESERVED' | 'CONSUMED' | 'RETURNED';

// 3. 재고 조정 사유
export type AdjustmentReason = 'LOSS' | 'DAMAGE' | 'ERROR' | 'REMAKE' | 'SAMPLE' | 'INITIAL_STOCK';

export type MaterialSource = 'WORKSHOP' | 'CLIENT';

export interface Material {
  id: string;
  type: string;
  spec: string;
  status: MaterialStatus;
  source: MaterialSource;
  amount?: string;
  stoneCount?: string;
  cutType?: string;
  certAuthority?: string;
  certNumber?: string;
  certYear?: string;
  certFiles?: string[];
  linkedLotNumber?: string; // 로트 번호 연결
}

export interface ProcessStep {
  name: string;
  status: ProcessStatus;
  updatedAt: string;
  comment?: string;
  photos?: string[];
  requiresApproval?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  workshopName: string;
  itemName: string;
  status: OrderStatus;
  ecd: string;
  lastUpdate: string;
  quantity: number;
  options: string;
  paymentStatus: string;
  materials: Material[];
  timeline: ProcessStep[];
  attachments: string[];
  estimatedBudget?: string;
  finalQuote?: number;
  isDesignVerified: boolean;
  isExpress: boolean;
}

export interface InventoryItem {
  id: string;
  category: 'METAL' | 'STONE' | 'OTHER';
  subCategory: string; 
  name: string;
  stock: number; // 실재고 (가용 + 예약)
  reservedStock: number; // 오더에 할당된 수량
  unit: string;
  threshold: number; 
  status: 'SAFE' | 'LOW' | 'OUT';
  ownership: OwnershipType; // 소유권 구분
  lotNumber: string; // 로트 번호
  arrivalDate: string; // 입고일
  unitPrice: number; // 입고 단가 (자산가치 계산용)
}

export interface InventoryAuditLog {
  id: string;
  itemId: string;
  changeAmount: number;
  afterStock: number;
  reason: AdjustmentReason;
  orderId?: string;
  timestamp: string;
  operatorName: string;
}

export interface IssueTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  title: string;
  status: IssueStatus;
  createdAt: string;
  description: string;
  photos: string[];
  solution?: string;
  serviceCategory?: ASServiceCategory;
  serviceType?: ASServiceType;
  responsibleWorkshop?: string;
  estimatedDuration?: string;
  technicalLogs?: { time: string; action: string; note: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
}
