import { UserType, GenderType } from 'src/core/constant/user.constant';
import { Status, ActiveStatus } from 'src/core/constant/status.constant';
import { PermissionArray, AuditLogValues } from 'src/core/model/json-data.model';

export class CoreUser {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  userType: UserType;
  status: Status;
  isActive: ActiveStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  profile?: CoreUserProfile;
  roles?: CoreUserRole[];
  sessions?: CoreUserSession[];
  auditLogs?: CoreAuditLog[];

  // Academic relationships
  teacherEvaluations?: AcademicEvaluation[];
  studentGrades?: AcademicGrade[];
  graderGrades?: AcademicGrade[];
  enrollments?: AcademicEnrollment[];
}

export class CoreUserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  documentType?: string;
  documentNumber?: string;
  dateOfBirth?: Date;
  gender?: GenderType;
  phoneNumber?: string;
  emergencyPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  profileImageUrl?: string;
  biography?: string;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  user: CoreUser;
}

export class CoreRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: PermissionArray;
  isSystem: boolean;
  status: Status;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  userRoles?: CoreUserRole[];
}

export class CoreUserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedBy?: string;
  assignedAt: Date;
  expiresAt?: Date;
  isActive: ActiveStatus;

  // Relationships
  user: CoreUser;
  role: CoreRole;
}

export class CoreUserSession {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: ActiveStatus;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;

  // Relationships
  user: CoreUser;
}

export class CoreAuditLog {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValues?: AuditLogValues;
  newValues?: AuditLogValues;
  ipAddress?: string;
  userAgent?: string;
  isActive: ActiveStatus;
  createdAt: Date;

  // Relationships
  user?: CoreUser;
}

// Forward declarations for academic entities
declare class AcademicEvaluation {}
declare class AcademicGrade {}
declare class AcademicEnrollment {}
