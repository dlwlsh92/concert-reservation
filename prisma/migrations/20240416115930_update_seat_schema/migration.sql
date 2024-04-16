/*
  Warnings:

  - Added the required column `reservationDate` to the `ConcertEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConcertEvent" ADD COLUMN     "reservationDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;
