import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, Search, Trash2, X, Image as ImageIcon, Upload, XCircle, Layers } from 'lucide-react';

import { brand } from '@/data/brand';
import {
  getInventoryCategoryLabel,
  getInventoryUnitLabel,
  getMenuCategoryLabel,
  inventoryCategories,
  menuCategories,
} from '@/data/product-categories';
import { useToast } from '@/components/providers/ToastProvider';
import { Alert, EmptyState, SkeletonTable } from '@/components/ui/Feedback';
import Modal from '@/components/ui/Modal';
import { parseError } from '@/lib/api/parseError';
import type { CatalogProduct } from '@/lib/db/products';
import type { ProductFlavorGroup, ProductFlavorOption } from '@/lib/db/types';
import { useInventory } from '@/lib/hooks/queries/useInventory';
import { useProducts } from '@/lib/hooks/queries/useProducts';
import { queryKeys } from '@/lib/query/keys';
import { withAppProviders } from '@/lib/providers/withAppProviders';
import { getProxiedImageUrl } from '@/lib/utils/images';

import './ProductsManager.css';

type FormMode = 'create' | 'edit';
type CategoryFilter = string | 'all';

export type FormInventoryItem = {
  id: string;
  inventory_product_id: string;
  units: string;
};

type ProductFormState = {
  name: string;
  price: string;
  category: string;
  image_url: string;
  description: string;
  active: boolean;
  inventory_items: FormInventoryItem[];
  flavor_groups: ProductFlavorGroup[];
};

const emptyForm: ProductFormState = {
  name: '',
  price: '',
  category: menuCategories[0]?.id ?? 'entradas',
  image_url: '',
  description: '',
  active: true,
  inventory_items: [],
  flavor_groups: [],
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat(brand.currency.locale, {
    style: 'currency',
    currency: brand.currency.code,
    minimumFractionDigits: brand.currency.code === 'COP' ? 0 : 2,
    maximumFractionDigits: brand.currency.code === 'COP' ? 0 : 2,
  }).format(value);
}

