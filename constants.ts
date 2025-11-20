
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
    name: 'Cloud ERP Core',
    description: '企业资源规划核心系统，处理财务与库存。',
    owner: 'Sarah Miller',
    health: 98,
    activeTickets: 12,
    icon: 'Box'
  },
  {
    id: 'p2',
    name: 'Nexus Mobile App',
    description: '面向终端用户的移动端应用 (iOS/Android)。',
    owner: 'David Li',
    health: 85,
    activeTickets: 34,
    icon: 'Smartphone'
  },
  {
    id: 'p3',
    name: 'Data Analytics Gateway',
    description: '大数据处理与BI报表网关服务。',
    owner: 'Emily Zhang',
    health: 45,
    activeTickets: 8,
    icon: 'BarChart'
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
    productId: 'p1',
    devOwner: 'Sarah Miller',
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
    productId: 'p2',
    assigneeId: 'u1',
    reporterId: 'u8',
    testOwner: 'Jessica Wu',
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
    productId: 'p3',
    reporterId: 'u12',
    createdAt: '2023-10-24T11:00:00Z',
    updatedAt: '2023-10-24T11:00:00Z',
    reportingMonth: '2023-10',
    tags: ['Export', 'Feature']
  },
  {
    id: 'T-1027',
    title: '数据库连接池耗尽报警',
    description: '监控系统检测到 Analytics Gateway 的主数据库连接池在过去 1 小时内 3 次达到 100% 占用。',
    status: TicketStatus.OPEN,
    priority: TicketPriority.CRITICAL,
    type: 'Infrastructure',
    customerName: 'Internal Ops',
    productVersion: 'v1.2.0',
    productId: 'p3',
    reporterId: 'sys_monitor',
    createdAt: '2023-10-26T10:45:00Z',
    updatedAt: '2023-10-26T10:45:00Z',
    reportingMonth: '2023-10',
    attachmentUrl: 'https://example.com/logs/db_pool.log',
    tags: ['Database', 'Alert', 'Infra']
  }
];

export const MOCK_VERSIONS: ProductVersion[] = [
  {
    id: 'v1',
    productName: '基础组件平台',
    version: 'v2.0.0',
    name: '平台基础版本',
    type: 'STANDARD',
    features: '整合项目，需求，计划，架构，测试管理平台方案。',
    status: 'RELEASED',
    progress: 100,
    customers: ['Standard Market'],
    envRequirements: 'Linux/Docker',
    startDate: '2023-01-01',
    endDate: '2023-06-30',
    plannedUATDate: '2023-06-01',
    actualUATDate: '2023-06-05',
    productManager: '王如阳',
    versionAdmin: '叶彩霞',
    uatTester: '肖建军',
    isReadyForDelivery: true,
    isArchived: false,
    isDelayed: false,
  },
  {
    id: 'v2',
    productName: '基础组件平台',
    version: 'v2.1.0-202309',
    name: '平台功能优化版',
    type: 'STANDARD',
    features: '完整整合项目，需求，建模，DevOps，后端开发，前端开发。',
    status: 'RELEASED',
    progress: 100,
    customers: ['Internal'],
    envRequirements: 'K8s Cluster',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    plannedUATDate: '2023-09-15',
    actualUATDate: '2023-09-15',
    productManager: '王如阳',
    versionAdmin: '叶彩霞',
    uatTester: '肖建军',
    isReadyForDelivery: true,
    isArchived: true,
    isDelayed: false,
    relatedReleaseVersion: 'REL-2.1.0'
  },
  {
    id: 'v3',
    productName: '前端开发框架',
    version: 'v2.2',
    name: '组件化增强版',
    type: 'STANDARD',
    features: '1. Vue3.0 升级改造 2. 提供组件、模板市场能力 3. 性能优化',
    status: 'DEVELOPING',
    progress: 65,
    customers: [],
    envRequirements: 'Node 18+',
    startDate: '2023-10-01',
    endDate: '2025-01-23',
    plannedUATDate: '2024-12-30',
    productManager: '向楠',
    versionAdmin: '向楠',
    uatTester: 'TBD',
    isReadyForDelivery: false,
    isArchived: false,
    isDelayed: false,
    dependencies: '基础组件 v2.1.0'
  },
  {
    id: 'v4',
    productName: '工作流产品',
    version: 'v9.1',
    name: '东亚银行定制版',
    type: 'CUSTOMIZED',
    features: '1. 国际化支持 2. 数据库兼容 DB2 3. 审批流特殊节点逻辑',
    status: 'UAT_VERIFYING',
    progress: 90,
    customers: ['BEA Bank'],
    envRequirements: 'AIX/DB2',
    startDate: '2023-08-01',
    endDate: '2023-12-30',
    plannedUATDate: '2023-11-15',
    actualUATDate: '2023-11-20',
    deliveryDate: '2023-12-15',
    productManager: '郭璐晓',
    versionAdmin: '郭璐晓',
    uatDeployer: 'Ops Team',
    uatTester: 'Test Team A',
    isReadyForDelivery: true,
    isArchived: false,
    isDelayed: true,
    exceptionNote: 'DB2 Driver compatibility issues caused 5 day delay'
  }
];

