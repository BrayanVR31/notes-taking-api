-- CreateTable
CREATE TABLE "public"."sessions" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
