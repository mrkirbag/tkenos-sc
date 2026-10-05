import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  getInventoryCategoryLabel,
  getMenuCategoryLabel,
  inventoryCategories,
  isValidInventoryCategory,
  isValidMenuCategory,
  menuCategories,
  productCategories,
} from '@/data/product-categories';
import { createInventoryItem, listInventoryItems } from '@/lib/db/inventory';
import { createCatalogProduct } from '@/lib/db/products';
import { createTestUser, setupTestDatabase, teardownTestDatabase } from '@/test/db';

describe('categoría paquetería para inventario', () => {
  let userId = '';

  beforeAll(async () => {
    await setupTestDatabase();
    const { getDb } = await import('@/lib/db/client');
    const db = getDb();
    userId = await createTestUser(db, 'admin-paqueteria', 'pass123', 'admin');
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('paqueteria está presente en inventoryCategories pero NO en el catálogo ni menú', () => {
    const inInventory = inventoryCategories.some((c) => c.id === 'paqueteria');
    const inMenu = menuCategories.some((c) => c.id === 'paqueteria');
    const inProduct = productCategories.some((c) => c.id === 'paqueteria');

    expect(inInventory).toBe(true);
    expect(inMenu).toBe(false);
    expect(inProduct).toBe(false);

    const paqueteriaCategory = inventoryCategories.find((c) => c.id === 'paqueteria');
    expect(paqueteriaCategory?.label).toBe('Paquetería');
  });

  it('valida correctamente categorías para inventario y catálogo', () => {
    expect(isValidInventoryCategory('paqueteria')).toBe(true);
    expect(isValidMenuCategory('paqueteria')).toBe(false);
    expect(getInventoryCategoryLabel('paqueteria')).toBe('Paquetería');
    expect(getMenuCategoryLabel('paqueteria')).toBe('paqueteria');
  });

  it('permite registrar y listar ítems de inventario bajo paquetería', async () => {
    const item = await createInventoryItem({
      name: 'Bolsa Delivery Kraft',
      category: 'paqueteria',
      unit: 'unidades',
      stock: 100,
      min_stock: 20,
      userId,
    });

    expect(item.id).toBeTruthy();
    expect(item.category).toBe('paqueteria');
    expect(item.stock).toBe(100);

    const paqueteriaItems = await listInventoryItems('paqueteria');
    expect(paqueteriaItems.some((i) => i.id === item.id)).toBe(true);
  });

  it('rechaza crear productos de catálogo con categoría paquetería', async () => {
    await expect(
      createCatalogProduct({
        name: 'Producto Invalido',
        price: 10,
        category: 'paqueteria',
        description: '',
      }),
    ).rejects.toThrow('Categoría inválida');
  });
});
