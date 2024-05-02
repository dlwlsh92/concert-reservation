-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "version" SET DEFAULT 1;
