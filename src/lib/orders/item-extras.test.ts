import { describe, expect, it } from 'vitest';

import {
  formatExtraLine,
  parseOrderItemExtras,
  productUsesAdicionales,
  sumExtrasPrice,
} from '@/lib/orders/item-extras';
import {
  buildItemNotes,
  categoryUsesModifiers,
  getApplicableModifierGroups,
  getItemPreferenceLabel,
  toggleMultipleModifierOption,
} from '@/lib/orders/item-preferences';

describe('item extras', () => {
  it('parsea adicionales guardados en JSON', () => {
    const extras = parseOrderItemExtras(
      JSON.stringify([{ product_id: '1', name: 'Adicional de salchicha', price: 3000 }]),
    );

    expect(extras).toEqual([{ product_id: '1', name: 'Adicional de salchicha', price: 3000 }]);
    expect(sumExtrasPrice(extras)).toBe(3000);
    expect(formatExtraLine(extras[0])).toBe('+ Adicional de salchicha');
  });

  it('no admite adicionales en bebidas ni en la categoría adicionales', () => {
    expect(productUsesAdicionales('clasicas')).toBe(true);
    expect(productUsesAdicionales('bebidas')).toBe(false);
    expect(productUsesAdicionales('adicionales')).toBe(false);
  });
});

describe('item preferences', () => {
  it('no aplica corte ni preferencias a ninguna categoría cuando están desactivados', () => {
    expect(getApplicableModifierGroups('bebidas')).toEqual([]);
    expect(getApplicableModifierGroups('adicionales')).toEqual([]);
    expect(getApplicableModifierGroups('hamburguesas')).toEqual([]);
    expect(categoryUsesModifiers('hamburguesas')).toBe(false);
  });

  it('los grupos de corte y preferencias vienen desactivados para esta tienda', () => {
    expect(getApplicableModifierGroups('hamburguesas').some((group) => group.id === 'cut')).toBe(
      false,
    );
    expect(
      getApplicableModifierGroups('hamburguesas').some((group) => group.id === 'preferences'),
    ).toBe(false);
  });

  it('no genera notas si no hay grupos de modificadores activos', () => {
    expect(buildItemNotes('hamburguesas', { preferences: ['Al gusto'] })).toBeUndefined();
    expect(
      buildItemNotes('hamburguesas', { preferences: ['Sin cebolla', 'Sin salsa'] }),
    ).toBeUndefined();
    expect(buildItemNotes('bebidas', { preferences: ['Sin cebolla'] })).toBeUndefined();
  });

  it('en tickets no muestra notas si la categoría no usa modificadores', () => {
    expect(getItemPreferenceLabel({ notes: null, product_category: 'hamburguesas' })).toBeNull();
    expect(
      getItemPreferenceLabel({ notes: 'Sin cebolla', product_category: 'hamburguesas' }),
    ).toBeNull();
    expect(
      getItemPreferenceLabel({ notes: 'Picadas, Sin pan', product_category: 'bebidas' }),
    ).toBeNull();
    expect(getItemPreferenceLabel({ notes: 'Nota especial' })).toBe('Nota especial');
  });

  it('en múltiple, la opción por defecto limpia el resto', () => {
    expect(toggleMultipleModifierOption(['Al gusto'], 'Sin cebolla', 'Al gusto')).toEqual([
      'Sin cebolla',
    ]);
    expect(
      toggleMultipleModifierOption(['Sin cebolla', 'Sin salsa'], 'Al gusto', 'Al gusto'),
    ).toEqual(['Al gusto']);
    expect(toggleMultipleModifierOption(['Sin cebolla'], 'Sin cebolla', 'Al gusto')).toEqual([
      'Al gusto',
    ]);
  });
});
