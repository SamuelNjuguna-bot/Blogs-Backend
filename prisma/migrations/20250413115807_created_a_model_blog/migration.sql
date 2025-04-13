-- CreateTable
CREATE TABLE "Blogs" (
    "blogId" TEXT NOT NULL,
    "blog_title" TEXT NOT NULL,
    "blog_description" TEXT NOT NULL,
    "blog_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("blogId")
);

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user1"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
