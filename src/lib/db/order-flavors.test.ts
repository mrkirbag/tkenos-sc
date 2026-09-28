import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createTestUser, setupTestDatabase, teardownTestDatabase } from '@/test/db';
import { createId } from '@/lib/utils/id';
import type { ProductFlavorGroup } from '@/lib/db/types';

describe('combos con selección de sabores e inventario', () => {
  let userId = '';
  let tableId = '';
  let insumoTeqQuesoId = '';
  let insumoTeqBocadilloId = '';
  let insumoPastCarneId = '';
  let comboProductId = '';

  beforeAll(async () => {
    await setupTestDatabase();

    const { getDb } = await import('@/lib/db/client');
    const db = getDb();

    userId = await createTestUser(db, 'admin-combos', 'pass', 'admin');

    tableId = createId();
    await db.execute({
      sql: `INSERT INTO tables (id, number, capacity, status) VALUES (?, '10', 4, 'libre')`,
      args: [tableId],
    });

    // 1. Insumos en inventario
    insumoTeqQuesoId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Insumo Tequeño Queso', 0, 'tequenos', 1, 1)`,
      args: [insumoTeqQuesoId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 100, 10, 'unidad')`,
      args: [insumoTeqQuesoId],
    });

    insumoTeqBocadilloId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Insumo Tequeño Bocadillo con Queso', 0, 'tequenos', 1, 1)`,
      args: [insumoTeqBocadilloId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 100, 10, 'unidad')`,
      args: [insumoTeqBocadilloId],
    });

    insumoPastCarneId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
            VALUES (?, 'Insumo Pastelito Carne', 0, 'pastelitos', 1, 1)`,
      args: [insumoPastCarneId],
    });
    await db.execute({
      sql: `INSERT INTO inventory (product_id, stock, min_stock, unit) VALUES (?, 50, 5, 'unidad')`,
      args: [insumoPastCarneId],
    });

    // 2. Combo product with flavor groups
    const flavorGroups: ProductFlavorGroup[] = [
      {
        id: 'fg_tequenos',
        name: 'Sabor de Tequeños',
        units: 10,
        required: true,
        options: [
          { id: 'opt_queso', name: 'Queso', inventory_product_id: insumoTeqQuesoId },
          { id: 'opt_bocadillo', name: 'Bocadillo con Queso', inventory_product_id: insumoTeqBocadilloId },
        ],
      },
      {
        id: 'fg_pastelitos',
        name: 'Sabor de Pastelitos',
        units: 10,
        required: true,
        options: [
          { id: 'opt_carne', name: 'Carne', inventory_product_id: insumoPastCarneId },
        ],
      },
    ];

    comboProductId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, requires_inventory, active, flavor_groups)
            VALUES (?, 'Combo 1 (10 Tequeños + 10 Pastelitos)', 35000, 'combos', 0, 1, ?)`,
      args: [comboProductId, JSON.stringify(flavorGroups)],
    });
  });

  afterAll(async () => {
    const { resetDbClient } = await import('@/lib/db/client');
    resetDbClient();
    teardownTestDatabase();
  });

  it('descuenta el inventario exacto según los sabores escogidos en el combo', async () => {
    const { createOrderForTable, addOrderItem } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const order = await createOrderForTable(tableId, userId);

    // Pedimos 2 combos con Bocadillo con Queso y Pastelito de Carne
    // Debería descontar:
    // - 2 * 10 = 20 de Tequeño Bocadillo
    // - 2 * 10 = 20 de Pastelito Carne
    // - 0 de Tequeño Queso
    const item = await addOrderItem(
      order.id,
      {
        productId: comboProductId,
        quantity: 2,
        flavors: [
          {
            groupId: 'fg_tequenos',
            groupName: 'Sabor de Tequeños',
            optionId: 'opt_bocadillo',
            optionName: 'Bocadillo con Queso',
            inventoryProductId: insumoTeqBocadilloId,
            units: 10,
          },
          {
            groupId: 'fg_pastelitos',
            groupName: 'Sabor de Pastelitos',
            optionId: 'opt_carne',
            optionName: 'Carne',
            inventoryProductId: insumoPastCarneId,
            units: 10,
          },
        ],
      },
      userId,
    );

    expect(item.flavors).toBeDefined();
    expect(item.flavors?.length).toBe(2);

    const stockQueso = await getInventoryItemById(insumoTeqQuesoId);
    expect(stockQueso?.stock).toBe(100); // Intacto

    const stockBocadillo = await getInventoryItemById(insumoTeqBocadilloId);
    expect(stockBocadillo?.stock).toBe(80); // 100 - 20 = 80

    const stockCarne = await getInventoryItemById(insumoPastCarneId);
    expect(stockCarne?.stock).toBe(30); // 50 - 20 = 30
  });

  it('al cancelar la orden restaura el inventario exacto de los sabores seleccionados', async () => {
    const { cancelOrder, getActiveOrderByTableId } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const activeOrder = await getActiveOrderByTableId(tableId);
    expect(activeOrder).not.toBeNull();

    await cancelOrder(activeOrder!.id, userId);

    const stockBocadillo = await getInventoryItemById(insumoTeqBocadilloId);
    expect(stockBocadillo?.stock).toBe(100); // Restaurado

    const stockCarne = await getInventoryItemById(insumoPastCarneId);
    expect(stockCarne?.stock).toBe(50); // Restaurado
  });

  it('permite crear pedidos públicos (storefront/carrito) con sabores y descuenta stock', async () => {
    const { createPublicOrderWithItems, listOrderItems } = await import('@/lib/db/orders');
    const { getInventoryItemById } = await import('@/lib/db/inventory');

    const { order, itemCount } = await createPublicOrderWithItems(userId, {
      order_type: 'delivery',
      customer_name: 'Carlos Cliente',
      customer_phone: '3001234567',
      delivery_address: 'Calle 10 # 5-20',
      items: [
        {
          productId: comboProductId,
          quantity: 1,
          flavors: [
            {
              groupId: 'fg_tequenos',
              groupName: 'Sabor de Tequeños',
              optionId: 'opt_queso',
              optionName: 'Queso',
              inventoryProductId: insumoTeqQuesoId,
              units: 10,
            },
            {
              groupId: 'fg_pastelitos',
              groupName: 'Sabor de Pastelitos',
              optionId: 'opt_carne',
              optionName: 'Carne',
              inventoryProductId: insumoPastCarneId,
              units: 10,
            },
          ],
        },
      ],
    });

    expect(itemCount).toBe(1);
    expect(order.total).toBe(35000);

    const items = await listOrderItems(order.id);
    expect(items.length).toBe(1);
    expect(items[0].flavors?.length).toBe(2);
    expect(items[0].flavors?.[0].optionName).toBe('Queso');

    // Descontó 10 de Queso y 10 de Carne
    const stockQueso = await getInventoryItemById(insumoTeqQuesoId);
    expect(stockQueso?.stock).toBe(90); // 100 - 10 = 90

    const stockCarne = await getInventoryItemById(insumoPastCarneId);
    expect(stockCarne?.stock).toBe(40); // 50 - 10 = 40
  });
});
