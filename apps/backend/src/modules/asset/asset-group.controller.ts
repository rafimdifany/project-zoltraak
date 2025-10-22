import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { CreateAssetGroupInput } from './asset-group.schema';
import { AssetGroupService } from './asset-group.service';

const assetGroupService = new AssetGroupService(prisma);

export const listAssetGroupsHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const groups = await assetGroupService.list(userId);
  res.status(StatusCodes.OK).json({ data: groups });
});

export const createAssetGroupHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const group = await assetGroupService.create(userId, (req.body as CreateAssetGroupInput).name);
  res.status(StatusCodes.CREATED).json({ data: group });
});
