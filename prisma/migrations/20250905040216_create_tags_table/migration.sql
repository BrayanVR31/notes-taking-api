-- CreateTable
CREATE TABLE "public"."tags" (
    "tag_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);
