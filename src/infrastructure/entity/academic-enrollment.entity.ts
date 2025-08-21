import { EnrollmentStatus } from 'src/core/constant/academic.constant';
import { ActiveStatus } from 'src/core/constant/status.constant';
import { EnrollmentMetadata } from 'src/core/model/json-data.model';
import { CoreUser } from 'src/infrastructure/entity/core-user.entity';
import { AcademicSubject } from 'src/infrastructure/entity/academic-subject.entity';
import { AcademicPeriod } from 'src/infrastructure/entity/academic-period.entity';

export class AcademicEnrollment {
  id: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  finalGrade?: number; // Decimal
  finalPercentage?: number; // Decimal
  creditsEarned?: number;
  attendanceRate?: number; // Decimal
  droppedDate?: Date;
  dropReason?: string;
  completedDate?: Date;
  certificateIssued: boolean;
  notes?: string;
  metadata?: EnrollmentMetadata;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  student: CoreUser;
  subject: AcademicSubject;
  period: AcademicPeriod;
}
