'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Loader2, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useAssetGroups,
  useAssets,
  useCreateAsset,
  useCreateAssetGroup,
  useDeleteAsset,
  useUpdateAsset
} from '@/hooks/use-assets';
import { useCurrencyFormatter } from '@/hooks/use-currency';
import { getErrorMessage } from '@/lib/http-error';
import type { Asset } from '@zoltraak/types';

const assetFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  groupId: z.string().uuid({ message: 'Please choose a group' }),
  currentValue: z.coerce.number().nonnegative('Value must be zero or higher')
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

const createDefaultValues = (): AssetFormValues => ({
  name: '',
  groupId: '',
  currentValue: 0
});

const groupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function AssetsPage() {
  const { format: formatCurrency } = useCurrencyFormatter();
  const assetsQuery = useAssets();
  const assetGroupsQuery = useAssetGroups();
  const createAsset = useCreateAsset();
  const updateAsset = useUpdateAsset();
  const deleteAsset = useDeleteAsset();
  const createAssetGroup = useCreateAssetGroup();

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupActionError, setGroupActionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: createDefaultValues()
  });

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    reset: resetGroup,
    formState: { errors: groupErrors }
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: { name: '' }
  });

  const assets = assetsQuery.data ?? [];
  const assetGroups = useMemo(
    () => assetGroupsQuery.data ?? [],
    [assetGroupsQuery.data]
  );
  const isSubmitting = createAsset.isPending || updateAsset.isPending;
  const selectedGroupId = watch('groupId');

  useEffect(() => {
    if (!editingAsset && assetGroups.length && !selectedGroupId) {
      setValue('groupId', assetGroups[0].id, { shouldValidate: true });
    }
  }, [assetGroups, editingAsset, selectedGroupId, setValue]);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setActionError(null);
    reset({
      name: asset.name,
      groupId: asset.groupId,
      currentValue: asset.currentValue
    });
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
    setActionError(null);
    reset(createDefaultValues());
  };

  const handleDelete = async (asset: Asset) => {
    const confirmed = window.confirm('Delete this asset? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeletingId(asset.id);
    setActionError(null);

    try {
      await deleteAsset.mutateAsync(asset.id);
      if (editingAsset?.id === asset.id) {
        handleCancelEdit();
      }
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to delete the asset. Please try again.'));
    } finally {
      setDeletingId(null);
    }
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
    setGroupActionError(null);
    resetGroup({ name: '' });
  };

  const openGroupModal = () => {
    setGroupActionError(null);
    resetGroup({ name: '' });
    setIsGroupModalOpen(true);
  };

  const onSubmitGroup = handleSubmitGroup(async (values) => {
    setGroupActionError(null);

    try {
      const group = await createAssetGroup.mutateAsync({ name: values.name.trim() });
      setValue('groupId', group.id, { shouldValidate: true, shouldDirty: true });
      closeGroupModal();
    } catch (error) {
      setGroupActionError(
        getErrorMessage(error, 'Unable to create the group. Please try again.')
      );
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setActionError(null);

    const payload = {
      name: values.name,
      groupId: values.groupId,
      currentValue: values.currentValue
    };

    try {
      if (editingAsset) {
        await updateAsset.mutateAsync({
          id: editingAsset.id,
          payload
        });
        handleCancelEdit();
      } else {
        await createAsset.mutateAsync(payload);
        reset(createDefaultValues());
      }
    } catch (error) {
      setActionError(getErrorMessage(error, 'Unable to save the asset. Please try again.'));
    }
  });

  return (
    <div>
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Assets</h1>
          <p className="text-sm text-muted-foreground">
            Track cash accounts, investments, and other holdings in one place.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{editingAsset ? 'Edit asset' : 'Add a new asset'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Brokerage account" {...register('name')} />
                    {errors.name ? <p className="text-xs text-rose-500">{errors.name.message}</p> : null}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="groupId">Group</Label>
                    <div className="flex items-center gap-3">
                      <select
                        id="groupId"
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('groupId')}
                        disabled={assetGroupsQuery.isLoading}
                      >
                        <option value="" disabled>
                          {assetGroupsQuery.isLoading ? 'Loading groups…' : 'Select a group'}
                        </option>
                        {assetGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openGroupModal}
                        disabled={createAssetGroup.isPending || assetGroupsQuery.isLoading}
                      >
                        {createAssetGroup.isPending ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : null}
                        Add group
                      </Button>
                    </div>
                    {errors.groupId ? (
                      <p className="text-xs text-rose-500">{errors.groupId.message}</p>
                    ) : null}
                    {assetGroupsQuery.isError ? (
                      <p className="text-xs text-rose-500">
                        {getErrorMessage(
                          assetGroupsQuery.error,
                          'We could not load your groups. Please refresh to try again.'
                        )}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="currentValue">Current value</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="15000.00"
                    {...register('currentValue')}
                  />
                  {errors.currentValue ? (
                    <p className="text-xs text-rose-500">{errors.currentValue.message}</p>
                  ) : null}
                </div>

                {actionError ? <p className="text-sm text-rose-500">{actionError}</p> : null}

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingAsset ? 'Save changes' : 'Add asset'}
                  </Button>
                  {editingAsset ? (
                    <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Asset inventory</h2>
              <p className="text-xs text-muted-foreground">
                {assetsQuery.data ? `${assetsQuery.data.length} tracked` : '-'}
              </p>
            </div>

            {assetsQuery.isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : null}

            {assetsQuery.isError ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                {getErrorMessage(
                  assetsQuery.error,
                  'We could not load your assets. Please refresh to try again.'
                )}
              </div>
            ) : null}

            {!assetsQuery.isLoading && !assetsQuery.isError ? (
              assets.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="text-left text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Group</th>
                        <th className="py-2 pr-4">Current value</th>
                        <th className="py-2 pr-4">Updated</th>
                        <th className="py-2 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {assets.map((asset) => (
                        <tr key={asset.id}>
                          <td className="py-3 pr-4 font-medium">{asset.name}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {asset.group?.name ?? '-'}
                          </td>
                          <td className="py-3 pr-4 font-semibold">{formatCurrency(asset.currentValue)}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {new Date(asset.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-0 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(asset)}
                              >
                                <Edit3 className="mr-1 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={deletingId === asset.id}
                                onClick={() => handleDelete(asset)}
                              >
                                {deletingId === asset.id ? (
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
                  No assets yet. Add your first asset to start tracking total value.
                </div>
              )
            ) : null}
          </div>
        </div>
      </section>

      {isGroupModalOpen ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={createAssetGroup.isPending ? undefined : closeGroupModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Create group</h2>
                <p className="text-sm text-muted-foreground">
                  Organize assets by creating a custom group.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={createAssetGroup.isPending ? undefined : closeGroupModal}
                disabled={createAssetGroup.isPending}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form className="space-y-4" onSubmit={onSubmitGroup}>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="group-name">Group name</Label>
                <Input
                  id="group-name"
                  placeholder="Retirement"
                  autoComplete="off"
                  autoFocus
                  {...registerGroup('name')}
                  disabled={createAssetGroup.isPending}
                />
                {groupErrors.name ? (
                  <p className="text-xs text-rose-500">{groupErrors.name.message}</p>
                ) : null}
              </div>

              {groupActionError ? (
                <p className="text-sm text-rose-500">{groupActionError}</p>
              ) : null}

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={createAssetGroup.isPending ? undefined : closeGroupModal}
                  disabled={createAssetGroup.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createAssetGroup.isPending}>
                  {createAssetGroup.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
