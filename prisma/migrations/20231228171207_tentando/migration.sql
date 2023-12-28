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

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarFileId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "idPerson" INTEGER NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatarFileId_fkey" FOREIGN KEY ("avatarFileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
