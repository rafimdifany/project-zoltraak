export interface AssetGroup {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  groupId: string;
  group: AssetGroup;
  currentValue: number;
  createdAt: string;
  updatedAt: string;
}
