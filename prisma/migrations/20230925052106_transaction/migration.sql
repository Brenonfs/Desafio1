-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardholderName" TEXT NOT NULL,
    "cardExpirationDate" TIMESTAMP(3) NOT NULL,
    "cardVerificationCode" TEXT NOT NULL,
    "payables" TEXT NOT NULL,
    "valuePayables" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
