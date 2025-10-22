-- Enable UUID generation if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "AssetGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetGroup_pkey" PRIMARY KEY ("id")
);

-- AddColumn (nullable for backfill)
ALTER TABLE "Asset" ADD COLUMN "groupId" TEXT;

-- Insert default groups for every user
INSERT INTO "AssetGroup" ("id", "userId", "name", "isDefault", "createdAt", "updatedAt")
SELECT uuid_generate_v4(), "User"."id", defaults.name, TRUE, NOW(), NOW()
FROM "User"
CROSS JOIN (VALUES
  ('Cash'),
  ('Accounts'),
  ('Debit card'),
  ('Savings'),
  ('Investments'),
  ('Insurance')
) AS defaults(name)
WHERE NOT EXISTS (
  SELECT 1
  FROM "AssetGroup"
  WHERE "AssetGroup"."userId" = "User"."id"
    AND "AssetGroup"."name" = defaults.name
);

-- Insert groups derived from existing asset categories
INSERT INTO "AssetGroup" ("id", "userId", "name", "isDefault", "createdAt", "updatedAt")
SELECT uuid_generate_v4(), categories."userId", categories."name", FALSE, NOW(), NOW()
FROM (
  SELECT DISTINCT "userId", TRIM("category") AS "name"
  FROM "Asset"
  WHERE "category" IS NOT NULL AND TRIM("category") <> ''
) AS categories
WHERE NOT EXISTS (
  SELECT 1
  FROM "AssetGroup"
  WHERE "AssetGroup"."userId" = categories."userId"
    AND "AssetGroup"."name" = categories."name"
);

-- Backfill assets with matching groups (by previous category or defaulting to Cash)
UPDATE "Asset" AS a
SET "groupId" = ag."id"
FROM "AssetGroup" AS ag
WHERE ag."userId" = a."userId"
  AND ag."name" = COALESCE(NULLIF(TRIM(a."category"), ''), 'Cash');

-- Assign any remaining assets to the default Cash group
UPDATE "Asset" AS a
SET "groupId" = ag."id"
FROM "AssetGroup" AS ag
WHERE a."groupId" IS NULL
  AND ag."userId" = a."userId"
  AND ag."name" = 'Cash';

-- Ensure every asset has a group
ALTER TABLE "Asset"
ALTER COLUMN "groupId" SET NOT NULL;

-- Drop legacy category column
ALTER TABLE "Asset" DROP COLUMN "category";

-- Add unique constraint for groups
CREATE UNIQUE INDEX "AssetGroup_userId_name_key" ON "AssetGroup"("userId", "name");

-- AddForeignKey constraints
ALTER TABLE "AssetGroup" ADD CONSTRAINT "AssetGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AssetGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
