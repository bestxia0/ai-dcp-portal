
import { Product, Ticket, TicketPriority, TicketStatus, User, UserRole, ProductVersion, Release, Document, DocumentCategory, OutboundRequest, NavGroup } from "./types";

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  role: UserRole.AGENT
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '需求管理',
    description: '统一管理产品需求池、需求分析与优先级排期。',
    owner: 'Alice Wang',
    health: 95,
    activeTickets: 5,
    icon: 'ListTodo'
  },
  {
    id: 'p2',
    name: '项目管理',
    description: '项目进度跟踪、里程碑管理与风险管控。',
    owner: 'Bob Zhang',
    health: 92,
    activeTickets: 8,
    icon: 'Kanban'
  },
  {
    id: 'p3',
    name: '公共组件',
    description: '企业级基础UI组件库与通用SDK维护。',
    owner: 'Charlie Li',
    health: 88,
    activeTickets: 12,
    icon: 'Component'
  },
  {
    id: 'p4',
    name: '知识库',
    description: '团队文档沉淀、技术分享与Wiki系统。',
    owner: 'David Chen',
    health: 98,
    activeTickets: 2,
    icon: 'Book'
  },
  {
    id: 'p5',
    name: '前端开发',
    description: 'Web端应用架构、性能优化与开发规范。',
    owner: 'Eve Sun',
    health: 90,
    activeTickets: 15,
    icon: 'Layout'
  },
  {
    id: 'p6',
    name: '后端开发',
    description: '微服务架构、API网关与核心业务逻辑实现。',
    owner: 'Frank Liu',
    health: 94,
    activeTickets: 7,
    icon: 'Server'
  },
  {
    id: 'p7',
    name: '移动端开发',
    description: 'iOS与Android原生应用及跨端框架研发。',
    owner: 'Grace Wu',
    health: 85,
    activeTickets: 18,
    icon: 'Smartphone'
  },
  {
    id: 'p8',
    name: '测管平台',
    description: '测试用例管理、测试计划与执行平台。',
    owner: 'Heidi Zhao',
    health: 96,
    activeTickets: 3,
    icon: 'TestTube'
  },
  {
    id: 'p9',
    name: '测试管理',
    description: 'QA团队管理、质量度量与验收流程。',
    owner: 'Ivan Zhou',
    health: 93,
    activeTickets: 6,
    icon: 'ClipboardCheck'
  },
  {
    id: 'p10',
    name: '自动化测试',
    description: '接口自动化、UI自动化脚本与CI集成。',
    owner: 'Judy Qian',
    health: 89,
    activeTickets: 9,
    icon: 'Bot'
  },
  {
    id: 'p11',
    name: '任务指挥调度',
    description: '跨部门协作任务分发、应急响应指挥中心。',
    owner: 'Kevin Ma',
    health: 97,
    activeTickets: 1,
    icon: 'Radio'
  },
  {
    id: 'p12',
    name: '业务连续性管理',
    description: '容灾备份、高可用架构演练与BCM预案。',
    owner: 'Lily Feng',
    health: 99,
    activeTickets: 0,
    icon: 'RefreshCw'
  },
  {
    id: 'p13',
    name: '架构管控',
    description: '技术选型、架构评审与技术债务治理。',
    owner: 'Mike He',
    health: 91,
    activeTickets: 4,
    icon: 'Network'
  }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-1024',
    title: 'ERP 系统登录延迟严重',
    description: '多名财务部员工报告在早上 9 点高峰期登录 ERP 系统时，页面加载超过 30 秒，有时直接超时。',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    type: 'Performance',
    customerName: 'Global Finance Corp',
    reporterId: 'u5',
    productVersion: 'v2.4.0',
    productId: 'p6', // Linked to Backend
    devOwner: 'Frank Liu',
    createdAt: '2023-10-26T08:30:00Z',
    updatedAt: '2023-10-26T09:00:00Z',
    reportingMonth: '2023-10',
    tags: ['Login', 'Timeout', 'Finance']
  },
  {
    id: 'T-1025',
    title: '移动端无法上传头像',
    description: '用户在 iOS 17 上尝试更新个人资料头像时，APP 闪退。复现步骤：进入设置 -> 个人信息 -> 点击头像 -> 选择照片。',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    type: 'Bug',
    customerName: 'Retail Users',
    productVersion: 'v4.1.2',
    productId: 'p7', // Linked to Mobile
    assigneeId: 'u1',
    reporterId: 'u8',
    testOwner: 'Heidi Zhao',
    createdAt: '2023-10-25T14:15:00Z',
    updatedAt: '2023-10-26T10:20:00Z',
    reportingMonth: '2023-10',
    rootCauseCategory: 'Code Logic',
    introductionStage: 'Development',
    tags: ['iOS', 'Crash', 'Profile']
  },
  {
    id: 'T-1026',
    title: '请求增加导出 CSV 功能',
    description: '目前报表只能导出 PDF，财务团队希望增加 CSV 格式以便进行二次数据分析。',
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    type: 'Feature Request',
    customerName: 'Internal Finance',
    productVersion: 'v1.0.0',
    productId: 'p1', // Linked to Requirements
    reporterId: 'u12',
    createdAt: '2023-10-24T11:00:00Z',
    updatedAt: '2023-10-24T11:00:00Z',
    reportingMonth: '2023-10',
    tags: ['Export', 'CSV', 'Reporting']
  }
];

