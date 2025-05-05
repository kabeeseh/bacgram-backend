/*
  Warnings:

  - Added the required column `views` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "views" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_viewedPosts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_viewedPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_viewedPosts_B_index" ON "_viewedPosts"("B");

-- AddForeignKey
ALTER TABLE "_viewedPosts" ADD CONSTRAINT "_viewedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_viewedPosts" ADD CONSTRAINT "_viewedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
