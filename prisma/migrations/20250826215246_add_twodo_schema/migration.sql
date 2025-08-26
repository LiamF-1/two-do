-- CreateTable
CREATE TABLE "twodo"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twodo"."Pair" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Bucket List',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twodo"."PairMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',

    CONSTRAINT "PairMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twodo"."Invite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "pairId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twodo"."Item" (
    "id" TEXT NOT NULL,
    "pairId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twodo"."Completion" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Completion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "twodo"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PairMember_userId_pairId_key" ON "twodo"."PairMember"("userId", "pairId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_code_key" ON "twodo"."Invite"("code");

-- CreateIndex
CREATE INDEX "Item_pairId_position_idx" ON "twodo"."Item"("pairId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Completion_itemId_key" ON "twodo"."Completion"("itemId");

-- AddForeignKey
ALTER TABLE "twodo"."PairMember" ADD CONSTRAINT "PairMember_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "twodo"."Pair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twodo"."PairMember" ADD CONSTRAINT "PairMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "twodo"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twodo"."Invite" ADD CONSTRAINT "Invite_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "twodo"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twodo"."Invite" ADD CONSTRAINT "Invite_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "twodo"."Pair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twodo"."Item" ADD CONSTRAINT "Item_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "twodo"."Pair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twodo"."Completion" ADD CONSTRAINT "Completion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "twodo"."Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twodo"."Completion" ADD CONSTRAINT "Completion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "twodo"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