export const MOCK_VERSIONS: ProductVersion[] = [
  {
    id: 'v1',
    productName: '基础组件',
    version: 'V2.0.0-20240430',
    name: '平台验证版本',
    type: 'STANDARD',
    features: '2.0产品基础框架整合：统一门户，登录，人员组织，权限管理',
    dependencies: '',
    status: 'RELEASED',
    progress: 100,
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    plannedUATDate: '2024-04-30',
    actualUATDate: '2024-04-28',
    productManager: '王如阳',
    versionAdmin: '叶彩霞',
    uatTester: '张三',
    customers: ['内部验证'],
    isReadyForDelivery: true,
    isArchived: true,
    isDelayed: false
  },
  {
    id: 'v2',
    productName: '基础组件',
    version: 'V2.1.0-20240930',
    name: '平台功能优化版',
    type: 'STANDARD',
    features: '完整整合项目，需求，建模，DevOps，后端开发，前端开发',
    dependencies: 'V2.0.0',
    status: 'RELEASED',
    progress: 100,
    startDate: '2024-05-01',
    endDate: '2024-09-30',
    plannedUATDate: '2024-09-15',
    actualUATDate: '2024-09-20',
    productManager: '肖建军',
    versionAdmin: '叶彩霞',
    uatTester: '李四',
    customers: ['标准产品'],
    isReadyForDelivery: true,
    isArchived: true,
    isDelayed: true,
    exceptionNote: 'UAT验证发现严重bug，推迟5天'
  },
  {
    id: 'v3',
    productName: '前端开发平台',
    version: 'v2.2.0',
    name: '组件化增强版',
    type: 'STANDARD',
    features: '1、vue3.0 升级改造 2、提供组件、模板市场能力 3、组件国际化支持',
    dependencies: '基础组件 V2.1.0',
    status: 'DEVELOPING',
    progress: 65,
    startDate: '2024-10-01',
    endDate: '2025-01-23',
    plannedUATDate: '2025-01-10',
    productManager: '向楠',
    versionAdmin: '叶彩霞',
    uatTester: '王五',
    customers: ['招商银行', '中信证券'],
    isReadyForDelivery: false,
    isArchived: false,
    isDelayed: false
  },
  {
    id: 'v4',
    productName: 'DevOps平台',
    version: 'V5.4.0',
    name: '多租户版本',
    type: 'STANDARD',
    features: '1. 提供多租户接入，灵活适配统一门户对接。研究院对接',
    dependencies: '',
    status: 'UAT_READY',
    progress: 90,
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    plannedUATDate: '2024-11-25',
    actualUATDate: '2024-11-25',
    productManager: '孙志广',
    versionAdmin: '邵洪燕',
    uatTester: '赵六',
    customers: ['研究院', '外部租户'],
    isReadyForDelivery: false,
    isArchived: false,
    isDelayed: false
  },
  {
    id: 'v5',
    productName: '工作流产品',
    version: 'V9.1',
    name: '东亚银行定制版',
    type: 'CUSTOMIZED',
    features: '1、国际化支持 2、数据库兼容 3、工具链一体化，数字构建平台对接',
    dependencies: 'V9.0',
    status: 'DELIVERED',
    progress: 100,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    plannedUATDate: '2024-06-15',
    actualUATDate: '2024-06-15',
    deliveryDate: '2024-07-01',
    productManager: '郭璐晓',
    versionAdmin: '郭璐晓',
    uatTester: '钱七',
    customers: ['东亚银行'],
    isReadyForDelivery: true,
    isArchived: false,
    isDelayed: false
  }
];

