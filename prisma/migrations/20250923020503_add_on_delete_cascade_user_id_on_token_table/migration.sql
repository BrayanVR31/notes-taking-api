-- DropForeignKey
ALTER TABLE "public"."tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
