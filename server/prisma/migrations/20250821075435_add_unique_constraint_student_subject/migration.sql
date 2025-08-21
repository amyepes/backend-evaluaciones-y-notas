/*
  Warnings:

  - A unique constraint covering the columns `[studentId,subjectId]` on the table `StudentSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentSubject_studentId_subjectId_key" ON "public"."StudentSubject"("studentId", "subjectId");
