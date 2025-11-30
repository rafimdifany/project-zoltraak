'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory
} from '@/hooks/use-categories';
import type { Category } from '@zoltraak/types';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/http-error';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['INCOME', 'EXPENSE'])
});

const subcategoryFormSchema = z.object({
  parentId: z.string().uuid('Select a parent category'),
  name: z.string().min(1, 'Subcategory name is required')
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;
type SubcategoryFormValues = z.infer<typeof subcategoryFormSchema>;

const createCategoryDefaults = (): CategoryFormValues => ({
  name: '',
  type: 'EXPENSE'
});

const createSubcategoryDefaults = (): SubcategoryFormValues => ({
  parentId: '',
  name: ''
});

const flattenCategories = (categories: Category[]): Category[] => {
  const result: Category[] = [];

  for (const category of categories) {
    result.push(category);
    if (category.subcategories.length) {
      result.push(...flattenCategories(category.subcategories));
    }
  }

  return result;
};

const getParentCategories = (categories: Category[]): Category[] =>
  categories.filter((category) => category.parentId === null);

const TYPE_LABELS = {
  INCOME: 'Income',
  EXPENSE: 'Expense'
} as const;

export default function CategoriesPage() {
  const categoriesQuery = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [subcategoryError, setSubcategoryError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategoryForm,
    formState: { errors: categoryErrors }
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: createCategoryDefaults()
  });

  const {
    register: registerSubcategory,
    handleSubmit: handleSubmitSubcategory,
    reset: resetSubcategoryForm,
    formState: { errors: subcategoryErrors }
  } = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: createSubcategoryDefaults()
  });

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);
  const rootCategories = useMemo(() => getParentCategories(categories), [categories]);
  const rootCategoriesByType = useMemo(
    () => ({
      INCOME: rootCategories.filter((category) => category.type === 'INCOME'),
      EXPENSE: rootCategories.filter((category) => category.type === 'EXPENSE')
    }),
    [rootCategories]
  );
  const flattenedCategories = useMemo(() => flattenCategories(categories), [categories]);
  const incomeRootCount = rootCategoriesByType.INCOME.length;
  const expenseRootCount = rootCategoriesByType.EXPENSE.length;
  const rootCategoryTotal = rootCategories.length;

  const isCreating = createCategory.isPending;

  const handleCreateCategory = handleSubmitCategory(async (values) => {
    setCategoryError(null);
    try {
      await createCategory.mutateAsync({ name: values.name.trim(), type: values.type });
      resetCategoryForm(createCategoryDefaults());
    } catch (error) {
      setCategoryError(getErrorMessage(error, 'Unable to create the category. Please try again.'));
    }
  });

  const handleCreateSubcategory = handleSubmitSubcategory(async (values) => {
    setSubcategoryError(null);

    try {
      await createCategory.mutateAsync({
        name: values.name.trim(),
        parentId: values.parentId
      });
      resetSubcategoryForm(createSubcategoryDefaults());
    } catch (error) {
      setSubcategoryError(
        getErrorMessage(error, 'Unable to create the subcategory. Please try again.')
      );
    }
  });

  const handleDeleteCategory = async (category: Category) => {
    if (category.isDefault) {
      return;
    }

    const hasChildren = category.subcategories.length > 0;
    const confirmationMessage = hasChildren
      ? 'Remove all subcategories before deleting this category.'
      : 'Delete this category? This action cannot be undone.';

    if (hasChildren) {
      setRemoveError(confirmationMessage);
      return;
    }

    const confirmed = window.confirm(confirmationMessage);
    if (!confirmed) {
      return;
    }

    setRemoveError(null);
    setRemovingId(category.id);

    try {
      await deleteCategory.mutateAsync(category.id);
    } catch (error) {
      setRemoveError(getErrorMessage(error, 'Unable to delete the category. Please try again.'));
    } finally {
      setRemovingId(null);
    }
  };

  const handleDeleteSubcategory = async (subcategory: Category) => {
    if (subcategory.isDefault) {
      return;
    }

    const confirmed = window.confirm('Delete this subcategory? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    setRemoveError(null);
    setRemovingId(subcategory.id);

    try {
      await deleteCategory.mutateAsync(subcategory.id);
    } catch (error) {
      setRemoveError(getErrorMessage(error, 'Unable to delete the subcategory. Please try again.'));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <Card className="border border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Manage categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <form className="space-y-4 rounded-2xl border border-border p-4 dark:border-white/10" onSubmit={handleCreateCategory}>
              <div className="space-y-1">
                <Label htmlFor="category-name">New category</Label>
                <Input id="category-name" placeholder="e.g. Travel" {...registerCategory('name')} />
                {categoryErrors.name ? (
                  <p className="text-xs text-rose-500">{categoryErrors.name.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Create a top-level category to organise your spending and income.
                  </p>
                )}
              </div>
              {categoryError ? <p className="text-sm text-rose-500">{categoryError}</p> : null}
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add category
                  </>
                )}
              </Button>
            </form>

            <form
              className="space-y-4 rounded-2xl border border-border p-4 dark:border-white/10"
              onSubmit={handleCreateSubcategory}
            >
              <div className="space-y-2">
                <Label htmlFor="subcategory-parent">Add subcategory</Label>
                <select
                  id="subcategory-parent"
                  className={cn(
                    'h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-[#1b2030]',
                    subcategoryErrors.parentId && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  )}
                  {...registerSubcategory('parentId')}
                >
                  <option value="">Select a category</option>
                  {rootCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {subcategoryErrors.parentId ? (
                  <p className="text-xs text-rose-500">{subcategoryErrors.parentId.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Choose an income or expense category to create a subcategory beneath it.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="subcategory-name">Subcategory name</Label>
                <Input
                  id="subcategory-name"
                  placeholder="e.g. Flights"
                  {...registerSubcategory('name')}
                />
                {subcategoryErrors.name ? (
                  <p className="text-xs text-rose-500">{subcategoryErrors.name.message}</p>
                ) : null}
              </div>

              {subcategoryError ? <p className="text-sm text-rose-500">{subcategoryError}</p> : null}

              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add subcategory
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-border p-4 dark:border-white/10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Category directory</h2>
                <p className="text-sm text-muted-foreground dark:text-slate-400">
                  Organise categories and subcategories that power your budgeting and transaction
                  workflows.
                </p>
              </div>
              <span className="rounded-full border border-border bg-transparent px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:text-slate-300">
                {rootCategoryTotal} categories - {expenseRootCount} expense / {incomeRootCount} income
              </span>
            </div>

            {categoriesQuery.isLoading ? (
              <div className="flex min-h-[160px] items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : null}

            {categoriesQuery.isError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
                {getErrorMessage(
                  categoriesQuery.error,
                  'Unable to load categories. Please refresh and try again.'
                )}
              </div>
            ) : null}

            {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
              rootCategories.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="text-left text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="py-3 pr-4">Category</th>
                        <th className="py-3 pr-4">Type</th>
                        <th className="py-3 pr-4">Subcategories</th>
                        <th className="py-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rootCategories.map((category) => (
                        <tr key={category.id}>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{category.name}</span>
                              {category.isDefault ? (
                                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground dark:bg-white/10 dark:text-slate-300">
                                  Default
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={cn(
                              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
                              category.type === 'INCOME'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                            )}>
                              {TYPE_LABELS[category.type]}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            {category.subcategories.length ? (
                              <div className="flex flex-wrap gap-2">
                                {category.subcategories.map((subcategory) => (
                                  <span
                                    key={subcategory.id}
                                    className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium dark:border-white/10"
                                  >
                                    {subcategory.name}
                                    {!subcategory.isDefault ? (
                                      <button
                                        type="button"
                                        className="text-muted-foreground transition hover:text-foreground"
                                        onClick={() => handleDeleteSubcategory(subcategory)}
                                        disabled={removingId === subcategory.id}
                                      >
                                        {removingId === subcategory.id ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <Trash2 className="h-3.5 w-3.5" />
                                        )}
                                      </button>
                                    ) : null}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">No subcategories</span>
                            )}
                          </td>
                          <td className="py-3 pr-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={
                                  category.isDefault ||
                                  removingId === category.id ||
                                  category.subcategories.length > 0
                                }
                                onClick={() => handleDeleteCategory(category)}
                              >
                                {removingId === category.id ? (
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-1 h-4 w-4" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Start by creating a category to organise your finances.
                </div>
              )
            ) : null}

            {removeError ? (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                {removeError}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border dark:border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground dark:text-slate-300">
            <p>
              The following categories and subcategories are available when creating transactions,
              budgets, and dashboards. Default entries are provided to get you started, and any
              custom categories you add will show up across the app instantly.
            </p>
            <p className="mt-3">
              Total entries: {flattenedCategories.length}{' '}
              {flattenedCategories.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}






