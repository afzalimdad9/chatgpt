-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isFailed" BOOLEAN DEFAULT false,
ADD COLUMN     "isLoading" BOOLEAN DEFAULT false;
