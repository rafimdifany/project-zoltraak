import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { DashboardQuery } from './dashboard.schema';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService(prisma);

export const dashboardOverviewHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const overview = await dashboardService.overview(userId, req.query as DashboardQuery);
  res.status(StatusCodes.OK).json({ data: overview });
});