function ProductsManager() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { products, isLoading, error: loadError } = useProducts();
  const { items: inventoryItems } = useInventory();
  const [formError, setFormError] = useState('');
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');


  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
      if (!query) return true;
      const categoryLabel = getMenuCategoryLabel(product.category).toLowerCase();
      const priceLabel = formatPrice(product.price).toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        categoryLabel.includes(query) ||
        priceLabel.includes(query)
      );
    });
  }, [products, categoryFilter, searchQuery]);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      mode: FormMode;
      productId?: string;
      body: Record<string, unknown>;
    }) => {
      const url = payload.mode === 'edit' && payload.productId ? `/api/products/${payload.productId}` : '/api/products';
      const method = payload.mode === 'edit' ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.body),
      });
      if (!response.ok) throw new Error(await parseError(response));
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products });
      void queryClient.invalidateQueries({ queryKey: queryKeys.menuProducts });
      toast.success(variables.mode === 'create' ? 'Producto creado' : 'Producto actualizado');
      closeForm();
    },
    onError: (err) => setFormError(err instanceof Error ? err.message : 'No se pudo guardar el producto'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await parseError(response));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products });
      void queryClient.invalidateQueries({ queryKey: queryKeys.menuProducts });
      setConfirmDeleteId(null);
      toast.success('Producto eliminado');
    },
    onError: (err) => setFormError(err instanceof Error ? err.message : 'No se pudo eliminar el producto'),
  });

  function clearFilters() {
    setCategoryFilter('all');
    setSearchQuery('');
  }

  function openCreateForm() {
    setFormMode('create');
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError('');
  }

  function openEditForm(product: CatalogProduct) {
    setFormMode('edit');
    setEditingProduct(product);
    let initialInventoryItems: FormInventoryItem[] = [];
    if (product.inventory_items && product.inventory_items.length > 0) {
      initialInventoryItems = product.inventory_items.map((it, idx) => ({
        id: `inv_item_${idx}_${Date.now()}`,
        inventory_product_id: it.inventory_product_id,
        units: String(it.units),
      }));
    } else if (product.inventory_product_id) {
      initialInventoryItems = [
        {
          id: `inv_item_0_${Date.now()}`,
          inventory_product_id: product.inventory_product_id,
          units: String(product.inventory_units_per_sale ?? 1),
        },
      ];
    }

    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      image_url: product.image_url ?? '',
      description: product.description ?? '',
      active: product.active,
      inventory_items: initialInventoryItems,
      flavor_groups: product.flavor_groups ?? [],
    });
    setFormError('');
  }

  function handleAddInventoryItem() {
    setForm((prev) => ({
      ...prev,
      inventory_items: [
        ...prev.inventory_items,
        {
          id: `inv_item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          inventory_product_id: '',
          units: '1',
        },
      ],
    }));
  }

  function handleRemoveInventoryItem(id: string) {
    setForm((prev) => ({
      ...prev,
      inventory_items: prev.inventory_items.filter((item) => item.id !== id),
    }));
  }

  function handleUpdateInventoryItem(id: string, updates: Partial<FormInventoryItem>) {
    setForm((prev) => ({
      ...prev,
      inventory_items: prev.inventory_items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }));
  }

  function handleAddFlavorGroup() {
    const newGroup: ProductFlavorGroup = {
      id: `fg_${Date.now()}`,
      name: 'Sabor de Tequeños',
      units: 24,
      required: true,
      allow_half_and_half: true,
      options: [
        { id: `opt_${Date.now()}_1`, name: 'Queso Tradicional', inventory_product_id: null },
        { id: `opt_${Date.now()}_2`, name: 'Jamón y Queso', inventory_product_id: null },
      ],
    };
    setForm((prev) => ({
      ...prev,
      flavor_groups: [...prev.flavor_groups, newGroup],
    }));
  }

  function handleRemoveFlavorGroup(groupId: string) {
    setForm((prev) => ({
      ...prev,
      flavor_groups: prev.flavor_groups.filter((g) => g.id !== groupId),
    }));
  }

  function handleUpdateFlavorGroup(groupId: string, updates: Partial<ProductFlavorGroup>) {
    setForm((prev) => ({
      ...prev,
      flavor_groups: prev.flavor_groups.map((g) =>
        g.id === groupId ? { ...g, ...updates } : g,
      ),
    }));
  }

  function handleAddFlavorOption(groupId: string) {
    const newOpt: ProductFlavorOption = {
      id: `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      inventory_product_id: null,
    };
    setForm((prev) => ({
      ...prev,
      flavor_groups: prev.flavor_groups.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, newOpt] } : g,
      ),
    }));
  }

  function handleRemoveFlavorOption(groupId: string, optionId: string) {
    setForm((prev) => ({
      ...prev,
      flavor_groups: prev.flavor_groups.map((g) =>
        g.id === groupId
          ? { ...g, options: g.options.filter((o) => o.id !== optionId) }
          : g,
      ),
    }));
  }

  function handleUpdateFlavorOption(
    groupId: string,
    optionId: string,
    updates: Partial<ProductFlavorOption>,
  ) {
    setForm((prev) => ({
      ...prev,
      flavor_groups: prev.flavor_groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              options: g.options.map((o) =>
                o.id === optionId ? { ...o, ...updates } : o,
              ),
            }
          : g,
      ),
    }));
  }

  function closeForm() {
    setFormMode(null);
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError('');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await parseError(res));
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    const price = Number(form.price);

    const cleanedInventoryItems = form.inventory_items
      .filter((it) => it.inventory_product_id.trim().length > 0)
      .map((it) => ({
        inventory_product_id: it.inventory_product_id.trim(),
        units: Math.max(1, Math.floor(Number(it.units) || 1)),
      }));

    const inventoryBody = {
      inventory_items: cleanedInventoryItems.length > 0 ? cleanedInventoryItems : null,
      inventory_product_id: cleanedInventoryItems[0]?.inventory_product_id || null,
      inventory_units_per_sale: cleanedInventoryItems[0]?.units || 1,
    };

    const cleanedFlavorGroups = form.flavor_groups
      .map((g) => ({
        id: g.id || `fg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: g.name.trim(),
        units: Math.max(1, Number(g.units) || 1),
        required: Boolean(g.required),
        options: g.options
          .map((o) => ({
            id: o.id || `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: o.name.trim(),
            inventory_product_id: o.inventory_product_id || null,
          }))
          .filter((o) => o.name.length > 0),
      }))
      .filter((g) => g.name.length > 0 && g.options.length > 0);

    const flavorGroupsPayload = cleanedFlavorGroups.length > 0 ? cleanedFlavorGroups : null;

    if (formMode === 'create') {
      saveMutation.mutate({
        mode: 'create',
        body: {
          name: form.name,
          price,
          category: form.category,
          image_url: form.image_url || null,
          description: form.description || null,
          ...inventoryBody,
          flavor_groups: flavorGroupsPayload,
        },
      });
      return;
    }
    if (formMode === 'edit' && editingProduct) {
      saveMutation.mutate({
        mode: 'edit',
        productId: editingProduct.id,
        body: {
          name: form.name,
          price,
          category: form.category,
          image_url: form.image_url || null,
          description: form.description || null,
          active: form.active,
          ...inventoryBody,
          flavor_groups: flavorGroupsPayload,
        },
      });
    }
  }

  const displayError =
    formError ||
    (loadError instanceof Error ? loadError.message : loadError ? 'No se pudo cargar el catálogo' : '');

  return (
    <div className="catalog-manager">
      <div className="catalog-manager__toolbar">
        <div className="catalog-manager__toolbar-left">
          <div className="catalog-manager__summary" aria-live="polite">
            <span className="catalog-manager__summary-value">{filteredProducts.length}</span>
            <div className="catalog-manager__summary-copy">
              <span className="catalog-manager__summary-label">
                {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </span>
              {filteredProducts.length !== products.length && (
                <span className="catalog-manager__summary-total">de {products.length} en total</span>
              )}
            </div>
          </div>
          <label className="catalog-manager__search">
            <Search size={16} aria-hidden />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
            />
            {searchQuery && (
              <button
                type="button"
                className="catalog-manager__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </label>
          <label className="catalog-manager__filter">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as CategoryFilter)}
              aria-label="Filtrar por categoría"
            >
              <option value="all">Todas las categorías</option>
              {menuCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="button" className="catalog-manager__create" onClick={openCreateForm}>
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      {displayError && !formMode && <Alert>{displayError}</Alert>}

      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No hay productos en el menú."
          actions={
            <button type="button" className="catalog-manager__create" onClick={openCreateForm}>
              <Plus size={18} />
              Agregar el primero
            </button>
          }
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={
            searchQuery.trim()
              ? `No se encontraron productos para "${searchQuery.trim()}".`
              : 'No hay productos en esta categoría.'
          }
          actions={
            <button type="button" className="catalog-manager__cancel" onClick={clearFilters}>
              Limpiar filtros
            </button>
          }
        />
      ) : (
        <div className="catalog-manager__table-wrap">
          <table className="catalog-manager__table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td data-label="Producto">
                    <div className="catalog-manager__product-info">
                      {product.image_url ? (
                        <img src={getProxiedImageUrl(product.image_url)} alt="" className="catalog-manager__thumbnail" loading="lazy" />
                      ) : (
                        <div className="catalog-manager__thumbnail-placeholder">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <span className="catalog-manager__name">{product.name}</span>
                        {product.description && <span className="catalog-manager__description-text">{product.description}</span>}
                        {product.inventory_items && product.inventory_items.length > 0 ? (
                          <span className="catalog-manager__inventory-link">
                            Descuenta ({product.inventory_items.length}):{' '}
                            {product.inventory_items
                              .map((it) => {
                                const inv = inventoryItems.find((x) => x.id === it.inventory_product_id);
                                return `${it.units > 1 ? `${it.units}× ` : ''}${inv ? inv.name : 'Insumo'}`;
                              })
                              .join(', ')}
                          </span>
                        ) : product.inventory_item_name ? (
                          <span className="catalog-manager__inventory-link">
                            Inventario: {product.inventory_item_name}
                            {product.inventory_units_per_sale > 1
                              ? ` (×${product.inventory_units_per_sale})`
                              : ''}
                          </span>
                        ) : null}
                        {product.flavor_groups && product.flavor_groups.length > 0 && (
                          <span className="catalog-manager__inventory-link catalog-manager__flavor-badge">
                            Sabores opcionales: {product.flavor_groups.map((g) => `${g.name} (${g.options.length} opciones)`).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-label="Categoría">
                    <span className="catalog-manager__badge">
                      {getMenuCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td data-label="Precio">
                    <span className="catalog-manager__price">{formatPrice(product.price)}</span>
                  </td>
                  <td data-label="Acciones">
                    <div className="catalog-manager__actions">
                      <button
                        type="button"
                        className="catalog-manager__action"
                        onClick={() => openEditForm(product)}
                        aria-label={`Editar ${product.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      {confirmDeleteId === product.id ? (
                        <div className="catalog-manager__confirm">
                          <button
                            type="button"
                            className="catalog-manager__confirm-yes"
                            onClick={() => deleteMutation.mutate(product.id)}
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            className="catalog-manager__confirm-no"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="catalog-manager__action catalog-manager__action--danger"
                          onClick={() => setConfirmDeleteId(product.id)}
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(formMode)}
        onClose={closeForm}
        title={formMode === 'create' ? 'Nuevo producto del menú' : 'Editar producto'}
        panelClassName="catalog-manager__modal-panel"
        className="catalog-manager__modal"
      >
        <form className="catalog-manager__form" onSubmit={handleSubmit}>
          {formError && <Alert>{formError}</Alert>}

          <div className="catalog-manager__field">
            <label htmlFor="product-name">Nombre</label>
            <input
              id="product-name"
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ej. Hamburguesa clásica"
              required
              minLength={2}
              disabled={saveMutation.isPending || isUploadingImage}
            />
          </div>

          <div className="catalog-manager__field">
            <label>Imagen</label>
            <div className="catalog-manager__image-upload">
              {form.image_url ? (
                <div className="catalog-manager__image-preview">
                  <img src={getProxiedImageUrl(form.image_url)} alt="Vista previa" />
                  <button 
                    type="button" 
                    className="catalog-manager__image-clear"
                    onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                    title="Eliminar imagen"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ) : (
                <label className="catalog-manager__image-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage || saveMutation.isPending}
                    className="catalog-manager__image-input"
                  />
                  {isUploadingImage ? (
                    <Loader2 size={24} className="catalog-manager__spinner" />
                  ) : (
                    <>
                      <Upload size={24} />
                      <span>Subir foto (Max. 10MB)</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="catalog-manager__field">
            <label htmlFor="product-description">Descripción</label>
            <textarea
              id="product-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Ej. Deliciosa hamburguesa con queso cheddar..."
              rows={2}
              disabled={saveMutation.isPending || isUploadingImage}
              className="catalog-manager__textarea"
            />
          </div>

          <div className="catalog-manager__form-row-2">
            <div className="catalog-manager__field">
              <label htmlFor="product-price">Precio ({brand.currency.code})</label>
              <input
                id="product-price"
                type="number"
                step={brand.currency.code === 'COP' ? '1' : '0.01'}
                min="0"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="0.00"
                required
                disabled={saveMutation.isPending}
              />
            </div>

            <div className="catalog-manager__field">
              <label htmlFor="product-category">Categoría</label>
              <select
                id="product-category"
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
                disabled={saveMutation.isPending}
              >
                {menuCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* INSUMOS A DESCONTAR (RECETA / BOM) */}
          <div className="catalog-manager__recipe-section">
            <div className="catalog-manager__recipe-header">
              <div>
                <label className="catalog-manager__recipe-title">
                  Insumos fijos a descontar <span className="catalog-manager__hint">(opcional)</span>
                </label>
                <p className="catalog-manager__recipe-subtitle">
                  Agrega todos los ítems de inventario que se descuentan al vender este producto (ej: 1 caja, 1 bolsa, 1 salsa, tequeños base). Se descontarán siempre con cada venta.
                </p>
              </div>
              <button
                type="button"
                className="catalog-manager__btn-add-recipe-item"
                onClick={handleAddInventoryItem}
                disabled={saveMutation.isPending}
              >
                <Plus size={15} />
                <span>Agregar Insumo</span>
              </button>
            </div>

            {form.inventory_items.length === 0 ? (
              <div className="catalog-manager__recipe-empty">
                Sin insumos fijos vinculados. (Haz clic en "+ Agregar Insumo" para configurar cajas, bolsas, salsas, etc.)
              </div>
            ) : (
              <div className="catalog-manager__recipe-list">
                {form.inventory_items.map((item, index) => {
                  const selectedInv = inventoryItems.find((inv) => inv.id === item.inventory_product_id);
                  return (
                    <div key={item.id} className="catalog-manager__recipe-row">
                      <div className="catalog-manager__recipe-select-wrap">
                        <label className="catalog-manager__recipe-col-label">Insumo #{index + 1}</label>
                        <select
                          value={item.inventory_product_id}
                          onChange={(e) =>
                            handleUpdateInventoryItem(item.id, { inventory_product_id: e.target.value })
                          }
                          disabled={saveMutation.isPending}
                          required
                        >
                          <option value="">Selecciona un insumo...</option>
                          {inventoryCategories.map((cat) => {
                            const catItems = inventoryItems.filter((i) => i.category === cat.id);
                            if (catItems.length === 0) return null;
                            return (
                              <optgroup key={cat.id} label={cat.label}>
                                {catItems.map((inv) => (
                                  <option key={inv.id} value={inv.id}>
                                    {inv.name} — {inv.stock} {getInventoryUnitLabel(inv.unit).toLowerCase()}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                          {(() => {
                            const knownCategoryIds = new Set(inventoryCategories.map((c) => c.id));
                            const otherItems = inventoryItems.filter((i) => !knownCategoryIds.has(i.category));
                            if (otherItems.length === 0) return null;
                            return (
                              <optgroup label="Otros insumos">
                                {otherItems.map((inv) => (
                                  <option key={inv.id} value={inv.id}>
                                    {inv.name} — {inv.stock} {getInventoryUnitLabel(inv.unit).toLowerCase()} ({getInventoryCategoryLabel(inv.category)})
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })()}
                        </select>
                      </div>

                      <div className="catalog-manager__recipe-row-actions">
                        <div className="catalog-manager__recipe-units-wrap">
                          <label className="catalog-manager__recipe-col-label">Cant.</label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="1"
                            value={item.units}
                            onChange={(e) => handleUpdateInventoryItem(item.id, { units: e.target.value })}
                            disabled={saveMutation.isPending}
                            required
                          />
                        </div>

                        {selectedInv && (
                          <div className="catalog-manager__recipe-stock-badge" title={`Stock disponible: ${selectedInv.stock}`}>
                            Stock: {selectedInv.stock} {getInventoryUnitLabel(selectedInv.unit).toLowerCase()}
                          </div>
                        )}

                        <button
                          type="button"
                          className="catalog-manager__btn-remove-recipe-item"
                          onClick={() => handleRemoveInventoryItem(item.id)}
                          disabled={saveMutation.isPending}
                          title="Eliminar insumo"
                          aria-label={`Eliminar insumo #${index + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FLAVOR GROUPS (COMBOS) SECTION */}
          <div className="catalog-manager__flavors-section">
            <div className="catalog-manager__flavors-header">
              <div>
                <label className="catalog-manager__flavors-title">
                  Sabores y Combos <span className="catalog-manager__hint">(opcional)</span>
                </label>
                <p className="catalog-manager__flavors-subtitle">
                  Úsalo únicamente para combos o productos específicos que permiten elegir sabores (ej. Combo 24 tequeños). Permite configurar si el cliente puede pedir <strong>Todo Completo</strong> (un solo sabor) o <strong>Mitad y Mitad</strong> (dos sabores).
                </p>
              </div>
              <button
                type="button"
                className="catalog-manager__btn-add-group"
                onClick={handleAddFlavorGroup}
              >
                <Plus size={15} />
                <span>Agregar Sabores de Combo</span>
              </button>
            </div>

            {form.flavor_groups.length === 0 ? (
              <div className="catalog-manager__flavors-empty">
                Sin configuración de sabores. (Déjalo vacío para productos simples. Agrégalo solo si es un combo como 24 o 12 tequeños).
              </div>
            ) : (
              <div className="catalog-manager__flavor-groups-list">
                {form.flavor_groups.map((group, groupIndex) => {
                  const allowsHalf = group.allow_half_and_half ?? (group.units >= 2);
                  const half1 = Math.ceil(group.units / 2);
                  const half2 = Math.floor(group.units / 2);

                  return (
                    <div key={group.id} className="catalog-manager__flavor-group-card">
                      <div className="catalog-manager__flavor-group-card-header">
                        <span className="catalog-manager__flavor-group-badge">
                          Grupo #{groupIndex + 1}
                        </span>
                        <button
                          type="button"
                          className="catalog-manager__btn-remove-group"
                          onClick={() => handleRemoveFlavorGroup(group.id)}
                          title="Eliminar grupo"
                          aria-label={`Eliminar grupo #${groupIndex + 1}`}
                        >
                          <Trash2 size={15} />
                          <span className="catalog-manager__btn-remove-group-text">Eliminar grupo</span>
                        </button>
                      </div>

                      <div className="catalog-manager__flavor-group-inputs">
                        <div className="catalog-manager__group-field">
                          <label>Nombre del Grupo</label>
                          <input
                            type="text"
                            placeholder="Ej. Sabor de Tequeños"
                            value={group.name}
                            onChange={(e) =>
                              handleUpdateFlavorGroup(group.id, { name: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="catalog-manager__group-field catalog-manager__group-field--units">
                          <label>Total piezas del combo</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Ej. 24"
                            value={group.units}
                            onChange={(e) =>
                              handleUpdateFlavorGroup(group.id, {
                                units: Math.max(1, parseInt(e.target.value, 10) || 1),
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="catalog-manager__group-toggles">
                        <label className="catalog-manager__group-checkbox">
                          <input
                            type="checkbox"
                            checked={allowsHalf}
                            onChange={(e) =>
                              handleUpdateFlavorGroup(group.id, { allow_half_and_half: e.target.checked })
                            }
                          />
                          <span>
                            Permitir Mitad y Mitad {group.units >= 2 ? `(${half1} y ${half2} uds)` : ''}
                          </span>
                        </label>

                        <label className="catalog-manager__group-checkbox">
                          <input
                            type="checkbox"
                            checked={group.required}
                            onChange={(e) =>
                              handleUpdateFlavorGroup(group.id, { required: e.target.checked })
                            }
                          />
                          <span>Selección obligatoria</span>
                        </label>
                      </div>

                      <div className="catalog-manager__flavor-options-wrap">
                        <span className="catalog-manager__flavor-options-label">
                          Opciones de este grupo:
                        </span>

                        <div className="catalog-manager__flavor-options-list">
                          {group.options.map((opt, optIndex) => (
                            <div key={opt.id} className="catalog-manager__flavor-option-row">
                              <div className="catalog-manager__option-name-wrap">
                                <input
                                  type="text"
                                  className="catalog-manager__option-name-input"
                                  placeholder={`Opción #${optIndex + 1} (ej. Queso)`}
                                  value={opt.name}
                                  onChange={(e) =>
                                    handleUpdateFlavorOption(group.id, opt.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>

                              <div className="catalog-manager__option-inventory-wrap">
                                <select
                                  className="catalog-manager__option-inventory-select"
                                  value={opt.inventory_product_id ?? ''}
                                  onChange={(e) =>
                                    handleUpdateFlavorOption(group.id, opt.id, {
                                      inventory_product_id: e.target.value || null,
                                    })
                                  }
                                >
                                  <option value="">Sin descuento de inventario</option>
                                  {inventoryItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name} ({item.stock} {getInventoryUnitLabel(item.unit).toLowerCase()})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                type="button"
                                className="catalog-manager__btn-remove-opt"
                                onClick={() => handleRemoveFlavorOption(group.id, opt.id)}
                                disabled={group.options.length <= 1}
                                title="Eliminar opción"
                                aria-label="Eliminar opción"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className="catalog-manager__btn-add-opt"
                          onClick={() => handleAddFlavorOption(group.id)}
                        >
                          <Plus size={14} />
                          <span>Agregar Opción</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {formMode === 'edit' && (
            <label className="catalog-manager__checkbox">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
                disabled={saveMutation.isPending}
              />
              <span>Visible en comandas</span>
            </label>
          )}

          <div className="catalog-manager__form-actions">
            <button
              type="button"
              className="catalog-manager__cancel"
              onClick={closeForm}
              disabled={saveMutation.isPending || isUploadingImage}
            >
              Cancelar
            </button>
            <button type="submit" className="catalog-manager__submit" disabled={saveMutation.isPending || isUploadingImage}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 size={16} className="catalog-manager__spinner" />
                  Guardando...
                </>
              ) : formMode === 'create' ? (
                'Crear producto'
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default withAppProviders(ProductsManager);
