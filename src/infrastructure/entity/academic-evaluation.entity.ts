import { EvaluationType, EvaluationStatus } from 'src/core/constant/evaluation.constant';
import { ActiveStatus } from 'src/core/constant/status.constant';
import { EvaluationMetadata } from 'src/core/model/json-data.model';
import { AcademicPeriod } from 'src/infrastructure/entity/academic-period.entity';
import { AcademicSubject } from 'src/infrastructure/entity/academic-subject.entity';
import { CoreUser } from 'src/infrastructure/entity/core-user.entity';

export class AcademicEvaluation {
  id: string;
  periodId: string;
  subjectId: string;
  teacherId: string;
  code: string;
  name: string;
  type: EvaluationType;
  description?: string;
  instructions?: string;
  scheduledDate?: Date;
  durationMinutes?: number;
  maxScore: number; // Decimal
  passingScore: number; // Decimal
  weightPercentage: number; // Decimal
  maxAttempts: number;
  allowLateSubmission: boolean;
  latePenaltyPercentage?: number; // Decimal
  showResultsToStudents: boolean;
  randomizeQuestions: boolean;
  status: EvaluationStatus;
  isActive: ActiveStatus;
  metadata?: EvaluationMetadata;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  period: AcademicPeriod;
  subject: AcademicSubject;
  teacher: CoreUser;
  items?: AcademicEvaluationItem[];
  grades?: AcademicGrade[];
}

// Forward declarations
declare class AcademicEvaluationItem {}
declare class AcademicGrade {}
