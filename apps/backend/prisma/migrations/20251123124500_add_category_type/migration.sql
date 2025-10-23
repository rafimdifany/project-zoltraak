-- Create Enum
CREATE TYPE "CategoryType" AS ENUM ('INCOME', 'EXPENSE');

-- AddColumn
ALTER TABLE "Category" ADD COLUMN "type" "CategoryType" NOT NULL DEFAULT 'EXPENSE';

-- Backfill subcategories to inherit parent type
UPDATE "Category" AS child
SET "type" = parent."type"
FROM "Category" AS parent
WHERE child."parentId" = parent."id";

-- Drop existing unique index and create new ones including type
DROP INDEX IF EXISTS "Category_userId_parentId_name_key";
CREATE UNIQUE INDEX "Category_userId_type_parentId_name_key"
  ON "Category"("userId", "type", "parentId", "name");

DROP INDEX IF EXISTS "Category_userId_parentId_idx";
CREATE INDEX "Category_userId_type_parentId_idx"
  ON "Category"("userId", "type", "parentId");
