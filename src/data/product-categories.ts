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
  { id: 'tkelunch', label: 'Tke Lunch' },
  { id: 'pastelitos', label: 'Pastelitos' },
  { id: 'tkelunchcombinados', label: 'Tke Lunch Combinados' },
  { id: 'supertke', label: 'Super Tke' },
  { id: 'combosmixtos', label: 'Combos Mixtos' },
  { id: 'tkenospasapaleros', label: 'T-keños Pasapaleros' },
  { id: 'pastelitospasapaleros', label: 'Pastelitos Pasapaleros' },
  { id: 'pasapalosmixtos', label: 'Pasapalos Mixtos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'toppings', label: 'Toppings' },
];

/** Categorías del menú para comandas y catálogo. */
export const menuCategories: MenuCategory[] = productCategories;

/** Categorías de insumos controlados en inventario. */
export const inventoryCategories: InventoryCategory[] = [
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
  { id: 'paqueteria', label: 'Paquetería' },
];

export const inventoryUnits: InventoryUnit[] = [
  { id: 'unidades', label: 'Unidades' }
];

const LEGACY_MENU_CATEGORY_LABELS: Record<string, string> = {
  combos: 'Combos',
  tequenos: 'Tequeños',
  congelados: 'Congelados',
  toppings: 'Toppings',
  salsas: 'Salsas',
  adicionales: 'Adicionales',
};

const LEGACY_INVENTORY_CATEGORY_LABELS: Record<string, string> = {
  combos: 'Combos',
  tequenos: 'Tequeños',
  congelados: 'Congelados',
  panaderia: 'Panadería',
  insumos: 'Insumos',
  empaques: 'Empaques',
  adicionales: 'Adicionales',
  salsas: 'Salsas',
  toppings: 'Toppings',
  paqueteria: 'Paquetería',
};

export function getMenuCategoryLabel(id: string): string {
  return (
    menuCategories.find((c) => c.id === id)?.label ??
    LEGACY_MENU_CATEGORY_LABELS[id] ??
    id
  );
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