export const MOCK_RELEASES: Release[] = [
  {
    id: 'r1',
    version: 'v2.3.1 Hotfix',
    date: 'Yesterday 14:30',
    type: 'Hotfix',
    title: 'Fix payment callback failure',
    description: '修复了安卓端支付回调偶尔失败的问题；优化了首页加载速度。',
    items: ['Android Pay Callback Fix', 'Home Load Optimization']
  },
  {
    id: 'r2',
    version: 'v2.3.0 Official',
    date: '2023-10-15',
    type: 'Feature',
    title: 'Dark Mode & User Center',
    description: '新增暗黑模式主题切换；重构了用户中心模块。',
    items: ['Dark Mode Support', 'User Center Refactor', 'Performance Tuning']
  }
];

// Combine docs for v2.3.0 (v1) and v2.4.0 (v2)
const createDocs = (versionId: string, author: string = 'Product Team'): Document[] => [
  // Market / Pre-sales
  { id: `d_${versionId}_1`, title: '产品白皮书', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-01', author, url: '#' },
  { id: `d_${versionId}_2`, title: '产品介绍PPT', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-02', author, url: '#' },
  { id: `d_${versionId}_3`, title: '案例清单', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-03', author, url: '#' },
  { id: `d_${versionId}_4`, title: '典型案例', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-03', author, url: '#' },
  { id: `d_${versionId}_5`, title: '营销话术与控标点', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-04', author, url: '#' },
  { id: `d_${versionId}_6`, title: '一纸禅', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-04', author, url: '#' },
  { id: `d_${versionId}_7`, title: '方案建议书', category: DocumentCategory.MARKET, versionId, updatedAt: '2023-10-05', author, url: '#' },

  // Delivery / Usage
  { id: `d_${versionId}_8`, title: '用户快速操作手册', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-10', author, url: '#' },
  { id: `d_${versionId}_9`, title: '用户手册', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-10', author, url: '#' },
  { id: `d_${versionId}_10`, title: '部署手册', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-11', author: 'DevOps', url: '#' },
  { id: `d_${versionId}_11`, title: '配置建议书', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-11', author: 'Arch', url: '#' },
  { id: `d_${versionId}_12`, title: '产品培训材料PPT', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-12', author, url: '#' },
  { id: `d_${versionId}_13`, title: '产品培训视频', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-13', author, url: '#' },
  { id: `d_${versionId}_14`, title: '培训视频', category: DocumentCategory.DELIVERY, versionId, updatedAt: '2023-10-13', author, url: '#' },

  // Operations
  { id: `d_${versionId}_15`, title: '运维手册', category: DocumentCategory.OPS, versionId, updatedAt: '2023-10-15', author: 'SRE', url: '#' },

  // R&D / Testing
  { id: `d_${versionId}_16`, title: '需求规格说明书 (SRS)', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-01', author: 'Alice', url: '#' },
  { id: `d_${versionId}_17`, title: '概要设计', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-05', author: 'Bob', url: '#' },
  { id: `d_${versionId}_18`, title: '详细设计', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-10', author: 'Bob', url: '#' },
  { id: `d_${versionId}_19`, title: '系统开发手册和开发规范', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-01', author: 'Tech Lead', url: '#' },
  { id: `d_${versionId}_20`, title: '接口说明', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-15', author: 'Dev Team', url: '#' },
  { id: `d_${versionId}_21`, title: '数据库设计', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-15', author: 'DBA', url: '#' },
  { id: `d_${versionId}_22`, title: '系统功能测试用例', category: DocumentCategory.RND, versionId, updatedAt: '2023-09-20', author: 'QA', url: '#' },
  { id: `d_${versionId}_23`, title: '系统测试报告', category: DocumentCategory.RND, versionId, updatedAt: '2023-10-01', author: 'QA', url: '#' },
  { id: `d_${versionId}_24`, title: '性能测试报告', category: DocumentCategory.RND, versionId, updatedAt: '2023-10-01', author: 'QA', url: '#' },
  { id: `d_${versionId}_25`, title: '安全扫描报告', category: DocumentCategory.RND, versionId, updatedAt: '2023-10-02', author: 'Sec Team', url: '#' },
];

export const MOCK_DOCUMENTS: Document[] = [
  ...createDocs('v1'),
  ...createDocs('v2')
];

export const MOCK_OUTBOUND_REQUESTS: OutboundRequest[] = [
  {
    id: 'OB-20231001',
    applicationDate: '2023-10-01',
    productId: 'p1',
    productName: 'Cloud ERP Core',
    versionId: 'v2',
    version: 'v2.1.0-202309',
    applicant: 'John Doe',
    projectSide: 'ABC Finance Group',
    requirements: 'Standard Deployment',
    artifactUrl: 'http://repo.nexus.com/v2.1.0',
    documentUrl: 'http://docs.nexus.com/v2.1.0',
    status: 'APPROVED',
    operator: 'Admin User',
    operationTime: '2023-10-02 10:00:00'
  },
  {
    id: 'OB-20231005',
    applicationDate: '2023-10-05',
    productId: 'p2',
    productName: 'Nexus Mobile App',
    versionId: 'v3',
    version: 'v2.2',
    applicant: 'Jane Smith',
    projectSide: 'Retail Chain X',
    requirements: 'Custom Logo Integration',
    status: 'PENDING',
  },
  {
    id: 'OB-20231012',
    applicationDate: '2023-10-12',
    productId: 'p4',
    productName: '工作流产品',
    versionId: 'v4',
    version: 'v9.1',
    applicant: 'Guo Luxiao',
    projectSide: 'BEA Bank',
    requirements: 'Requires DB2 drivers pre-installed',
    artifactUrl: 'http://repo.nexus.com/v9.1/bea',
    status: 'APPROVED',
    operator: 'Ops Team',
    operationTime: '2023-10-13 09:30:00'
  }
];

export const MOCK_NAV_GROUPS: NavGroup[] = [
  {
    id: 'g1',
    title: '研发工具链 (DevOps)',
    items: [
      { id: 'r1', name: 'GitLab', description: '代码托管与 CI/CD 流水线平台', url: 'https://gitlab.com', icon: 'Gitlab', bgColor: 'bg-orange-100 text-orange-600' },
      { id: 'r2', name: 'Jenkins', description: '自动化构建、测试与部署服务', url: '#', icon: 'Container', bgColor: 'bg-slate-100 text-slate-600' },
      { id: 'r3', name: 'SonarQube', description: '代码质量检查与安全扫描', url: '#', icon: 'Code2', bgColor: 'bg-blue-100 text-blue-600' },
      { id: 'r4', name: 'Nexus Repo', description: 'Maven/NPM 制品库管理', url: '#', icon: 'Database', bgColor: 'bg-green-100 text-green-600' },
    ]
  },
  {
    id: 'g2',
    title: '产品与协作 (Collaboration)',
    items: [
      { id: 'r5', name: 'Confluence', description: '企业级知识库与产品文档协作', url: '#', icon: 'BookOpen', bgColor: 'bg-blue-100 text-blue-700' },
      { id: 'r6', name: 'Jira Software', description: '敏捷项目管理与缺陷追踪系统', url: '#', icon: 'Ticket', bgColor: 'bg-blue-50 text-blue-600' },
      { id: 'r7', name: 'Figma', description: 'UI/UX 界面设计与原型协作', url: '#', icon: 'Figma', bgColor: 'bg-purple-100 text-purple-600' },
      { id: 'r8', name: 'Miro', description: '在线白板与头脑风暴', url: '#', icon: 'Layout', bgColor: 'bg-yellow-100 text-yellow-600' },
    ]
  },
  {
    id: 'g3',
    title: '资源与文档 (Resources)',
    items: [
      { id: 'r9', name: 'Ant Design', description: '企业级 UI 设计语言与组件库', url: 'https://ant.design', icon: 'Component', bgColor: 'bg-red-50 text-red-600' },
      { id: 'r10', name: 'Tailwind CSS', description: '原子化 CSS 框架文档', url: 'https://tailwindcss.com', icon: 'Wind', bgColor: 'bg-cyan-50 text-cyan-600' },
      { id: 'r11', name: 'React Docs', description: 'React 官方中文文档', url: 'https://react.dev', icon: 'Atom', bgColor: 'bg-slate-800 text-cyan-400' },
    ]
  },
  {
    id: 'g4',
    title: '常用系统 (Management)',
    items: [
      { id: 'r12', name: 'OA 系统', description: '内部办公自动化审批流程', url: '#', icon: 'Briefcase', bgColor: 'bg-indigo-100 text-indigo-600' },
      { id: 'r13', name: 'CRM 客户管理', description: '销售线索与客户关系维护', url: '#', icon: 'Users', bgColor: 'bg-pink-100 text-pink-600' },
      { id: 'r14', name: 'BI 报表平台', description: '运营数据可视化分析大屏', url: '#', icon: 'BarChart', bgColor: 'bg-emerald-100 text-emerald-600' },
    ]
  }
];
