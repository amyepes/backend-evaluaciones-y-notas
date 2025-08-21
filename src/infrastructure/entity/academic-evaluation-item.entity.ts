import { ItemType } from 'src/core/constant/evaluation.constant';
import { Status, ActiveStatus } from 'src/core/constant/status.constant';
import { 
  EvaluationOptions, 
  CorrectAnswer, 
  RubricCriteriaArray, 
  EvaluationTagArray 
} from 'src/core/model/json-data.model';
import { AcademicEvaluation } from 'src/infrastructure/entity/academic-evaluation.entity';

export class AcademicEvaluationItem {
  id: string;
  evaluationId: string;
  itemNumber: number;
  type: ItemType;
  question: string;
  options?: EvaluationOptions;
  correctAnswer?: CorrectAnswer;
  points: number; // Decimal
  rubricCriteria?: RubricCriteriaArray;
  explanation?: string;
  tags?: EvaluationTagArray;
  difficultyLevel?: string;
  learningObjective?: string;
  displayOrder: number;
  isRequired: boolean;
  timeLimit?: number; // In seconds
  status: Status;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  evaluation: AcademicEvaluation;
  gradeDetails?: AcademicGradeDetail[];
}

// Forward declaration
declare class AcademicGradeDetail {}
