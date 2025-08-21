// ============================================================================
// PERMISSION MODELS
// ============================================================================

export interface Permission {
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}

export type PermissionArray = Permission[];

// ============================================================================
// ACADEMIC SUBJECT MODELS
// ============================================================================

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
  bloomLevel?: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
}

export interface BibliographyItem {
  id: string;
  type: 'book' | 'article' | 'website' | 'journal' | 'thesis' | 'other';
  title: string;
  authors: string[];
  year?: number;
  publisher?: string;
  url?: string;
  isbn?: string;
  doi?: string;
  pages?: string;
  edition?: string;
}

export type PrerequisiteArray = string[]; // Array of subject IDs
export type CorequisiteArray = string[]; // Array of subject IDs
export type LearningObjectiveArray = LearningObjective[];
export type BibliographyArray = BibliographyItem[];

// ============================================================================
// EVALUATION MODELS
// ============================================================================

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  leftId: string;
  leftText: string;
  rightId: string;
  rightText: string;
}

export interface FillBlankOption {
  position: number;
  acceptedAnswers: string[];
  caseSensitive: boolean;
}

export type EvaluationOptions = 
  | MultipleChoiceOption[]
  | MatchingPair[]
  | FillBlankOption[]
  | string[]; // For simple options

export interface CorrectAnswer {
  type: 'single' | 'multiple' | 'text' | 'numeric' | 'matching';
  value: string | string[] | number | { [key: string]: string };
  tolerance?: number; // For numeric answers
  caseSensitive?: boolean;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
  weight: number;
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

export type RubricCriteriaArray = RubricCriterion[];

export interface EvaluationTag {
  id: string;
  name: string;
  color?: string;
  category?: string;
}

export type EvaluationTagArray = EvaluationTag[];

// ============================================================================
// GRADE MODELS
// ============================================================================

export interface StudentAnswer {
  type: 'text' | 'multiple_choice' | 'numeric' | 'file' | 'matching';
  value: string | string[] | number | File | { [key: string]: string };
  submittedAt: Date;
  timeSpent?: number; // in seconds
}

export interface RubricScore {
  criterionId: string;
  levelId: string;
  points: number;
  feedback?: string;
}

export type RubricScoreArray = RubricScore[];

// ============================================================================
// AUDIT LOG MODELS
// ============================================================================

export interface AuditLogValues {
  [fieldName: string]: any;
}

// ============================================================================
// ENROLLMENT METADATA MODELS
// ============================================================================

export interface EnrollmentMetadata {
  source?: 'manual' | 'automatic' | 'import';
  importBatchId?: string;
  specialConditions?: string[];
  accommodations?: string[];
  paymentStatus?: 'pending' | 'paid' | 'overdue' | 'waived';
  scholarshipApplied?: boolean;
  scholarshipAmount?: number;
}

// ============================================================================
// EVALUATION METADATA MODELS
// ============================================================================

export interface EvaluationMetadata {
  estimatedDuration?: number; // in minutes
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  topics?: string[];
  keywords?: string[];
  version?: string;
  createdFrom?: string; // template ID
  securitySettings?: {
    preventCopyPaste?: boolean;
    fullScreenMode?: boolean;
    disableRightClick?: boolean;
    timeWarnings?: number[]; // minutes before end
  };
}

// ============================================================================
// GRADE METADATA MODELS
// ============================================================================

export interface GradeMetadata {
  ipAddress?: string;
  userAgent?: string;
  browserInfo?: {
    name: string;
    version: string;
    os: string;
  };
  submissionMethod?: 'online' | 'offline' | 'mobile';
  proctoring?: {
    enabled: boolean;
    violations?: string[];
    recordingId?: string;
  };
}