export const MOCK_RELEASES: Release[] = [
  {
    id: 'r1',
    version: 'v2.3.1 Hotfix',
    date: '2023-10-26 14:30',
    type: 'Hotfix',
    title: '修复支付回调异常',
    description: '修复了安卓端支付回调偶尔失败的问题；优化了首页加载速度。',
    items: ['Fix NPE in PaymentService', 'Optimize Index Query']
  },
  {
    id: 'r2',
    version: 'v2.3.0 正式版',
    date: '2023-10-15 10:00',
    type: 'Feature',
    title: '秋季功能大更新',
    description: '新增暗黑模式主题切换；重构了用户中心模块。',
    items: ['Dark Mode Support', 'User Center Refactor', 'New Dashboard']
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', title: '产品白皮书', category: DocumentCategory.MARKET, versionId: 'v2', updatedAt: '2023-10-01', author: 'Market Team', url: '#' },
  { id: 'd2', title: '用户快速操作手册', category: DocumentCategory.DELIVERY, versionId: 'v2', updatedAt: '2023-10-05', author: 'Doc Team', url: '#' },
  { id: 'd3', title: '用户手册', category: DocumentCategory.DELIVERY, versionId: 'v2', updatedAt: '2023-10-05', author: 'Doc Team', url: '#' },
  { id: 'd4', title: '部署手册', category: DocumentCategory.DELIVERY, versionId: 'v3', updatedAt: '2023-10-20', author: 'Ops Team', url: '#' },
  { id: 'd5', title: '系统功能测试用例', category: DocumentCategory.RND, versionId: 'v3', updatedAt: '2023-10-15', author: 'QA Team', url: '#' },
  { id: 'd6', title: '系统测试报告', category: DocumentCategory.RND, versionId: 'v2', updatedAt: '2023-09-30', author: 'QA Team', url: '#' },
  { id: 'd7', title: '性能测试报告', category: DocumentCategory.RND, versionId: 'v2', updatedAt: '2023-09-28', author: 'QA Team', url: '#' },
  { id: 'd8', title: '培训视频', category: DocumentCategory.DELIVERY, versionId: 'v2', updatedAt: '2023-10-10', author: 'Training Team', url: '#' },
  { id: 'd9', title: '产品培训材料PPT', category: DocumentCategory.DELIVERY, versionId: 'v2', updatedAt: '2023-10-10', author: 'Training Team', url: '#' },
  { id: 'd10', title: '产品培训视频', category: DocumentCategory.DELIVERY, versionId: 'v2', updatedAt: '2023-10-12', author: 'Training Team', url: '#' },
  { id: 'd11', title: '配置建议书', category: DocumentCategory.OPS, versionId: 'v3', updatedAt: '2023-10-22', author: 'Ops Team', url: '#' },
  { id: 'd12', title: '运维手册', category: DocumentCategory.OPS, versionId: 'v2', updatedAt: '2023-10-02', author: 'Ops Team', url: '#' },
  { id: 'd13', title: '需求规格说明书', category: DocumentCategory.RND, versionId: 'v3', updatedAt: '2023-09-15', author: 'Product Team', url: '#' },
  { id: 'd14', title: '概要设计说明书', category: DocumentCategory.RND, versionId: 'v3', updatedAt: '2023-09-20', author: 'Arch Team', url: '#' },
  { id: 'd15', title: '详细设计说明书', category: DocumentCategory.RND, versionId: 'v3', updatedAt: '2023-09-25', author: 'Dev Team', url: '#' },
  { id: 'd16', title: '系统开发手册和开发规范', category: DocumentCategory.RND, versionId: 'v1', updatedAt: '2023-01-10', author: 'Tech Lead', url: '#' },
  { id: 'd17', title: '接口说明文档 (API)', category: DocumentCategory.RND, versionId: 'v3', updatedAt: '2023-10-18', author: 'Dev Team', url: '#' },
  { id: 'd18', title: '数据库设计文档', category: DocumentCategory.RND, versionId: 'v3', updatedAt: '2023-09-22', author: 'DBA', url: '#' },
  { id: 'd19', title: '安全扫描报告', category: DocumentCategory.RND, versionId: 'v2', updatedAt: '2023-09-29', author: 'Sec Team', url: '#' },
  { id: 'd20', title: '产品介绍PPT', category: DocumentCategory.MARKET, versionId: 'v2', updatedAt: '2023-10-01', author: 'Marketing', url: '#' },
  { id: 'd21', title: '案例清单', category: DocumentCategory.MARKET, versionId: 'v1', updatedAt: '2023-05-20', author: 'Sales', url: '#' },
  { id: 'd22', title: '典型案例详情', category: DocumentCategory.MARKET, versionId: 'v2', updatedAt: '2023-08-15', author: 'Sales', url: '#' },
  { id: 'd23', title: '营销话术与控标点', category: DocumentCategory.MARKET, versionId: 'v2', updatedAt: '2023-08-20', author: 'Sales', url: '#' },
  { id: 'd24', title: '一纸禅 (One Pager)', category: DocumentCategory.MARKET, versionId: 'v3', updatedAt: '2023-10-05', author: 'Marketing', url: '#' },
  { id: 'd25', title: '方案建议书', category: DocumentCategory.MARKET, versionId: 'v3', updatedAt: '2023-10-08', author: 'Solutions', url: '#' },
];

export const MOCK_OUTBOUND_REQUESTS: OutboundRequest[] = [
  {
    id: 'OB-001',
    applicationDate: '2023-10-20',
    productId: 'p5',
    productName: '前端开发平台',
    versionId: 'v3',
    version: 'v2.2.0',
    applicant: '李明',
    projectSide: '招商银行项目组',
    requirements: '需要包含最新的国际化组件包',
    artifactUrl: 'http://nexus.corp/frontend/v2.2.0.zip',
    documentUrl: 'http://wiki.corp/docs/v2.2.0/deploy',
    status: 'APPROVED',
    operator: '王总',
    operationTime: '2023-10-21 10:00'
  },
  {
    id: 'OB-002',
    applicationDate: '2023-10-25',
    productId: 'p3',
    productName: '基础组件',
    versionId: 'v2',
    version: 'V2.1.0-20240930',
    applicant: '张伟',
    projectSide: '内部测试环境',
    requirements: '全量部署测试',
    status: 'PENDING'
  }
];

export const MOCK_NAV_GROUPS: NavGroup[] = [
  {
    id: 'g1',
    title: '研发工具链',
    items: [
      { id: 'r1', name: 'Gitlab', description: '代码托管仓库', url: 'https://gitlab.com', icon: 'Gitlab', bgColor: 'bg-orange-100 text-orange-600' },
      { id: 'r2', name: 'Jenkins', description: '持续集成流水线', url: 'https://jenkins.io', icon: 'Container', bgColor: 'bg-slate-100 text-slate-700' },
      { id: 'r3', name: 'SonarQube', description: '代码质量扫描', url: 'https://sonarqube.org', icon: 'Code2', bgColor: 'bg-blue-100 text-blue-600' },
      { id: 'r4', name: 'Nexus', description: '制品库管理', url: 'https://sonatype.com/nexus', icon: 'Database', bgColor: 'bg-green-100 text-green-600' },
    ]
  },
  {
    id: 'g2',
    title: '产品与协作',
    items: [
      { id: 'r5', name: 'Confluence', description: '企业Wiki知识库', url: 'https://atlassian.com/confluence', icon: 'BookOpen', bgColor: 'bg-blue-100 text-blue-600' },
      { id: 'r6', name: 'Jira', description: '敏捷项目管理', url: 'https://atlassian.com/software/jira', icon: 'Ticket', bgColor: 'bg-blue-100 text-blue-600' },
      { id: 'r7', name: 'Figma', description: 'UI设计与原型', url: 'https://figma.com', icon: 'Figma', bgColor: 'bg-purple-100 text-purple-600' },
    ]
  },
  {
    id: 'g3',
    title: '常用系统',
    items: [
      { id: 'r8', name: 'HR 系统', description: '人事考勤与请假', url: '#', icon: 'Users', bgColor: 'bg-pink-100 text-pink-600' },
      { id: 'r9', name: 'BI 报表', description: '数据分析大屏', url: '#', icon: 'BarChart', bgColor: 'bg-indigo-100 text-indigo-600' },
      { id: 'r10', name: 'OA 办公', description: '行政审批流程', url: '#', icon: 'Briefcase', bgColor: 'bg-teal-100 text-teal-600' },
    ]
  }
];
