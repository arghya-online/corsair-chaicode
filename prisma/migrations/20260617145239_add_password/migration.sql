-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
