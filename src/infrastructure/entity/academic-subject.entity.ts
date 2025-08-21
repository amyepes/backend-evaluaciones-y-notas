import { Status, ActiveStatus } from 'src/core/constant/status.constant';
import { 
  PrerequisiteArray, 
  CorequisiteArray, 
  LearningObjectiveArray, 
  BibliographyArray 
} from 'src/core/model/json-data.model';

export class AcademicSubject {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  weeklyHours: number;
  semester?: number;
  knowledgeArea?: string;
  prerequisites?: PrerequisiteArray;
  corequisites?: CorequisiteArray;
  learningObjectives?: LearningObjectiveArray;
  syllabus?: string;
  bibliography?: BibliographyArray;
  status: Status;
  isActive: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  periods?: AcademicPeriod[];
  evaluations?: AcademicEvaluation[];
  enrollments?: AcademicEnrollment[];
}

// Forward declarations for academic entities
declare class AcademicPeriod {}
declare class AcademicEvaluation {}
declare class AcademicEnrollment {}
