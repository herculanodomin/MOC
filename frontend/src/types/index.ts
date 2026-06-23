export type UserRole =
  | 'CHANGE_REQUESTER'
  | 'CHANGE_ACCEPTOR'
  | 'CHANGE_OWNER'
  | 'CHANGE_REVIEW_TEAM'
  | 'CHANGE_APPROVER'
  | 'ADMIN';

export type MocStatus =
  | 'DRAFT'
  | 'PENDING_ACCEPTANCE'
  | 'UNDER_REVIEW'
  | 'RISK_ASSESSMENT'
  | 'IMPLEMENTATION_PLANNING'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'IN_IMPLEMENTATION'
  | 'PSSR_PENDING'
  | 'IMPLEMENTED'
  | 'CLOSED'
  | 'REJECTED'
  | 'CANCELLED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ActionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
}

export interface Moc {
  id: number;
  title: string;
  description: string;
  changeType: string;
  location?: string;
  responsibleArea?: string;
  justification: string;
  status: MocStatus;
  riskLevel?: RiskLevel;
  requestedDate: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  requester: User;
  acceptor?: User;
  owner?: User;
  attachments?: Attachment[];
  riskAssessments?: RiskAssessment[];
  actions?: Action[];
  approvals?: Approval[];
  pssrItems?: PssrItem[];
  closureInfo?: ClosureInfo;
  auditLogs?: AuditLog[];
}

export interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

export interface RiskAssessment {
  id: number;
  hazard: string;
  consequence: string;
  probability: number;
  severity: number;
  riskScore: number;
  riskLevel: RiskLevel;
  mitigation: string;
}

export interface Action {
  id: number;
  description: string;
  startDate?: string;
  endDate?: string;
  status: ActionStatus;
  responsible: User;
}

export interface Approval {
  id: number;
  comments?: string;
  isApproved: boolean;
  approvalOrder: number;
  approvedAt: string;
  approver: User;
}

export interface PssrItem {
  id: number;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ClosureInfo {
  result: string;
  issuesFound?: string;
  lessonsLearned?: string;
  closedAt: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId?: number;
  details?: string;
  createdAt: string;
  user: User;
}
