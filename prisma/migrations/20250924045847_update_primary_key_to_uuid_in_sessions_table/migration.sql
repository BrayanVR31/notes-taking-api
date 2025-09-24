/*
  Warnings:

  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_pkey",
ALTER COLUMN "session_id" DROP DEFAULT,
ALTER COLUMN "session_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id");
DROP SEQUENCE "sessions_session_id_seq";
