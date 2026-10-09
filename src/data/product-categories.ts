export type ProductCategory = {
  id: string;
  label: string;
};

export type MenuCategory = ProductCategory;
export type InventoryCategory = ProductCategory;

export type InventoryUnit = {
  id: string;
  label: string;
};

/** Categorías unificadas de productos (catálogo, menú e inventario). */
export const productCategories: ProductCategory[] = [
  { id: 'combos', label: 'Combos' },
  { id: 'tequenos', label: 'Tequeños' },
  { id: 'pastelitos', label: 'Pastelitos' },
  { id: 'tkelunch', label: 'Tke Lunch' },
  { id: 'supertke', label: 'Super Tke' },
  { id: 'tkenospasapaleros', label: 'Tkeños Pasapaleros' },
  { id: 'pastelitospasapaleros', label: 'Pastelitos Pasapaleros' },
  { id: 'pasapalosmixtos', label: 'Pasapalos Mixtos' },
  { id: 'congelados', label: 'Congelados' },
  { id: 'toppings', label: 'Toppings' },
  { id: 'bebidas', label: 'Bebidas' },
];

/** Categorías del menú para comandas y catálogo. */
export const menuCategories: MenuCategory[] = productCategories;

/** Categorías de insumos controlados en inventario (catálogo más categorías exclusivas de inventario). */
export const inventoryCategories: InventoryCategory[] = [
  ...productCategories,
  { id: 'paqueteria', label: 'Paquetería' },
];

export const inventoryUnits: InventoryUnit[] = [
  { id: 'unidades', label: 'Unidades' }
];

const LEGACY_INVENTORY_CATEGORY_LABELS: Record<string, string> = {
  panaderia: 'Panadería',
  insumos: 'Insumos',
  empaques: 'Empaques',
  adicionales: 'Adicionales',
  salsas: 'Salsas',
  toppings: 'Toppings',
  paqueteria: 'Paquetería',
};

export function getMenuCategoryLabel(id: string): string {
  if (id === 'toppings') return 'Toppings';
  if (id === 'salsas') return 'Salsas';
  if (id === 'adicionales') return 'Adicionales';
  return menuCategories.find((c) => c.id === id)?.label ?? id;
}

export function getInventoryCategoryLabel(id: string): string {
  return (
    inventoryCategories.find((c) => c.id === id)?.label ??
    LEGACY_INVENTORY_CATEGORY_LABELS[id] ??
    id
  );
}

export function getInventoryUnitLabel(id: string): string {
  return inventoryUnits.find((u) => u.id === id)?.label ?? id;
}

export function isValidMenuCategory(id: string): boolean {
  return (
    menuCategories.some((c) => c.id === id) ||
    id === 'adicionales' ||
    id === 'toppings' ||
    id === 'salsas'
  );
}

export function isValidInventoryCategory(id: string): boolean {
  return (
    inventoryCategories.some((c) => c.id === id) ||
    id in LEGACY_INVENTORY_CATEGORY_LABELS
  );
}

export function isValidInventoryUnit(id: string): boolean {
  return inventoryUnits.some((u) => u.id === id);
}
