
export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
}

export interface AIAnalysisResult {
  suggestedPriority: TicketPriority;
  suggestedType: string;
  summary: string;
  rootCauseHypothesis: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  draftResponse: string;
  suggestedRootCauseCategory?: string;
}

export interface Ticket {
  id: string; // 故障编号
  title: string; // *问题概述
  description: string; // 详细描述
  status: TicketStatus; // 状态
  priority: TicketPriority; // *故障级别
  
  type: string; // *故障类型
  customerName: string; // *客户名称/项目
  
  reporterId: string; // *故障记录人
  assigneeId?: string; // 负责人
  testOwner?: string; // 测试参与负责人
  devOwner?: string; // 研发参与负责人
  
  productId: string; // *所属产品
  productVersion: string; // *产品版本
  targetVersion?: string; // 预计解决版本号
  
  rootCauseCategory?: string; // 故障原因分类
  introductionStage?: string; // 问题引入阶段
  
  solution?: string; // 故障解决方案
  estimatedResolutionTime?: string; // 预计解决时间
  reviewStatus?: string; // 复盘情况
  
  createdAt: string; // 故障记录时间
  updatedAt: string;
  reportingMonth?: string; // 月份
  attachmentUrl?: string; // 故障说明附件_1
  
  tags: string[];
  aiAnalysis?: AIAnalysisResult;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  owner: string;
  health: number; // 0-100
  activeTickets: number;
  icon: string;
}

// --- New Types for Product Hub Dashboard & Roadmap ---

export type VersionStatus = 'PLANNING' | 'DEVELOPING' | 'UAT_READY' | 'UAT_VERIFYING' | 'RELEASED' | 'DELIVERED' | 'ARCHIVED';
export type VersionType = 'STANDARD' | 'CUSTOMIZED' | 'HOTFIX';

export interface ProductVersion {
  id: string;
  productName: string; // 产品名称
  version: string; // *版本号
  name: string; // 版本名称
  type: VersionType; // *版本类型
  features: string; // *版本特性
  dependencies?: string; // *依赖其他产品版本号
  
  status: VersionStatus; // *版本状态
  progress: number; // 0-100 (Derived or Manual)

  // Customers
  customers?: string[]; // *交付客户（可多选）

  // Environment
  envRequirements?: string; // *验证环境要求

  // Schedule - Planning
  startDate: string; // *版本开始时间
  endDate: string; // *版本结束时间
  plannedUATDate: string; // *计划提交uat时间
  
  // Schedule - Actual
  actualUATDate?: string; // *实际提交uat时间
  deliveryDate?: string; // *交付项目现场时间

  // People
  productManager: string; // *产品经理
  versionAdmin: string; // *版本管理员
  uatDeployer?: string; // uat部署人员
  uatTester?: string; // *uat测试人员
  notifyUser?: string; // 部署完成通知
  uatFinishUser?: string; // UAT验证完成

  // Flags & Meta
  isReadyForDelivery: boolean; // 版本可具备交付状态
  isArchived: boolean; // 版本归档
  isDelayed: boolean; // 是否延迟
  
  // Associations
  relatedReleaseVersion?: string; // 关联发布版本
  relatedOutboundRequest?: string; // 关联：产品出库申请
  exceptionNote?: string; // 异常说明
}

export interface Release {
  id: string;
  version: string;
  date: string;
  type: 'Hotfix' | 'Feature' | 'Optimization';
  title: string;
  description: string;
  items: string[];
}

export enum DocumentCategory {
  MARKET = 'MARKET',       // 市场售前
  DELIVERY = 'DELIVERY',   // 交付使用
  OPS = 'OPS',             // 运维
  RND = 'RND'              // 研发测试
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  versionId: string; // Associated Product Version ID (e.g., 'v2.4.0')
  updatedAt: string;
  author: string;
  url: string;
}

export type OutboundStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface OutboundRequest {
  id: string;
  applicationDate: string; // 申请出库日期
  
  productId: string; // 申请出库产品ID
  productName: string; // 申请出库产品 (Derived for display)
  
  versionId: string; // 申请出库版本ID
  version: string; // 申请出库版本 (Derived for display)
  
  applicant: string; // 申请出库人
  projectSide: string; // 申请项目方
  
  requirements?: string; // 出库要求
  artifactUrl?: string; // 制品地址
  documentUrl?: string; // 文档地址
  
  status: OutboundStatus;
  operator?: string; // 操作人
  operationTime?: string; // 操作时间
}

// --- Navigation Portal Types ---

export interface NavResource {
  id: string;
  name: string; // Display Name
  description: string; // Short description
  url: string; // External Link
  icon: string; // Lucide icon name (mapped in component) or generic
  bgColor?: string; // Tailwind background class for icon
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavResource[];
}

export type ViewState = 'PORTAL' | 'DASHBOARD' | 'ROADMAP' | 'TICKETS' | 'PRODUCTS' | 'DOCUMENTS' | 'OUTBOUND' | 'SETTINGS';
