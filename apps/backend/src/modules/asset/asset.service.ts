import { Prisma, type Asset as AssetModel, type PrismaClient } from '@prisma/client';

import type { Asset as AssetDto } from '@zoltraak/types';
import { AppError } from '../../lib/app-error';
import type { CreateAssetInput, UpdateAssetInput } from './asset.schema';

export class AssetService {
  constructor(private readonly prisma: PrismaClient) {}

  private serialize(asset: AssetModel): AssetDto {
    return {
      id: asset.id,
      userId: asset.userId,
      name: asset.name,
      category: asset.category,
      currentValue: asset.currentValue.toNumber(),
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString()
    };
  }

  async list(userId: string): Promise<AssetDto[]> {
    const assets = await this.prisma.asset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return assets.map((asset) => this.serialize(asset));
  }

  async create(userId: string, input: CreateAssetInput): Promise<AssetDto> {
    const asset = await this.prisma.asset.create({
      data: {
        userId,
        name: input.name,
        category: input.category ?? null,
        currentValue: new Prisma.Decimal(input.currentValue)
      }
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

    const updated = await this.prisma.asset.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.category !== undefined && { category: input.category ?? null }),
        ...(input.currentValue !== undefined && {
          currentValue: new Prisma.Decimal(input.currentValue)
        })
      }
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
