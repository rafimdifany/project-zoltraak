import {
  Prisma,
  type Category as CategoryModel,
  type PrismaClient
} from '@prisma/client';

import type { Category as CategoryDto } from '@zoltraak/types';
import { AppError } from '../../lib/app-error';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema';
import { DEFAULT_CATEGORIES } from './constants';

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  private toDto(category: CategoryModel, subcategories: CategoryDto[] = []): CategoryDto {
    return {
      id: category.id,
      userId: category.userId,
      parentId: category.parentId,
      name: category.name,
      type: category.type,
      isDefault: category.isDefault,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      subcategories
    };
  }

  private buildTree(categories: CategoryModel[]): CategoryDto[] {
    const byParent = new Map<string | null, CategoryDto[]>();

    for (const category of categories) {
      const dto = this.toDto(category);
      const parentKey = category.parentId ?? null;
      const siblings = byParent.get(parentKey) ?? [];
      siblings.push(dto);
      byParent.set(parentKey, siblings);
    }

    const sortNodes = (nodes: CategoryDto[]) =>
      nodes.sort((a, b) => a.name.localeCompare(b.name));

    const assignChildren = (parentId: string | null): CategoryDto[] => {
      const nodes = sortNodes([...(byParent.get(parentId) ?? [])]);
      return nodes.map((node) => ({
        ...node,
        subcategories: assignChildren(node.id)
      }));
    };

    return assignChildren(null);
  }

  private async ensureDefaults(userId: string): Promise<void> {
    if (!DEFAULT_CATEGORIES.length) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      for (const category of DEFAULT_CATEGORIES) {
        const existingRoot = await tx.category.findFirst({
          where: {
            userId,
            type: category.type,
            parentId: null,
            name: category.name
          }
        });

        const root = existingRoot
          ? await tx.category.update({
              where: { id: existingRoot.id },
              data: { isDefault: true }
            })
          : await tx.category.create({
              data: {
                userId,
                name: category.name,
                type: category.type,
                parentId: null,
                isDefault: true
              }
            });

        if (category.subcategories?.length) {
          for (const subcategoryName of category.subcategories) {
            const existingSubcategory = await tx.category.findFirst({
              where: {
                userId,
                type: category.type,
                parentId: root.id,
                name: subcategoryName
              }
            });

            if (existingSubcategory) {
              await tx.category.update({
                where: { id: existingSubcategory.id },
                data: { isDefault: true }
              });
            } else {
              await tx.category.create({
                data: {
                  userId,
                  name: subcategoryName,
                  type: category.type,
                  parentId: root.id,
                  isDefault: true
                }
              });
            }
          }
        }
      }
    });
  }

  private async findOwnedBy(userId: string, id: string): Promise<CategoryModel> {
    const category = await this.prisma.category.findFirst({
      where: { id, userId }
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async list(userId: string): Promise<CategoryDto[]> {
    await this.ensureDefaults(userId);

    const categories = await this.prisma.category.findMany({
      where: { userId },
      orderBy: [{ type: 'asc' }, { parentId: 'asc' }, { name: 'asc' }]
    });

    return this.buildTree(categories);
  }

  async create(userId: string, input: CreateCategoryInput): Promise<CategoryDto> {
    await this.ensureDefaults(userId);

    const trimmedName = input.name.trim();
    if (!trimmedName) {
      throw new AppError('Category name is required', 400);
    }

    let parentId: string | null = null;
    let categoryType = input.type ?? 'EXPENSE';

    if (input.parentId) {
      const parent = await this.findOwnedBy(userId, input.parentId);
      parentId = parent.id;
      categoryType = parent.type;
    } else if (!input.type) {
      throw new AppError('Category type is required', 400);
    }

    try {
      const category = await this.prisma.category.create({
        data: {
          userId,
          name: trimmedName,
          parentId,
          type: categoryType,
          isDefault: false
        }
      });

      return this.toDto(category, []);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError('A category with this name already exists', 409);
      }

      throw error;
    }
  }

  async update(userId: string, id: string, input: UpdateCategoryInput): Promise<CategoryDto> {
    const category = await this.findOwnedBy(userId, id);

    if (category.isDefault) {
      throw new AppError('Default categories cannot be modified', 400);
    }

    const updates: Prisma.CategoryUpdateInput = {};

    if (input.name !== undefined) {
      const trimmed = input.name.trim();
      if (!trimmed) {
        throw new AppError('Category name is required', 400);
      }

      updates.name = trimmed;
    }

    try {
      const updated = await this.prisma.category.update({
        where: { id },
        data: updates
      });

      return this.toDto(updated, []);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError('A category with this name already exists', 409);
      }

      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    const category = await this.findOwnedBy(userId, id);

    if (category.isDefault) {
      throw new AppError('Default categories cannot be removed', 400);
    }

    const childCount = await this.prisma.category.count({
      where: { parentId: id, userId }
    });

    if (childCount > 0) {
      throw new AppError('Remove subcategories before deleting this category', 409);
    }

    await this.prisma.category.delete({ where: { id } });
  }
}
