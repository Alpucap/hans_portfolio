-- CreateTable
CREATE TABLE "SkillCard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "skills" TEXT NOT NULL,

    CONSTRAINT "SkillCard_pkey" PRIMARY KEY ("id")
);
