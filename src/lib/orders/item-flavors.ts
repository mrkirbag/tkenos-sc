import type { OrderItemFlavor, ProductFlavorGroup } from '@/lib/db/types';

export function isValidOrderItemFlavor(value: unknown): value is OrderItemFlavor {
  if (!value || typeof value !== 'object') return false;

  const f = value as Record<string, unknown>;
  return (
    typeof f.groupId === 'string' &&
    typeof f.groupName === 'string' &&
    typeof f.optionId === 'string' &&
    typeof f.optionName === 'string' &&
    typeof f.units === 'number' &&
    Number.isFinite(f.units)
  );
}

export function parseOrderItemFlavors(value: unknown): OrderItemFlavor[] {
  if (!value) return [];

  let parsed: unknown = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isValidOrderItemFlavor);
}

export function formatFlavorLine(flavor: OrderItemFlavor): string {
  return `${flavor.groupName}: ${flavor.optionName}`;
}

export function formatFlavorsSummary(flavors: OrderItemFlavor[]): string {
  if (!flavors || flavors.length === 0) return '';
  return flavors.map((f) => `${f.groupName}: ${f.optionName}`).join(' | ');
}
