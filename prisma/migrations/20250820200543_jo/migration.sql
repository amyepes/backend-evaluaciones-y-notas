-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('STUDENT', 'TEACHER', 'ADMINISTRATOR', 'COORDINATOR');

-- CreateEnum
CREATE TYPE "public"."GenderType" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('ENROLLED', 'DROPPED', 'COMPLETED', 'TRANSFERRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."EvaluationStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'GRADING');

-- CreateEnum
CREATE TYPE "public"."EvaluationType" AS ENUM ('EXAM', 'QUIZ', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'PARTICIPATION', 'LAB_WORK', 'MIDTERM', 'FINAL');

-- CreateEnum
CREATE TYPE "public"."GradeStatus" AS ENUM ('PENDING', 'GRADED', 'REVIEW_REQUESTED', 'UNDER_REVIEW', 'FINAL', 'APPEALED');

-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'NUMERIC', 'MATCHING', 'FILL_BLANK', 'RUBRIC_CRITERIA');

-- CreateEnum
CREATE TYPE "public"."PeriodStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PeriodType" AS ENUM ('SEMESTER', 'TRIMESTER', 'QUARTER', 'ANNUAL', 'SUMMER', 'INTENSIVE');

-- CreateEnum
CREATE TYPE "public"."QualitativeGrade" AS ENUM ('EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'UNSATISFACTORY');

-- CreateEnum
CREATE TYPE "public"."ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "public"."core_users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" VARCHAR(255) NOT NULL,
    "user_type" "public"."UserType" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "document_type" VARCHAR(20),
    "document_number" VARCHAR(30),
    "date_of_birth" DATE,
    "gender" "public"."GenderType",
    "phone_number" VARCHAR(20),
    "emergency_phone" VARCHAR(20),
    "address" TEXT,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "zip_code" VARCHAR(10),
    "profile_image_url" TEXT,
    "biography" TEXT,
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_roles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "core_user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "core_user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entity_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_periods" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "type" "public"."PeriodType" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "public"."PeriodStatus" NOT NULL DEFAULT 'PLANNED',
    "description" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_subjects" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 1,
    "weekly_hours" INTEGER NOT NULL DEFAULT 1,
    "semester" INTEGER,
    "knowledge_area" VARCHAR(100),
    "prerequisites" JSONB,
    "corequisites" JSONB,
    "learning_objectives" JSONB,
    "syllabus" TEXT,
    "bibliography" JSONB,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_enrollments" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "final_grade" DECIMAL(5,2),
    "final_percentage" DECIMAL(5,2),
    "credits_earned" INTEGER DEFAULT 0,
    "attendance_rate" DECIMAL(5,2),
    "dropped_date" TIMESTAMP(3),
    "drop_reason" TEXT,
    "completed_date" TIMESTAMP(3),
    "certificate_issued" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "metadata" JSONB,
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_evaluations" (
    "id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "type" "public"."EvaluationType" NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "scheduled_date" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "max_score" DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    "passing_score" DECIMAL(5,2) NOT NULL DEFAULT 60.00,
    "weight_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "max_attempts" INTEGER NOT NULL DEFAULT 1,
    "allow_late_submission" BOOLEAN NOT NULL DEFAULT false,
    "late_penalty_percentage" DECIMAL(5,2) DEFAULT 0.00,
    "show_results_to_students" BOOLEAN NOT NULL DEFAULT true,
    "randomize_questions" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."EvaluationStatus" NOT NULL DEFAULT 'DRAFT',
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_evaluation_items" (
    "id" TEXT NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "item_number" INTEGER NOT NULL,
    "type" "public"."ItemType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB,
    "correct_answer" JSONB,
    "points" DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    "rubric_criteria" JSONB,
    "explanation" TEXT,
    "tags" JSONB,
    "difficulty_level" VARCHAR(20),
    "learning_objective" VARCHAR(200),
    "display_order" INTEGER NOT NULL DEFAULT 1,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "time_limit" INTEGER,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_evaluation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_grades" (
    "id" TEXT NOT NULL,
    "evaluation_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "max_possible_score" DECIMAL(5,2) NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "qualitative_grade" "public"."QualitativeGrade",
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "submitted_at" TIMESTAMP(3),
    "graded_at" TIMESTAMP(3),
    "graded_by" TEXT,
    "time_spent_minutes" INTEGER,
    "is_late_submission" BOOLEAN NOT NULL DEFAULT false,
    "late_penalty" DECIMAL(5,2) DEFAULT 0.00,
    "feedback" TEXT,
    "private_notes" TEXT,
    "status" "public"."GradeStatus" NOT NULL DEFAULT 'PENDING',
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."academic_grade_details" (
    "id" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,
    "evaluation_item_id" TEXT NOT NULL,
    "student_answer" JSONB,
    "points" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "max_points" DECIMAL(5,2) NOT NULL,
    "is_correct" BOOLEAN,
    "auto_graded" BOOLEAN NOT NULL DEFAULT false,
    "feedback" TEXT,
    "rubric_scores" JSONB,
    "partial_credit" BOOLEAN NOT NULL DEFAULT false,
    "time_spent_seconds" INTEGER,
    "flagged_for_review" BOOLEAN NOT NULL DEFAULT false,
    "review_notes" TEXT,
    "is_active" "public"."ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_grade_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AcademicPeriodToAcademicSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AcademicPeriodToAcademicSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_users_username_key" ON "public"."core_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "core_users_email_key" ON "public"."core_users"("email");

-- CreateIndex
CREATE INDEX "core_users_email_idx" ON "public"."core_users"("email");

-- CreateIndex
CREATE INDEX "core_users_username_idx" ON "public"."core_users"("username");

-- CreateIndex
CREATE INDEX "core_users_user_type_status_idx" ON "public"."core_users"("user_type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "core_user_profiles_user_id_key" ON "public"."core_user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "core_user_profiles_document_number_key" ON "public"."core_user_profiles"("document_number");

-- CreateIndex
CREATE INDEX "core_user_profiles_document_number_idx" ON "public"."core_user_profiles"("document_number");

-- CreateIndex
CREATE INDEX "core_user_profiles_first_name_last_name_idx" ON "public"."core_user_profiles"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "core_roles_name_key" ON "public"."core_roles"("name");

-- CreateIndex
CREATE INDEX "core_user_roles_user_id_idx" ON "public"."core_user_roles"("user_id");

-- CreateIndex
CREATE INDEX "core_user_roles_role_id_idx" ON "public"."core_user_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "core_user_roles_user_id_role_id_key" ON "public"."core_user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "core_user_sessions_token_key" ON "public"."core_user_sessions"("token");

-- CreateIndex
CREATE INDEX "core_user_sessions_user_id_idx" ON "public"."core_user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "core_user_sessions_token_idx" ON "public"."core_user_sessions"("token");

-- CreateIndex
CREATE INDEX "core_user_sessions_expires_at_idx" ON "public"."core_user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "core_audit_logs_user_id_idx" ON "public"."core_audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "core_audit_logs_action_idx" ON "public"."core_audit_logs"("action");

-- CreateIndex
CREATE INDEX "core_audit_logs_entity_entity_id_idx" ON "public"."core_audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "core_audit_logs_created_at_idx" ON "public"."core_audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "academic_periods_code_key" ON "public"."academic_periods"("code");

-- CreateIndex
CREATE INDEX "academic_periods_code_idx" ON "public"."academic_periods"("code");

-- CreateIndex
CREATE INDEX "academic_periods_start_date_end_date_idx" ON "public"."academic_periods"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "academic_periods_status_idx" ON "public"."academic_periods"("status");

-- CreateIndex
CREATE UNIQUE INDEX "academic_subjects_code_key" ON "public"."academic_subjects"("code");

-- CreateIndex
CREATE INDEX "academic_subjects_code_idx" ON "public"."academic_subjects"("code");

-- CreateIndex
CREATE INDEX "academic_subjects_name_idx" ON "public"."academic_subjects"("name");

-- CreateIndex
CREATE INDEX "academic_subjects_knowledge_area_idx" ON "public"."academic_subjects"("knowledge_area");

-- CreateIndex
CREATE INDEX "academic_subjects_semester_idx" ON "public"."academic_subjects"("semester");

-- CreateIndex
CREATE INDEX "academic_enrollments_student_id_idx" ON "public"."academic_enrollments"("student_id");

-- CreateIndex
CREATE INDEX "academic_enrollments_subject_id_idx" ON "public"."academic_enrollments"("subject_id");

-- CreateIndex
CREATE INDEX "academic_enrollments_period_id_idx" ON "public"."academic_enrollments"("period_id");

-- CreateIndex
CREATE INDEX "academic_enrollments_status_idx" ON "public"."academic_enrollments"("status");

-- CreateIndex
CREATE INDEX "academic_enrollments_enrollment_date_idx" ON "public"."academic_enrollments"("enrollment_date");

-- CreateIndex
CREATE UNIQUE INDEX "academic_enrollments_student_id_subject_id_period_id_key" ON "public"."academic_enrollments"("student_id", "subject_id", "period_id");

-- CreateIndex
CREATE INDEX "academic_evaluations_period_id_subject_id_idx" ON "public"."academic_evaluations"("period_id", "subject_id");

-- CreateIndex
CREATE INDEX "academic_evaluations_teacher_id_idx" ON "public"."academic_evaluations"("teacher_id");

-- CreateIndex
CREATE INDEX "academic_evaluations_scheduled_date_idx" ON "public"."academic_evaluations"("scheduled_date");

-- CreateIndex
CREATE INDEX "academic_evaluations_status_idx" ON "public"."academic_evaluations"("status");

-- CreateIndex
CREATE INDEX "academic_evaluations_type_idx" ON "public"."academic_evaluations"("type");

-- CreateIndex
CREATE UNIQUE INDEX "academic_evaluations_period_id_subject_id_code_key" ON "public"."academic_evaluations"("period_id", "subject_id", "code");

-- CreateIndex
CREATE INDEX "academic_evaluation_items_evaluation_id_idx" ON "public"."academic_evaluation_items"("evaluation_id");

-- CreateIndex
CREATE INDEX "academic_evaluation_items_type_idx" ON "public"."academic_evaluation_items"("type");

-- CreateIndex
CREATE INDEX "academic_evaluation_items_difficulty_level_idx" ON "public"."academic_evaluation_items"("difficulty_level");

-- CreateIndex
CREATE UNIQUE INDEX "academic_evaluation_items_evaluation_id_item_number_key" ON "public"."academic_evaluation_items"("evaluation_id", "item_number");

-- CreateIndex
CREATE INDEX "academic_grades_evaluation_id_idx" ON "public"."academic_grades"("evaluation_id");

-- CreateIndex
CREATE INDEX "academic_grades_student_id_idx" ON "public"."academic_grades"("student_id");

-- CreateIndex
CREATE INDEX "academic_grades_graded_by_idx" ON "public"."academic_grades"("graded_by");

-- CreateIndex
CREATE INDEX "academic_grades_status_idx" ON "public"."academic_grades"("status");

-- CreateIndex
CREATE INDEX "academic_grades_submitted_at_idx" ON "public"."academic_grades"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "academic_grades_evaluation_id_student_id_attempt_number_key" ON "public"."academic_grades"("evaluation_id", "student_id", "attempt_number");

-- CreateIndex
CREATE INDEX "academic_grade_details_grade_id_idx" ON "public"."academic_grade_details"("grade_id");

-- CreateIndex
CREATE INDEX "academic_grade_details_evaluation_item_id_idx" ON "public"."academic_grade_details"("evaluation_item_id");

-- CreateIndex
CREATE INDEX "academic_grade_details_is_correct_idx" ON "public"."academic_grade_details"("is_correct");

-- CreateIndex
CREATE INDEX "academic_grade_details_auto_graded_idx" ON "public"."academic_grade_details"("auto_graded");

-- CreateIndex
CREATE UNIQUE INDEX "academic_grade_details_grade_id_evaluation_item_id_key" ON "public"."academic_grade_details"("grade_id", "evaluation_item_id");

-- CreateIndex
CREATE INDEX "_AcademicPeriodToAcademicSubject_B_index" ON "public"."_AcademicPeriodToAcademicSubject"("B");

-- AddForeignKey
ALTER TABLE "public"."core_user_profiles" ADD CONSTRAINT "core_user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."core_user_roles" ADD CONSTRAINT "core_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."core_user_roles" ADD CONSTRAINT "core_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."core_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."core_user_sessions" ADD CONSTRAINT "core_user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."core_audit_logs" ADD CONSTRAINT "core_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_enrollments" ADD CONSTRAINT "academic_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_enrollments" ADD CONSTRAINT "academic_enrollments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."academic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_enrollments" ADD CONSTRAINT "academic_enrollments_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "public"."academic_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_evaluations" ADD CONSTRAINT "academic_evaluations_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "public"."academic_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_evaluations" ADD CONSTRAINT "academic_evaluations_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."academic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_evaluations" ADD CONSTRAINT "academic_evaluations_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."core_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_evaluation_items" ADD CONSTRAINT "academic_evaluation_items_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "public"."academic_evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_grades" ADD CONSTRAINT "academic_grades_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "public"."academic_evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_grades" ADD CONSTRAINT "academic_grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."core_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_grades" ADD CONSTRAINT "academic_grades_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "public"."core_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_grade_details" ADD CONSTRAINT "academic_grade_details_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "public"."academic_grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."academic_grade_details" ADD CONSTRAINT "academic_grade_details_evaluation_item_id_fkey" FOREIGN KEY ("evaluation_item_id") REFERENCES "public"."academic_evaluation_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AcademicPeriodToAcademicSubject" ADD CONSTRAINT "_AcademicPeriodToAcademicSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."academic_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AcademicPeriodToAcademicSubject" ADD CONSTRAINT "_AcademicPeriodToAcademicSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."academic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
