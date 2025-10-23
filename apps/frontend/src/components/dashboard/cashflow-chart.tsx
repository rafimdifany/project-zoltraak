'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DashboardTransaction } from '@zoltraak/types';
import { useCurrencyFormatter } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';

type CashflowChartProps = {
  transactions: DashboardTransaction[];
};

type ChartPoint = {
  label: string;
  dateLabel: string;
  income: number;
  expense: number;
};

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 }
] as const;

type TooltipState = {
  index: number;
  income: number;
  expense: number;
  dateLabel: string;
  x: number;
  y: number;
};

export function CashflowChart({ transactions }: CashflowChartProps) {
  const [rangeDays, setRangeDays] = useState<(typeof RANGE_OPTIONS)[number]['value']>(7);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    isDragging: boolean;
    startX: number;
    scrollLeft: number;
    pointerId: number | null;
  }>({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: null
  });

  const { format: formatCurrency } = useCurrencyFormatter();

  const points = useMemo<ChartPoint[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const basePoints = Array.from({ length: rangeDays }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (rangeDays - 1 - index));
      const key = date.toISOString();
      return {
        key,
        label: rangeDays > 14 ? dateFormatter.format(date) : dayFormatter.format(date),
        dateLabel: dateFormatter.format(date),
        income: 0,
        expense: 0
      };
    });

    const byKey = Object.fromEntries(basePoints.map((point) => [point.key.slice(0, 10), point]));

    transactions.forEach((transaction) => {
      const occurred = new Date(transaction.occurredAt);
      occurred.setHours(0, 0, 0, 0);
      const key = occurred.toISOString().slice(0, 10);
      const matched = byKey[key];
      if (!matched) {
        return;
      }
      if (transaction.type === 'INCOME') {
        matched.income += transaction.amount;
      } else {
        matched.expense += transaction.amount;
      }
    });

    return basePoints.map((point) => ({
      label: point.label,
      dateLabel: point.dateLabel,
      income: point.income,
      expense: point.expense
    }));
  }, [transactions, rangeDays]);

  const totalIncome = useMemo(
    () => points.reduce((sum, point) => sum + point.income, 0),
    [points]
  );
  const totalExpense = useMemo(
    () => points.reduce((sum, point) => sum + point.expense, 0),
    [points]
  );
  const net = totalIncome - totalExpense;

  const maxValue = Math.max(
    1,
    ...points.map((point) => Math.max(point.income, point.expense))
  );

  const chartWidth = rangeDays <= 14 ? '100%' : `${rangeDays * 56}px`;

  const showTooltip = useCallback(
    (index: number, point: ChartPoint, target: HTMLElement) => {
      if (dragStateRef.current.isDragging) {
        return;
      }
      const rect = target.getBoundingClientRect();
      setHoveredIndex(index);
      setTooltip({
        index,
        income: point.income,
        expense: point.expense,
        dateLabel: point.dateLabel,
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY
      });
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse' && event.buttons !== 1) {
        return;
      }
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }
      if (container.scrollWidth <= container.clientWidth) {
        return;
      }
      dragStateRef.current = {
        isDragging: true,
        startX: event.clientX,
        scrollLeft: container.scrollLeft,
        pointerId: event.pointerId
      };
      container.setPointerCapture(event.pointerId);
      setIsDragging(true);
      hideTooltip();
    },
    [hideTooltip]
  );

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || !dragStateRef.current.isDragging) {
      return;
    }
    event.preventDefault();
    const deltaX = event.clientX - dragStateRef.current.startX;
    container.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
  }, []);

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const container = scrollContainerRef.current;
      if (!container || !dragStateRef.current.isDragging) {
        return;
      }

      if (dragStateRef.current.pointerId !== null) {
        try {
          container.releasePointerCapture(dragStateRef.current.pointerId);
        } catch {
          // ignore if pointer already released
        }
      }

      dragStateRef.current = {
        isDragging: false,
        startX: 0,
        scrollLeft: 0,
        pointerId: null
      };
      setIsDragging(false);
    },
    []
  );

  return (
    <div className="min-w-0 w-full rounded-3xl border border-border bg-card p-6 dark:border-white/5 dark:bg-[#141924] sm:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300/70">Cashflow</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground dark:text-slate-100">
            Last {rangeDays} day performance
          </h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Monitor the balance between earnings and outflows. Spot emerging trends instantly.
          </p>
        </div>
        <div className="flex items-center gap-6 rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground dark:border-white/5 dark:bg-[#161d29] dark:text-slate-200">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground dark:text-slate-400">Income</p>
            <p className="text-base font-semibold text-emerald-300">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground dark:text-slate-400">Expenses</p>
            <p className="text-base font-semibold text-rose-300">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground dark:text-slate-400">Net</p>
            <p
              className={cn(
                'text-base font-semibold',
                net >= 0 ? 'text-emerald-300' : 'text-rose-300'
              )}
            >
              {formatCurrency(net)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="hidden h-px flex-1 bg-muted-foreground/30 dark:bg-white/10 md:block" />
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted px-1 py-1 text-xs text-muted-foreground dark:border-white/10 dark:bg-[#1a202c] dark:text-slate-300">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRangeDays(option.value)}
              className={`rounded-full px-3 py-1 font-medium transition ${
                option.value === rangeDays
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_20px_45px_-25px_rgba(37,99,235,0.7)]'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className={cn(
          'mt-6 w-full overflow-x-auto',
          rangeDays > 14 ? (isDragging ? 'cursor-grabbing select-none' : 'cursor-grab') : undefined
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns:
              rangeDays <= 14
                ? `repeat(${rangeDays}, minmax(0, 1fr))`
                : `repeat(${rangeDays}, minmax(56px, 1fr))`,
            minWidth: '100%',
            width: chartWidth
          }}
        >
          {points.map((point, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <button
                key={point.dateLabel}
                type="button"
                className={cn(
                  'relative flex flex-col items-center gap-3 rounded-lg outline-none transition',
                  'focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
                )}
                onMouseEnter={(event) => showTooltip(index, point, event.currentTarget)}
                onMouseMove={(event) => showTooltip(index, point, event.currentTarget)}
                onMouseLeave={hideTooltip}
                onFocus={(event) => showTooltip(index, point, event.currentTarget)}
                onBlur={hideTooltip}
              >
                <div
                  className={cn(
                    'flex h-40 w-full items-end gap-3 rounded-xl border border-border px-3 py-4 transition dark:border-white/5',
                    isHovered
                      ? 'border-foreground/30 bg-muted/80 dark:border-white/10 dark:bg-[#1c2231]'
                      : 'bg-muted dark:bg-[#1a1f2c]'
                  )}
                >
                  <div className="flex h-full flex-1 items-end overflow-hidden rounded-lg bg-emerald-500/10">
                    <div
                      className="w-full rounded-lg bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-300"
                      style={{ height: `${(point.income / maxValue) * 100}%` }}
                      aria-label={`Income ${formatCurrency(point.income)}`}
                    />
                  </div>
                  <div className="flex h-full flex-1 items-end overflow-hidden rounded-lg bg-rose-500/10">
                    <div
                      className="w-full rounded-lg bg-gradient-to-b from-rose-400 to-rose-600 transition-all duration-300"
                      style={{ height: `${(point.expense / maxValue) * 100}%` }}
                      aria-label={`Expense ${formatCurrency(point.expense)}`}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase text-slate-300">{point.label}</p>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400/80">{point.dateLabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {tooltip && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[9999] w-56 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-[#161c28] dark:text-slate-200"
              style={{
                left: tooltip.x,
                top: tooltip.y - 12
              }}
            >
              <p className="text-[11px] font-semibold uppercase text-muted-foreground dark:text-slate-400">{tooltip.dateLabel}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Income
                  </span>
                  <span className="font-medium text-foreground dark:text-slate-100">{formatCurrency(tooltip.income)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-rose-300">
                    <span className="h-2 w-2 rounded-full bg-rose-300" />
                    Expense
                  </span>
                  <span className="font-medium text-foreground dark:text-slate-100">{formatCurrency(tooltip.expense)}</span>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
          Income
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_0_4px_rgba(244,63,94,0.18)]" />
          Expenses
        </div>
        <p className="ml-auto text-slate-500">
          Values update automatically as new transactions sync.
        </p>
      </div>
    </div>
  );
}
