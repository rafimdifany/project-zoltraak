import {
  Prisma,
  type Asset as AssetModel,
  type AssetGroup as AssetGroupModel,
  type PrismaClient
} from '@prisma/client';

import type { Asset as AssetDto } from '@zoltraak/types';
import { AppError } from '../../lib/app-error';
import { ensureUserCurrency } from '../../lib/ensure-user-currency';
import { AssetGroupService } from './asset-group.service';
import type { CreateAssetInput, UpdateAssetInput } from './asset.schema';

type AssetWithGroup = AssetModel & { group: AssetGroupModel };

export class AssetService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly assetGroupService: AssetGroupService
  ) {}

  private serialize(asset: AssetWithGroup): AssetDto {
    return {
      id: asset.id,
      userId: asset.userId,
      name: asset.name,
      group: {
        id: asset.group.id,
        userId: asset.group.userId,
        name: asset.group.name,
        isDefault: asset.group.isDefault,
        createdAt: asset.group.createdAt.toISOString(),
        updatedAt: asset.group.updatedAt.toISOString()
      },
      groupId: asset.groupId,
      currentValue: asset.currentValue.toNumber(),
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString()
    };
  }

  async list(userId: string): Promise<AssetDto[]> {
    const assets = await this.prisma.asset.findMany({
      where: { userId },
      include: { group: true },
      orderBy: { createdAt: 'desc' }
    });

    return assets.map((asset) => this.serialize(asset));
  }

  async create(userId: string, input: CreateAssetInput): Promise<AssetDto> {
    await ensureUserCurrency(this.prisma, userId);
    await this.assetGroupService.findOwnedBy(userId, input.groupId);

    const asset = await this.prisma.asset.create({
      data: {
        userId,
        name: input.name,
        groupId: input.groupId,
        currentValue: new Prisma.Decimal(input.currentValue)
      },
      include: { group: true }
    });

    return this.serialize(asset);
  }

  async update(userId: string, id: string, input: UpdateAssetInput): Promise<AssetDto> {
    const existing = await this.prisma.asset.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new AppError('Asset not found', 404);
    }

    if (input.groupId) {
      await this.assetGroupService.findOwnedBy(userId, input.groupId);
    }

    const updated = await this.prisma.asset.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.groupId && { groupId: input.groupId }),
        ...(input.currentValue !== undefined && {
          currentValue: new Prisma.Decimal(input.currentValue)
        })
      },
      include: { group: true }
    });

    return this.serialize(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.asset.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      throw new AppError('Asset not found', 404);
    }

    await this.prisma.asset.delete({ where: { id } });
  }
}
