import 'dotenv/config';
import { createClient } from '@libsql/client';
import { createId } from './src/lib/utils/id';

async function seedCombosAndTequenos() {
  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('Missing TURSO_URL or TURSO_AUTH_TOKEN');
  }

  const db = createClient({ url, authToken });

  console.log('--- Creando insumos de inventario para Tequeños y Pastelitos ---');

  const rawInventory = [
    { name: 'Tequeño Tradicional Queso', category: 'tequenos', stock: 100, minStock: 20 },
    { name: 'Tequeño Bocadillo con Queso', category: 'tequenos', stock: 100, minStock: 20 },
    { name: 'Tequeño de Chocolate', category: 'tequenos', stock: 80, minStock: 15 },
    { name: 'Pastelito de Carne Molida', category: 'pastelitos', stock: 100, minStock: 20 },
    { name: 'Pastelito de Pollo', category: 'pastelitos', stock: 100, minStock: 20 },
    { name: 'Pastelito de Queso con Papa', category: 'pastelitos', stock: 80, minStock: 15 },
  ];

  const inventoryMap: Record<string, string> = {};

  for (const item of rawInventory) {
    const existing = await db.execute({
      sql: 'SELECT id FROM products WHERE name = ? AND requires_inventory = 1',
      args: [item.name],
    });

    let itemId: string;

    if (existing.rows.length > 0) {
      itemId = String(existing.rows[0].id);
      console.log(`Insumo existente: "${item.name}" (ID: ${itemId})`);
    } else {
      itemId = createId();
      await db.execute({
        sql: `INSERT INTO products (id, name, price, category, requires_inventory, active)
              VALUES (?, ?, 0, ?, 1, 1)`,
        args: [itemId, item.name, item.category],
      });

      await db.execute({
        sql: `INSERT INTO inventory (product_id, stock, min_stock, unit)
              VALUES (?, ?, ?, 'unidades')`,
        args: [itemId, item.stock, item.minStock],
      });

      console.log(`Insumo creado: "${item.name}" con stock de ${item.stock} unidades.`);
    }

    inventoryMap[item.name] = itemId;
  }

  console.log('\n--- Creando Combo 1 con configuración de sabores ---');

  const combo1Name = 'Combo 1 (10 Tequeños + 10 Pastelitos)';
  const existingCombo = await db.execute({
    sql: 'SELECT id FROM products WHERE name = ?',
    args: [combo1Name],
  });

  const flavorGroups = [
    {
      id: createId(),
      name: 'Sabor de Tequeños (10 unid.)',
      units: 10,
      required: true,
      options: [
        {
          id: createId(),
          name: 'Queso',
          inventory_product_id: inventoryMap['Tequeño Tradicional Queso'],
        },
        {
          id: createId(),
          name: 'Bocadillo con Queso',
          inventory_product_id: inventoryMap['Tequeño Bocadillo con Queso'],
        },
        {
          id: createId(),
          name: 'Chocolate',
          inventory_product_id: inventoryMap['Tequeño de Chocolate'],
        },
      ],
    },
    {
      id: createId(),
      name: 'Sabor de Pastelitos (10 unid.)',
      units: 10,
      required: true,
      options: [
        {
          id: createId(),
          name: 'Carne Molida',
          inventory_product_id: inventoryMap['Pastelito de Carne Molida'],
        },
        {
          id: createId(),
          name: 'Pollo',
          inventory_product_id: inventoryMap['Pastelito de Pollo'],
        },
        {
          id: createId(),
          name: 'Queso con Papa',
          inventory_product_id: inventoryMap['Pastelito de Queso con Papa'],
        },
      ],
    },
  ];

  if (existingCombo.rows.length > 0) {
    const comboId = String(existingCombo.rows[0].id);
    await db.execute({
      sql: `UPDATE products SET category = 'combos', price = 32000, description = ?, flavor_groups = ?, active = 1 WHERE id = ?`,
      args: [
        'El combo perfecto para compartir: 10 tequeños crujientes y 10 pastelitos dorados a tu gusto.',
        JSON.stringify(flavorGroups),
        comboId,
      ],
    });
    console.log(`Combo 1 actualizado exitosamente con ID: ${comboId}`);
  } else {
    const comboId = createId();
    await db.execute({
      sql: `INSERT INTO products (id, name, price, category, description, flavor_groups, requires_inventory, active)
            VALUES (?, ?, ?, 'combos', ?, ?, 0, 1)`,
      args: [
        comboId,
        combo1Name,
        32000,
        'El combo perfecto para compartir: 10 tequeños crujientes y 10 pastelitos dorados a tu gusto.',
        JSON.stringify(flavorGroups),
      ],
    });
    console.log(`Combo 1 creado exitosamente con ID: ${comboId}`);
  }

  console.log('\n✓ Proceso completado exitosamente.');
}

seedCombosAndTequenos().catch(console.error);
