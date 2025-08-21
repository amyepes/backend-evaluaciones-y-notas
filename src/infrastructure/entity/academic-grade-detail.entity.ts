import { ActiveStatus } from 'src/core/constant/status.constant';
import { StudentAnswer, RubricScoreArray } from 'src/core/model/json-data.model';
import { AcademicGrade } from 'src/infrastructure/entity/academic-grade.entity';
import { AcademicEvaluationItem } from 'src/infrastructure/entity/academic-evaluation-item.entity';

export class AcademicGradeDetail {
  id: string;
  gradeId: string;
  evaluationItemId: string;
  studentAnswer?: StudentAnswer;
  points: number; // Decimal
  maxPoints: number; // Decimal
  isCorrect?: boolean;
  autoGraded: boolean;
  feedback?: string;
  rubricScores?: RubricScoreArray;
  partialCredit: boolean;
  timeSpentSeconds?: number;
  flaggedForReview: boolean;
  reviewNotes?: string;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  grade: AcademicGrade;
  evaluationItem: AcademicEvaluationItem;
}
