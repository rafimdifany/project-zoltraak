-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM (
  'USD',
  'SDG',
  'INR',
  'JPY',
  'RUB',
  'GBP',
  'EUR',
  'CNY',
  'IDR',
  'MYR',
  'AUD',
  'BRL',
  'SAR',
  'AED'
);

-- Add column to User
ALTER TABLE "User"
ADD COLUMN "currency" "CurrencyCode";

-- Add column to Transaction
ALTER TABLE "Transaction"
ADD COLUMN "currency" "CurrencyCode";
