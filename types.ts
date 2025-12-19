
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
export type OwnershipType = 'BRAND' | 'WORKSHOP' | 'CLIENT';
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
  totalWeight?: string;
  settingType?: string;
  position?: string;
  certAuthority?: string;
  certNumber?: string;
  certTarget?: 'MAIN' | 'SIDE' | 'ALL';
  certFiles?: string[];
  linkedLotNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  workshopName: string;
  projectTitle?: string;
  itemName: string;
  status: OrderStatus;
  ecd: string;
  lastUpdate: string;
  priority: 'NORMAL' | 'URGENT' | 'SAMPLE';
  designRefType?: 'CAD' | 'SKETCH' | 'PHOTO' | 'SAMPLE';
  metalColor?: string;
  targetWeight?: string;
  weightTolerance?: string;
  sizeLength?: string;
  wearingDirection?: 'LEFT' | 'RIGHT' | 'SYM';
  surfaceFinish?: string[];
  qcChecklist?: string[];
  quantity: number;
  options: string;
  paymentStatus: string;
  materials: Material[];
  timeline: any[];
  attachments: string[];
  estimatedBudget?: string;
  finalQuote?: number;
  isDesignVerified: boolean;
  isExpress: boolean;
  // v1.1 추가: 상세 지시서 데이터
  specs?: {
    metal: any;
    mainStone: any;
    sideStone: any;
    manu: any;
    settlement: any;
    qc: any;
    specialNote: string;
  }
}

export interface InventoryItem {
  id: string;
  category: 'METAL' | 'STONE' | 'OTHER';
  subCategory: string; 
  name: string;
  stock: number;
  reservedStock: number;
  unit: string;
  threshold: number; 
  status: 'SAFE' | 'LOW' | 'OUT';
  ownership: OwnershipType;
  lotNumber: string;
  arrivalDate: string;
  unitPrice: number;
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
  serviceCategory: ASServiceCategory;
  serviceType: ASServiceType;
  responsibleWorkshop?: string;
  estimatedDuration?: string;
  technicalLogs?: { time: string; action: string; note: string; }[];
}

export interface OrderAdjustment {
  id: string;
  orderId: string;
  type: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export type AdjustmentReason = 'ERROR' | 'LOSS' | 'DAMAGE' | 'REMAKE' | 'SAMPLE' | 'INITIAL_STOCK';

export interface InventoryAuditLog {
  id: string;
  itemId: string;
  changeAmount: number;
  afterStock: number;
  reason: string;
  orderId?: string;
  timestamp: string;
  operatorName: string;
}
