-- AlterTable
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Schedule_id_key";
