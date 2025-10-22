import { Prisma, type AssetGroup as AssetGroupModel, type PrismaClient } from '@prisma/client';

import type { AssetGroup } from '@zoltraak/types';
import { AppError } from '../../lib/app-error';
import { ensureUserCurrency } from '../../lib/ensure-user-currency';
import { DEFAULT_ASSET_GROUP_SET, DEFAULT_ASSET_GROUPS } from './constants';

export class AssetGroupService {
  constructor(private readonly prisma: PrismaClient) {}

  private serialize(group: AssetGroupModel): AssetGroup {
    return {
      id: group.id,
      userId: group.userId,
      name: group.name,
      isDefault: group.isDefault,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString()
    };
  }

  private async ensureDefaults(userId: string): Promise<void> {
    if (!DEFAULT_ASSET_GROUPS.length) {
      return;
    }

    await this.prisma.assetGroup.createMany({
      data: DEFAULT_ASSET_GROUPS.map((name) => ({
        userId,
        name,
        isDefault: true
      })),
      skipDuplicates: true
    });
  }

  async list(userId: string): Promise<AssetGroup[]> {
    await this.ensureDefaults(userId);

    const groups = await this.prisma.assetGroup.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'asc' }, { name: 'asc' }]
    });

    return groups.map((group) => this.serialize(group));
  }

  async create(userId: string, name: string): Promise<AssetGroup> {
    await ensureUserCurrency(this.prisma, userId);
    await this.ensureDefaults(userId);

    const trimmed = name.trim();

    if (!trimmed) {
      throw new AppError('Group name is required', 400);
    }

    try {
      const group = await this.prisma.assetGroup.create({
        data: {
          userId,
          name: trimmed,
          isDefault: DEFAULT_ASSET_GROUP_SET.has(trimmed)
        }
      });

      return this.serialize(group);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError('You already have a group with this name', 409);
      }

      throw error;
    }
  }

  async findOwnedBy(userId: string, groupId: string): Promise<AssetGroupModel> {
    const group = await this.prisma.assetGroup.findFirst({
      where: { id: groupId, userId }
    });

    if (!group) {
      throw new AppError('Asset group not found', 404);
    }

    return group;
  }
}
