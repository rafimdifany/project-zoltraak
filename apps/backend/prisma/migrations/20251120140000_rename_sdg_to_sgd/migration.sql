-- Rename currency enum value from SDG to SGD (if present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'CurrencyCode'
      AND e.enumlabel = 'SDG'
  ) THEN
    ALTER TYPE "CurrencyCode" RENAME VALUE 'SDG' TO 'SGD';
  END IF;
END;
$$;
