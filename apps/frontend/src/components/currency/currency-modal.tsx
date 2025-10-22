'use client';

import { Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { CurrencyCode } from '@zoltraak/types';
import { currencyOptions, type CurrencyOption } from './currency-options';

type CurrencyModalProps = {
  isOpen: boolean;
  initialCurrency?: CurrencyCode | null;
  onSubmit: (currency: CurrencyCode) => void;
  onClose?: () => void;
  isSubmitting?: boolean;
  allowDismiss?: boolean;
  title?: string;
  description?: string;
  warning?: string | null;
  error?: string | null;
};

export function CurrencyModal({
  isOpen,
  initialCurrency,
  onSubmit,
  onClose,
  isSubmitting = false,
  allowDismiss = true,
  title = 'Choose your currency',
  description = 'Select the base currency we should use when formatting your balances and transactions.',
  warning,
  error
}: CurrencyModalProps) {
  const [selected, setSelected] = useState<CurrencyCode | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(initialCurrency ?? null);
    }
  }, [initialCurrency, isOpen]);

  const selectedOption = useMemo(
    () => currencyOptions.find((option) => option.code === selected),
    [selected]
  );

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (allowDismiss && !isSubmitting) {
      onClose?.();
    }
  };

  const handleConfirm = () => {
    if (selected && !isSubmitting) {
      onSubmit(selected);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            {warning ? <p className="text-xs font-medium text-rose-500">{warning}</p> : null}
            {error ? <p className="text-xs font-medium text-rose-500">{error}</p> : null}
          </div>
          {allowDismiss ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currencyOptions.map((option) => {
            const isSelected = option.code === selected;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setSelected(option.code)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/80 hover:bg-muted/60'
                }`}
                disabled={isSubmitting}
              >
                <span className="text-2xl leading-none">{option.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {option.code} • {option.symbol}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {selectedOption
              ? `Selected: ${selectedOption.label} (${selectedOption.symbol})`
              : 'Select a currency to continue.'}
          </div>
          <div className="flex items-center gap-3">
            {allowDismiss ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={!selected || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save currency'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
