import type { ProductInventoryItem } from '@/lib/db/types';

export type MenuInventoryLink = {
  requires_inventory: boolean;
  inventory_product_id: string | null;
  inventory_units_per_sale: number;
  inventory_items?: ProductInventoryItem[] | null;
};

export type InventoryDeduction = {
  productId: string;
  quantity: number;
};

/** Resuelve qué ítems de inventario descontar al vender un producto del menú (soporta múltiples insumos / receta). */
export function resolveMenuInventoryDeductions(
  menuProductId: string,
  link: MenuInventoryLink,
  orderItemQuantity: number,
): InventoryDeduction[] {
  if (link.inventory_items && link.inventory_items.length > 0) {
    const list: InventoryDeduction[] = [];
    for (const item of link.inventory_items) {
      if (item.inventory_product_id) {
        const units = Math.max(1, item.units || 1);
        list.push({
          productId: item.inventory_product_id,
          quantity: orderItemQuantity * units,
        });
      }
    }
    if (list.length > 0) return list;
  }

  if (link.inventory_product_id) {
    const unitsPerSale = Math.max(1, link.inventory_units_per_sale || 1);
    return [
      {
        productId: link.inventory_product_id,
        quantity: orderItemQuantity * unitsPerSale,
      },
    ];
  }

  if (link.requires_inventory) {
    return [
      {
        productId: menuProductId,
        quantity: orderItemQuantity,
      },
    ];
  }

  return [];
}

/** Resuelve qué ítem de inventario descontar al vender un producto del menú (legacy). */
export function resolveInventoryDeduction(
  menuProductId: string,
  link: MenuInventoryLink,
  orderItemQuantity: number,
): InventoryDeduction | null {
  const deductions = resolveMenuInventoryDeductions(menuProductId, link, orderItemQuantity);
  return deductions[0] ?? null;
}

