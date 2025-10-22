import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { CreateAssetInput, UpdateAssetInput } from './asset.schema';
import { AssetGroupService } from './asset-group.service';
import { AssetService } from './asset.service';

const assetGroupService = new AssetGroupService(prisma);
const assetService = new AssetService(prisma, assetGroupService);

export const listAssetsHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const assets = await assetService.list(userId);
  res.status(StatusCodes.OK).json({ data: assets });
});

export const createAssetHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const asset = await assetService.create(userId, req.body as CreateAssetInput);
  res.status(StatusCodes.CREATED).json({ data: asset });
});

export const updateAssetHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const asset = await assetService.update(userId, req.params.id, req.body as UpdateAssetInput);
  res.status(StatusCodes.OK).json({ data: asset });
});

export const deleteAssetHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  await assetService.remove(userId, req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
