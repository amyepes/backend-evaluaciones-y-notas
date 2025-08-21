import { GradeStatus, QualitativeGrade } from 'src/core/constant/grade.constant';
import { ActiveStatus } from 'src/core/constant/status.constant';
import { GradeMetadata } from 'src/core/model/json-data.model';
import { AcademicEvaluation } from 'src/infrastructure/entity/academic-evaluation.entity';
import { CoreUser } from 'src/infrastructure/entity/core-user.entity';

export class AcademicGrade {
  id: string;
  evaluationId: string;
  studentId: string;
  score: number; // Decimal
  maxPossibleScore: number; // Decimal
  percentage: number; // Decimal
  qualitativeGrade?: QualitativeGrade;
  attemptNumber: number;
  submittedAt?: Date;
  gradedAt?: Date;
  gradedBy?: string;
  timeSpentMinutes?: number;
  isLateSubmission: boolean;
  latePenalty?: number; // Decimal
  feedback?: string;
  privateNotes?: string;
  status: GradeStatus;
  isActive: ActiveStatus;
  metadata?: GradeMetadata;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  evaluation: AcademicEvaluation;
  student: CoreUser;
  grader?: CoreUser;
  gradeDetails?: AcademicGradeDetail[];
}

// Forward declaration
declare class AcademicGradeDetail {}
