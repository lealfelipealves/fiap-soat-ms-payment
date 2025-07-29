-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Aprovado', 'Pendente', 'Recusado');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_id" TEXT,
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Pendente',
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;
