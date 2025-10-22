export const DEFAULT_ASSET_GROUPS = [
  'Cash',
  'Accounts',
  'Debit card',
  'Savings',
  'Investments',
  'Insurance'
] as const;

export const DEFAULT_ASSET_GROUP_SET = new Set(DEFAULT_ASSET_GROUPS);
