export const DEFAULT_ASSET_GROUPS = [
  'Cash',
  'Accounts',
  'Debit card',
  'Savings',
  'Investments',
  'Insurance'
] as const;

// Widen the set type so membership checks accept arbitrary user input strings.
export const DEFAULT_ASSET_GROUP_SET = new Set<string>(DEFAULT_ASSET_GROUPS);
