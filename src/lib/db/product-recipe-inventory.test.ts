import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestUser, setupTestDatabase, teardownTestDatabase } from '@/test/db';
import { createId } from '@/lib/utils/id';
import type { ProductFlavorGroup, ProductInventoryItem } from '@/lib/db/types';

describe('productos con receta de múltiples insumos e inventario', () => {
  let userId = '';
  let tableId = '';
  let insumoCajaId = '';
  let insumoBolsaId = '';
  let insumoSalsaId = '';
  let insumoTeqQuesoId = '';
  let insumoTeqBocadilloId = '';
  let comboProductId = '';

  beforeAll(async () => {
    await setupTestDatabase();

    const { getDb } = await import('@/lib/db/client');
    const db = getDb();

    userId = await createTestUser(db, 'admin-recipe', 'pass', 'admin');

    tableId = createId();
    await db.execute({
      sql: `INSERT INTO tables (id, number, capacity, status) VALUES (?, '12', 4, 'libre')`,
      args: [tableId],
    });

    // 1. Insumos fijos en inventario (Caja, Bolsa, Salsa)
    insumoCajaId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Caja Combo', 0, 'empaques', 1, 1)`,
      args: [insumoCajaId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 50, 5, 'unidad')`,
      args: [insumoCajaId],
    });

    insumoBolsaId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Bolsa Delivery', 0, 'empaques', 1, 1)`,
      args: [insumoBolsaId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 100, 10, 'unidad')`,
      args: [insumoBolsaId],
    });

    insumoSalsaId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Salsa de Ajo', 0, 'salsas', 1, 1)`,
      args: [insumoSalsaId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 30, 5, 'unidad')`,
      args: [insumoSalsaId],
    });

    // 2. Insumos de sabores (Tequeños)
    insumoTeqQuesoId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Tequeño Queso Crudo', 0, 'tequenos', 1, 1)`,
      args: [insumoTeqQuesoId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 200, 20, 'unidad')`,
      args: [insumoTeqQuesoId],
    });

    insumoTeqBocadilloId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Tequeño Bocadillo Crudo', 0, 'tequenos', 1, 1)`,
      args: [insumoTeqBocadilloId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 100, 10, 'unidad')`,
      args: [insumoTeqBocadilloId],
    });

    // 3. Crear Producto Menú (Combo 1) con múltiples insumos a descontar (receta) y sabores opcionales
    const { createCatalogProduct } = await import('@/lib/db/products');

    const recipeItems: ProductInventoryItem[] = [
      { inventory_product_id: insumoCajaId, units: 1 },
      { inventory_product_id: insumoBolsaId, units: 1 },
      { inventory_product_id: insumoSalsaId, units: 1 },
    ];

    const flavorGroups: ProductFlavorGroup[] = [
      {
        id: 'fg_sabores_combo',
        name: 'Sabor de Tequeños',
        units: 10,
        required: false, // Opcional
        options: [
          { id: 'opt_q', name: 'Queso', inventory_product_id: insumoTeqQuesoId },
          { id: 'opt_b', name: 'Bocadillo', inventory_product_id: insumoTeqBocadilloId },
        ],
      },
    ];

    const created = await createCatalogProduct({
      name: 'Combo 1 Familiar (Caja + Bolsa + Salsa + Tequeños)',
      price: 45000,
      category: 'combos',
      inventory_items: recipeItems,
      flavor_groups: flavorGroups,
    });

    comboProductId = created.id;
  }, 30000);

  afterAll(async () => {
    const { resetDbClient } = await import('@/lib/db/client');
    resetDbClient();
    teardownTestDatabase();
  });

  it('calcula el stock del producto según el insumo cuello de botella en su receta', async () => {
    const { getCatalogProductById } = await import('@/lib/db/products');
    const product = await getCatalogProductById(comboProductId);
    expect(product).not.toBeNull();
    expect(product?.inventory_items?.length).toBe(3);
    // Caja=50, Bolsa=100, Salsa=30 -> Cuello de botella es Salsa (30)
    expect(product?.stock).toBe(30);
    expect(product?.has_inventory).toBe(true);
  });

  it('descuenta todos los insumos fijos de la receta más los sabores escogidos', async () => {
    const { createOrderForTable, addOrderItem } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const order = await createOrderForTable(tableId, userId);

    // Pedimos 2 combos con sabor Bocadillo
    // Debe descontar:
    // - 2 Cajas
    // - 2 Bolsas
    // - 2 Salsas
    // - 2 * 10 = 20 Tequeños Bocadillo
    // - 0 Tequeños Queso
    await addOrderItem(
      order.id,
      {
        productId: comboProductId,
        quantity: 2,
        flavors: [
          {
            groupId: 'fg_sabores_combo',
            groupName: 'Sabor de Tequeños',
            optionId: 'opt_b',
            optionName: 'Bocadillo',
            inventoryProductId: insumoTeqBocadilloId,
            units: 10,
          },
        ],
      },
      userId,
    );

    const stockCaja = await getInventoryItemById(insumoCajaId);
    expect(stockCaja?.stock).toBe(48); // 50 - 2 = 48

    const stockBolsa = await getInventoryItemById(insumoBolsaId);
    expect(stockBolsa?.stock).toBe(98); // 100 - 2 = 98

    const stockSalsa = await getInventoryItemById(insumoSalsaId);
    expect(stockSalsa?.stock).toBe(28); // 30 - 2 = 28

    const stockBocadillo = await getInventoryItemById(insumoTeqBocadilloId);
    expect(stockBocadillo?.stock).toBe(80); // 100 - 20 = 80

    const stockQueso = await getInventoryItemById(insumoTeqQuesoId);
    expect(stockQueso?.stock).toBe(200); // Intacto
  });

  it('al cancelar la orden restaura todos los insumos de la receta y los sabores', async () => {
    const { cancelOrder, getActiveOrderByTableId } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const activeOrder = await getActiveOrderByTableId(tableId);
    expect(activeOrder).not.toBeNull();

    await cancelOrder(activeOrder!.id, userId);

    // Se canceló la orden del combo con sabor Bocadillo
    const stockCaja = await getInventoryItemById(insumoCajaId);
    expect(stockCaja?.stock).toBe(50); // Restaurado a 50

    const stockBolsa = await getInventoryItemById(insumoBolsaId);
    expect(stockBolsa?.stock).toBe(100); // Restaurado a 100

    const stockSalsa = await getInventoryItemById(insumoSalsaId);
    expect(stockSalsa?.stock).toBe(30); // Restaurado a 30

    const stockBocadillo = await getInventoryItemById(insumoTeqBocadilloId);
    expect(stockBocadillo?.stock).toBe(100); // Restaurado a 100
  });

  it('permite pedir sin sabores (selección opcional) y descuenta correctamente los insumos fijos', async () => {
    const { createOrderForTable, addOrderItem } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const order = await createOrderForTable(tableId, userId);

    // Pedimos 1 combo SIN sabores seleccionados
    // Debe descontar:
    // - 1 Caja
    // - 1 Bolsa
    // - 1 Salsa
    // - 0 sabores
    await addOrderItem(
      order.id,
      {
        productId: comboProductId,
        quantity: 1,
      },
      userId,
    );

    const stockCaja = await getInventoryItemById(insumoCajaId);
    expect(stockCaja?.stock).toBe(49); // 50 - 1 = 49

    const stockBolsa = await getInventoryItemById(insumoBolsaId);
    expect(stockBolsa?.stock).toBe(99); // 100 - 1 = 99

    const stockSalsa = await getInventoryItemById(insumoSalsaId);
    expect(stockSalsa?.stock).toBe(29); // 30 - 1 = 29
  });

  it('permite pedir combo en modo Mitad y Mitad descontando las unidades exactas de ambos sabores', async () => {
    const { cancelOrder, addOrderItem, getActiveOrderByTableId } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const activeOrder = await getActiveOrderByTableId(tableId);
    expect(activeOrder).not.toBeNull();

    // Cancelamos la orden anterior para reiniciar stock base
    await cancelOrder(activeOrder!.id, userId);

    const { createOrderForTable } = await import('@/lib/db/orders');
    const order = await createOrderForTable(tableId, userId);

    // Pedimos 1 combo con Mitad y Mitad (5 Queso + 5 Bocadillo = 10 piezas en total)
    await addOrderItem(
      order.id,
      {
        productId: comboProductId,
        quantity: 1,
        flavors: [
          {
            groupId: 'fg_sabores_combo',
            groupName: 'Sabor de Tequeños (Mitad 1)',
            optionId: 'opt_q',
            optionName: 'Queso (5 uds)',
            inventoryProductId: insumoTeqQuesoId,
            units: 5,
          },
          {
            groupId: 'fg_sabores_combo',
            groupName: 'Sabor de Tequeños (Mitad 2)',
            optionId: 'opt_b',
            optionName: 'Bocadillo (5 uds)',
            inventoryProductId: insumoTeqBocadilloId,
            units: 5,
          },
        ],
      },
      userId,
    );

    // Stock base: Queso=200, Bocadillo=100
    // Tras 1 combo Mitad y Mitad:
    // Queso: 200 - 5 = 195
    // Bocadillo: 100 - 5 = 95
    const stockQueso = await getInventoryItemById(insumoTeqQuesoId);
    expect(stockQueso?.stock).toBe(195);

    const stockBocadillo = await getInventoryItemById(insumoTeqBocadilloId);
    expect(stockBocadillo?.stock).toBe(95);

    // Al cancelar, ambas mitades deben regresar a su stock original
    await cancelOrder(order.id, userId);
    const restoredQueso = await getInventoryItemById(insumoTeqQuesoId);
    expect(restoredQueso?.stock).toBe(200);

    const restoredBocadillo = await getInventoryItemById(insumoTeqBocadilloId);
    expect(restoredBocadillo?.stock).toBe(100);
  });
});
