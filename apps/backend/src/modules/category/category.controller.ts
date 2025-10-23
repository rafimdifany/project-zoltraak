import { StatusCodes } from 'http-status-codes';

import { asyncHandler } from '../../lib/async-handler';
import { prisma } from '../../lib/prisma';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema';
import { CategoryService } from './category.service';

const categoryService = new CategoryService(prisma);

export const listCategoriesHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const categories = await categoryService.list(userId);
  res.status(StatusCodes.OK).json({ data: categories });
});

export const createCategoryHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const category = await categoryService.create(userId, req.body as CreateCategoryInput);
  res.status(StatusCodes.CREATED).json({ data: category });
});

export const updateCategoryHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const category = await categoryService.update(userId, req.params.id, req.body as UpdateCategoryInput);
  res.status(StatusCodes.OK).json({ data: category });
});

export const deleteCategoryHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  await categoryService.remove(userId, req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});
