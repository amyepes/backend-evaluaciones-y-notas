import { PeriodType, PeriodStatus } from 'src/core/constant/academic.constant';
import { ActiveStatus } from 'src/core/constant/status.constant';

export class AcademicPeriod {
  id: string;
  code: string;
  name: string;
  type: PeriodType;
  startDate: Date;
  endDate: Date;
  status: PeriodStatus;
  description?: string;
  isDefault: boolean;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  subjects?: AcademicSubject[];
  evaluations?: AcademicEvaluation[];
  enrollments?: AcademicEnrollment[];
}

// Forward declarations for academic entities
declare class AcademicSubject {}
declare class AcademicEvaluation {}
declare class AcademicEnrollment {}
