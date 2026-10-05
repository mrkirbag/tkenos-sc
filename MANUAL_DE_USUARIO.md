# 📋 Manual de Usuario — Panel TKEÑOS.SC

> **Para quién es este manual:** Personal del local (meseros, cajeros, cocineros y administradores).
> No se requiere ningún conocimiento técnico para usar el sistema.

---

## Tabla de Contenidos

1. [Cómo ingresar al sistema](#1-cómo-ingresar-al-sistema)
2. [El Panel Principal (Inicio)](#2-el-panel-principal-inicio)
3. [Mesas](#3-mesas)
4. [Comandas (vista general)](#4-comandas-vista-general)
5. [Cómo gestionar una comanda](#5-cómo-gestionar-una-comanda)
6. [Domicilios y Para Llevar](#6-domicilios-y-para-llevar)
7. [Cocina](#7-cocina)
8. [Caja](#8-caja)
9. [Facturas](#9-facturas)
10. [Flujo de Caja](#10-flujo-de-caja)
11. [Reportes](#11-reportes)
12. [Catálogo de Productos](#12-catálogo-de-productos)
13. [Inventario](#13-inventario)
14. [Usuarios](#14-usuarios)
15. [Tasas de Cambio](#15-tasas-de-cambio)
16. [Selector de Moneda](#16-selector-de-moneda)
17. [Roles del Personal y Accesos](#17-roles-del-personal-y-accesos)

---

## 1. Cómo ingresar al sistema

1. Abre el navegador y ve a la dirección del panel que te indicaron.
2. Ingresa tu **nombre de usuario** y **contraseña**.
3. Haz clic en **Iniciar sesión**.

> Una vez dentro, verás el menú lateral izquierdo con las secciones disponibles según tu rol.

---

## 2. El Panel Principal (Inicio)

La pantalla de **Inicio** es el punto de partida del sistema. Aquí tienes una vista rápida de todo lo que está pasando en el local en este momento.

### ¿Qué ves en el panel principal?

- **Estado de Mesas** — Un resumen visual de todas las mesas del local: cuáles están libres, cuáles tienen clientes y cuáles necesitan limpieza.
- **Domicilios activos** — Los pedidos a domicilio que están en curso, para tenerlos siempre a la vista.

> Esta pantalla se actualiza automáticamente. No necesitas recargar la página.

---

## 3. Mesas

Sección: **Comandas → Mesas**

Aquí gestionas todas las mesas físicas del local.

### Estados de una mesa

| Estado | Significado |
|---|---|
| 🟢 **Libre** | Mesa disponible, sin clientes. |
| 🔴 **Ocupada** | Hay clientes sentados con una comanda abierta. |
| 🟡 **Por limpiar** | Los clientes se fueron pero la mesa necesita limpieza antes de volver a estar disponible. |

### ¿Qué puedes hacer?

- **Tocar una mesa libre** → Abre automáticamente una nueva comanda para esa mesa.
- **Tocar una mesa ocupada** → Entras directamente a la comanda activa de esa mesa.
- **Tocar una mesa en limpieza** → La mesa vuelve al estado "Libre".

### Opciones del administrador *(solo Admin)*

- **Agregar mesa** — Botón `+ Nueva mesa`. Se le asigna un número y capacidad (cantidad de personas).
- **Editar mesa** — Cambia el número o la capacidad de una mesa existente.
- **Eliminar mesa** — Borra una mesa del sistema (solo si no tiene una comanda activa).

---

## 4. Comandas (vista general)

Sección: **Comandas → Comandas**

Esta pantalla muestra una lista de todas las comandas activas del local: tanto de mesas como de domicilios y pedidos para llevar.

### Filtros disponibles

Puedes filtrar las comandas por estado:
- **Pendiente** — La comanda se acaba de abrir y está siendo tomada.
- **En cocina** — Ya se envió a preparar.
- **Lista** — El pedido está listo para entregar.
- **Pagada** — Ya se cobró.
- **Entregada** — Pedido entregado al cliente.
- **Cancelada** — El pedido fue cancelado.

### ¿Para qué sirve esta sección?

Es una vista rápida de todo lo que está en movimiento. Haz clic en cualquier comanda para abrirla y ver o editar su contenido.

---

## 5. Cómo gestionar una comanda

Al abrir una comanda (desde una mesa o desde la lista de comandas) verás dos partes principales:

### Parte izquierda – Menú de productos

- Usa el **buscador** para encontrar cualquier producto por nombre.
- Filtra por **categoría** (Tequeños, Combos, Bebidas, etc.).
- Haz clic en un producto para seleccionarlo. Aparecerá un panel para:
  - Escoger la **cantidad**.
  - Seleccionar **sabores o variantes** (si el producto las tiene): podrás elegir **Todo Completo** (un solo sabor) o **Mitad y Mitad** si el producto lo permite, indicando exactamente las cantidades de piezas.
  - Agregar **adicionales** disponibles.
  - Escribir una **nota especial** (ej: "sin sal", "bien tostado").
- Haz clic en **Agregar al pedido**.

### Selección de sabores en comandas (Todo Completo vs Mitad y Mitad)

Al tocar un producto o combo configurado con sabores (por ejemplo: Combo 24 tequeños):
1. Se abrirá la ventana de selección de sabores.
2. Si el producto tiene habilitada la opción de combinación, verás dos pestañas:
   - **Todo Completo (ej: 24 uds):** Permite elegir un solo sabor para todo el combo.
   - **Mitad y Mitad (ej: 12 / 12 uds):** Permite elegir dos sabores diferentes:
     - **1ª Mitad (12 unidades):** Selecciona el sabor de la primera mitad.
     - **2ª Mitad (12 unidades):** Selecciona el sabor de la segunda mitad.
3. Si el grupo tiene activada la **Selección obligatoria**, el botón **Agregar al pedido** se mantendrá deshabilitado hasta que se hayan completado todas las opciones requeridas.
4. En el resumen del pedido, en la pantalla de cocina y en los tickets impresos, el combo queda claramente identificado con sus sabores y cantidades exactas.

### Parte derecha – Resumen del pedido (ticket)

Aquí ves todo lo que lleva el pedido hasta el momento:
- Lista de productos con sus cantidades y precios.
- El **total** en tiempo real.
- Botones de acción.

### Botones de acción

| Botón | ¿Qué hace? |
|---|---|
| **➕ / ➖** en cantidad | Sube o baja la cantidad de un ítem ya agregado. |
| **🗑️ Eliminar ítem** | Quita un producto del pedido. |
| **Enviar a cocina** | Manda el pedido a la pantalla de Cocina para que lo preparen. |
| **Marcar como listo** | Indica que el pedido ya fue preparado (domicilios/para llevar). |
| **Cobrar** | Abre el proceso de pago. |
| **Cancelar comanda** | Cancela todo el pedido. Se pide confirmación. |
| **🖨️ Imprimir ticket** | Genera el ticket de venta o cocina. |

> **Importante:** Solo puedes agregar o quitar productos mientras la comanda está en estado **Pendiente**. Una vez enviada a cocina, el pedido queda bloqueado.

---

## 6. Domicilios y Para Llevar

Sección: **Comandas → Domicilios**

Aquí gestionas los pedidos que no son para consumir en el local.

### Tipos de pedidos

- **Domicilio** — El pedido se lleva a la dirección del cliente.
- **Para llevar** — El cliente recoge el pedido en el local.

### Crear un nuevo domicilio / para llevar

Haz clic en **+ Nuevo pedido** y completa el formulario:

| Campo | Descripción |
|---|---|
| Tipo | Domicilio o Para llevar |
| Nombre del cliente | Nombre de quien hace el pedido |
| Teléfono | Número de contacto del cliente |
| Dirección | *(Solo domicilios)* Dirección de entrega |
| Notas de entrega | Indicaciones especiales (ej: "apartamento 3B, tocar timbre") |
| Costo de domicilio | Valor adicional por el envío |
| Cobro del domicilio | Elige si el cliente paga **al momento del pedido** o **al recibirlo** |

Después de crear el pedido, entras directamente a la comanda para agregar los productos.

### Flujo normal de un domicilio

```
Pendiente → En cocina → Listo → Entregado → Pagado
```

Cuando el pedido está **Listo**, el sistema puede enviar automáticamente un mensaje de WhatsApp al cliente avisándole que su pedido está en camino.

### Filtros rápidos

- Ver solo los pedidos **activos** (en preparación).
- Ver solo los pedidos **entregados**.
- Ver el **historial completo**.

---

## 7. Cocina

Sección: **Cocina**

Esta pantalla es exclusiva para el personal de cocina. Muestra en tiempo real todos los pedidos que están pendientes de preparar.

### ¿Cómo funciona?

Cada pedido aparece en una **tarjeta** que muestra:
- El número de mesa o nombre del domicilio / para llevar.
- La hora en que fue enviado a cocina y cuántos minutos lleva esperando.
- La lista de productos a preparar, con sabores y notas especiales claramente indicados. En combos o productos combinados, se muestra el desglose exacto de piezas por sabor (ej: *1ª Mitad Queso 12 uds, 2ª Mitad Jamón y Queso 12 uds*).

### El botón "Listo"

- **Para mesas:** Marca el pedido como listo. El mesero sabrá que puede llevarlo a la mesa.
- **Para domicilios / para llevar:** Marca el pedido como listo **y** envía automáticamente un mensaje de WhatsApp al cliente avisándole.

> Esta pantalla se actualiza sola. Cuando llega un nuevo pedido, aparece automáticamente sin necesidad de recargar la página.

---

## 8. Caja

Sección: **Facturación → Caja**

Aquí se gestiona todo lo relacionado con el cobro de pedidos y el control de caja del día.

### Abrir la caja

Al inicio del turno, el cajero debe **abrir la caja**:
1. Ingresa el saldo inicial en **Pesos (COP)**.
2. Ingresa el saldo inicial en **Dólares (USD)** si corresponde.
3. Haz clic en **Abrir caja**.

### Cobrar un pedido

En la lista de pedidos listos para cobrar, haz clic en **Cobrar** en la comanda correspondiente.

Se abre el **formulario de pago** donde puedes:

- Ver el total del pedido.
- Elegir el **método de pago**:
  - Efectivo (COP)
  - Efectivo (USD)
  - Efectivo (Bolívares)
  - Transferencia / Nequi
  - Tarjeta
- **Cobro dividido:** Puedes combinar varios métodos de pago. Usa **+ Agregar método** para dividir el cobro (ej: parte en efectivo, parte en transferencia).
- Si el cliente paga en efectivo, ingresa el **monto recibido** y el sistema calcula el cambio automáticamente.
- Haz clic en **Confirmar pago** para registrar el cobro.

Después del pago se puede imprimir el **ticket de venta**.

### Cerrar la caja

Al final del turno:
1. Haz clic en **Cerrar caja**.
2. Ingresa el saldo real que tienes en físico (COP y USD).
3. El sistema compara con lo que debería haber y muestra si hay diferencias.
4. Confirma para cerrar la caja y generar el resumen del turno.

---

## 9. Facturas

Sección: **Facturación → Facturas**

Aquí consultas el historial de todas las ventas que ya fueron cobradas.

### Filtros disponibles

| Filtro | Descripción |
|---|---|
| Fecha desde / hasta | Busca ventas en un rango de fechas |
| Mesa | Filtra por una mesa específica |
| Cajero | Filtra por quién registró el cobro |

Haz clic en **Buscar** para aplicar los filtros.

### ¿Qué puedes hacer con una factura?

- **Ver el detalle** — Productos pedidos, montos y método de pago usado.
- **Imprimir el ticket** — Genera el ticket de venta nuevamente si el cliente lo necesita.

---

## 10. Flujo de Caja

Sección: **Flujo de caja** *(Solo administradores)*

Esta sección muestra el historial de todas las sesiones de caja: aperturas, cierres y montos cobrados.

### ¿Para qué sirve?

Para revisar cuánto se recaudó en cada turno y verificar que los cierres de caja cuadren correctamente.

### ¿Qué puedes ver?

- Lista de todas las sesiones de caja (abiertas y cerradas).
- Para cada sesión: fecha, cajero, saldo inicial, total cobrado, saldo final y diferencia.
- El **desglose por método de pago**: cuánto fue en efectivo, transferencia, dólares, bolívares, etc.
- Al hacer clic en una sesión, puedes ver el **detalle de cada comanda cobrada** en ese turno.

### Exportar

Puedes descargar el detalle de un día en **PDF** para llevar el registro físico.

### Filtros

- Por fecha.
- Por cajero.
- Por estado de la caja (abierta / cerrada).

---

## 11. Reportes

Sección: **Estadísticas y Reportes** *(Solo administradores)*

Esta sección muestra gráficas y resúmenes de ventas para entender el desempeño del negocio.

### Reportes disponibles

#### 📈 Ventas por día
Gráfica de barras con el total recaudado cada día en el período seleccionado.

#### 🍽️ Ventas por canal
Muestra cuánto se vendió por tipo de pedido:
- Mesas
- Domicilios
- Para llevar

#### 🛍️ Productos más vendidos
Lista y gráfica de los productos que más se venden, ordenados por cantidad.

#### 💳 Métodos de pago
Cómo pagaron los clientes: efectivo, transferencia, tarjeta, USD, bolívares, etc.

### Filtrar por fechas

Por defecto muestra el **mes actual**. Cambia las fechas "Desde" y "Hasta" y haz clic en **Aplicar**.

### Exportar

Descarga el reporte completo en **PDF** con un solo clic.

---

## 12. Catálogo de Productos

Sección: **Productos → Catálogo** *(Solo administradores)*

Aquí administras todos los productos que aparecen en el menú para tomar comandas y en la tienda online.

### Ver el catálogo y descuentos de inventario

- Usa el **buscador** para encontrar un producto por nombre, categoría o precio.
- Filtra por **categoría**: Tequeños, Combos, Pastelitos, Bebidas, etc.
- En la tabla de productos verás:
  - **Producto:** Foto, nombre y categoría del menú.
  - **Precio:** En pesos colombianos (COP).
  - **Estado:** Badge verde de **Activo** (visible en el menú) o gris de **Inactivo** (oculto).
  - **Descuentos de Inventario vinculados:** Cada producto muestra de forma directa qué insumos y cuántas unidades descuenta automáticamente al venderse (ej: `Descuenta (2): 1× Caja Combo 24, 2× Salsa de Ajo`), o bien `Sin descuento vinculado` si no descuenta insumos fijos.

### Agregar o editar un producto

Haz clic en **+ Nuevo producto** (o en el ícono de **lápiz ✏️** en cualquier producto existente) para abrir el formulario de gestión:

#### 1. Datos principales

| Campo | Descripción |
|---|---|
| **Nombre del producto** | Nombre tal como aparecerá en el menú, comandas y tickets (ej: *"Combo 24 Tequeños Tradicionales"*). |
| **Precio ($ COP)** | Precio de venta al público en pesos colombianos. |
| **Categoría** | A qué sección del menú corresponde (Tequeños, Combos, Bebidas, etc.). |
| **Descripción** | Texto opcional que describe el producto al cliente o personal. |
| **Foto del producto** | Imagen representativa. Puedes subirla desde tu equipo o arrastrarla. |
| **Estado Activo** | Casilla para activar o desactivar el producto en el menú sin tener que borrarlo. |

---

### Insumos fijos a descontar (Receta de Inventario)

Esta sección permite asociar los insumos del inventario que siempre se gastan con cada venta de este producto (por ejemplo: cajas de empaque, bolsas térmicas, salsas fijas de acompañamiento o el insumo base).

> 💡 **¿Para qué sirve la receta?**
> Al vender un producto no solo se entrega la comida: también se consumen empaques y aderezos. Configurar esta lista permite que el sistema descuente del inventario automáticamente y con total precisión cada elemento consumido en el momento de la venta.

#### ¿Cómo configurar los insumos fijos?

1. En el formulario, ubica la sección **Insumos fijos a descontar (opcional)**.
2. Haz clic en el botón **+ Agregar Insumo**.
3. Se agregará una fila con:
   - **Selector de Insumo:** Menú desplegable agrupado por categorías de inventario. Muestra el nombre del insumo, su stock actual en tiempo real y su unidad de medida (ej: `Caja Combo 24 — 120 unidades`).
   - **Cantidad (Cant.):** Número de unidades a descontar por cada producto vendido (ej: `1` para una caja, `2` para dos salsas).
   - **Insignia de Stock:** Muestra visualmente la disponibilidad actual del insumo seleccionado (`Stock: X unidades`).
   - **Botón de eliminar (papelera 🗑️):** Quita esa fila si ya no deseas vincular ese insumo.
4. Puedes hacer clic en **+ Agregar Insumo** tantas veces como insumos requiera la receta del producto.
5. Para productos simples que no requieran control de empaques o insumos fijos (por ejemplo, una bebida ya inventariada por sabor o sin control de receta), simplemente déjalo sin insumos.

---

### Sabores y Combos (Todo Completo vs Mitad y Mitad)

Esta sección está diseñada específicamente para productos o combos que permiten al cliente o mesero seleccionar sabores (por ejemplo: **Combo 24 Tequeños**, **Bandeja 12 Tequeños**, **Pastelitos surtidos**, etc.).

> 💡 **Nota importante:**
> No agregues grupos de sabores a productos simples (como una gaseosa o un agua). Úsalo únicamente para combos o productos que ofrecen selección de sabores al momento del pedido.

#### Configurar un grupo de sabores para un combo

1. Haz clic en el botón **+ Agregar Sabores de Combo**.
2. Completa los datos del grupo:
   - **Nombre del Grupo:** Identificador del grupo (ej: *"Sabor de Tequeños"* o *"Tipo de Relleno"*).
   - **Total piezas del combo (`units`):** Cantidad total de tequeños o unidades que incluye el combo (ej: `24` para un combo de 24 piezas, `12` para una docena, etc.).
   - **Permitir Mitad y Mitad (casilla):**
     - Si está **marcada**: El sistema calcula de inmediato la división exacta en piezas (ej: `12 y 12 uds` para un combo de 24) y permite al usuario elegir entre **"Todo Completo"** (un solo sabor) o **"Mitad y Mitad"** (dos sabores combinados).
     - Si está **desmarcada**: El combo solo podrá ordenarse de un único sabor para la totalidad de las piezas.
   - **Selección obligatoria (casilla):**
     - Si está **marcada**: Es indispensable que el cajero, mesero o cliente seleccione los sabores para poder agregar el producto al pedido o al carrito. Evita pedidos incompletos hacia la cocina.

#### Configurar las opciones de sabores y su descuento de inventario

Dentro del grupo de sabores, agrega todas las opciones disponibles:

1. Haz clic en **+ Agregar Opción** para añadir un nuevo sabor.
2. Completa:
   - **Nombre de la opción:** El nombre del sabor tal como lo verá el cliente (ej: *"Queso Tradicional"*, *"Jamón y Queso"*, *"Chocolate"*, *"Bocadillo y Queso"*).
   - **Selector de inventario por sabor:**
     - Si deseas descontar el insumo crudo del inventario (ej: *"Tequeño Crudo Queso"*), selecciónalo en la lista desplegable.
     - Si este sabor no necesita descontar stock o ya está controlado por otro método, déjalo en **"Sin descuento de inventario"**.
3. Usa el botón **✖** en cualquier fila para eliminar un sabor si se descontinúa.

#### ¿Cómo descuenta el inventario al venderse un combo con sabores?

El sistema calcula de manera exacta el consumo:
- **Si el pedido es "Todo Completo" (ej: 24 piezas de Queso):**
  Descuenta 24 unidades del insumo vinculado a *Queso Tradicional* + los insumos fijos configurados en la receta (caja, bolsa, salsas).
- **Si el pedido es "Mitad y Mitad" (ej: 12 piezas de Queso y 12 piezas de Jamón y Queso):**
  Descuenta 12 unidades del insumo vinculado a *Queso Tradicional* y 12 unidades del insumo vinculado a *Jamón y Queso* + los insumos fijos de la receta.

---

### Editar o desactivar un producto

- **Editar:** Haz clic en el ícono de **lápiz ✏️** en la fila del producto, modifica cualquier dato, receta o grupo de sabores y presiona **Guardar producto**.
- **Desactivar temporalmente:** Si un producto está agotado o no se ofrecerá por unos días, no lo borres. Edítalo y desmarca la casilla **"Activo"**. Dejará de mostrarse en el menú de comandas y en la tienda en línea inmediatamente, conservando toda su configuración para reactivarlo cuando desees.
- **Eliminar definitivamente:** Haz clic en el ícono de **papelera 🗑️** y confirma la eliminación.

---

## 13. Inventario

Sección: **Productos → Inventario** *(Administradores y Productores)*

Aquí llevas el control de los insumos del local.

### ¿Para qué sirve?

Permite saber cuántas unidades tienes de cada insumo y recibir alertas cuando el stock está por debajo del mínimo establecido.

### Ver el inventario

- Usa el **buscador** para encontrar un insumo.
- Filtra por **categoría**.
- Verás el stock actual y si tiene alerta de stock bajo (cuando está por debajo del mínimo configurado).

### Agregar un insumo nuevo

Haz clic en **+ Nuevo insumo**:

| Campo | Descripción |
|---|---|
| Nombre | Nombre del insumo |
| Categoría | A qué categoría pertenece |
| Unidad | La unidad de medida (Unidades) |
| Stock inicial | Cuántas unidades tienes al momento de crearlo |
| Stock mínimo | A partir de cuántas unidades se muestra la alerta de "stock bajo" |

### Registrar movimientos de stock

Haz clic en el ícono de movimiento del insumo:

- **Entrada** — Cuando recibes mercancía nueva. Indica cuántas unidades entran y el motivo (ej: "Compra a proveedor").
- **Salida** — Cuando se usa o retira mercancía manualmente. Indica cuántas unidades salen y el motivo.

### Descuento automático de stock por ventas

El stock del inventario no solo se mueve manualmente: **se descuenta automáticamente en tiempo real con cada pedido registrado y cobrado**:

1. **Por insumos fijos (Receta del menú):** Se rebajan las cantidades configuradas de empaques, bolsas, salsas o unidades base asociadas al producto en el Catálogo.
2. **Por sabores seleccionados en combos:**
   - Si se vendió **Todo Completo**, descuenta todas las piezas (ej: 24 unidades) del insumo vinculado a ese sabor.
   - Si se vendió **Mitad y Mitad**, descuenta las piezas de cada mitad de manera proporcional (ej: 12 unidades del insumo del primer sabor y 12 unidades del insumo del segundo sabor).

> 💡 **Historial:** Cada descuento generado por comanda queda registrado en el historial de movimientos del insumo con su cantidad, fecha y referencia al pedido.

### Ver historial de movimientos

Haz clic en el ícono de **historial 🕐** de cualquier insumo para ver todos los movimientos registrados: fecha, hora, tipo (entrada/salida), cantidad y motivo.

### Editar o eliminar un insumo

- **Editar:** Ícono de lápiz ✏️
- **Eliminar:** Ícono de papelera 🗑️

---

## 14. Usuarios

Sección: **Configuración → Usuarios** *(Solo administradores)*

Aquí gestionas las cuentas del personal que puede acceder al sistema.

### Ver usuarios

- Usa el **buscador** para buscar por nombre de usuario.
- Filtra por **rol** para ver solo meseros, cajeros, etc.

### Crear un usuario nuevo

Haz clic en **+ Nuevo usuario**:

| Campo | Descripción |
|---|---|
| Nombre de usuario | El nombre con el que iniciará sesión (sin espacios) |
| Contraseña | Contraseña inicial del usuario |
| Rol | El cargo que tendrá en el sistema |
| Activo | Si está activado, puede iniciar sesión |

### Editar un usuario

Haz clic en el ícono de **lápiz ✏️** para cambiar nombre, contraseña o rol.

### Activar / Desactivar un usuario

Usa el ícono de activar/desactivar para bloquear temporalmente el acceso de un empleado sin borrarlo del sistema.

### Eliminar un usuario

Haz clic en el ícono de **papelera 🗑️** para eliminar la cuenta permanentemente.

---

## 15. Tasas de Cambio

Sección: **Configuración → Tasas de cambio** *(Solo administradores)*

Aquí configuras las tasas de cambio que usa el sistema para mostrar y cobrar en diferentes monedas.

### ¿Qué puedes configurar?

| Tasa | Descripción |
|---|---|
| **Tasa USD** | Cuántos pesos (COP) vale 1 dólar americano. Ej: `4.000` |
| **Tasa BS** | Cuántos pesos (COP) vale 1 bolívar venezolano. Ej: `50` |

### ¿Cómo se usan estas tasas?

- En el selector de moneda, los precios se convierten automáticamente usando estas tasas.
- Al cobrar en USD o Bolívares, el sistema calcula el equivalente en COP con la tasa configurada.

### Guardar cambios

Actualiza los valores y haz clic en **Guardar tasas**. El sistema muestra una vista previa del ejemplo de conversión antes de confirmar.

---

## 16. Selector de Moneda

El **selector de moneda** aparece en la **esquina superior derecha** de todas las pantallas del panel.

### ¿Para qué sirve?

Permite ver todos los precios del menú en la moneda que prefieras:

| Botón | Moneda |
|---|---|
| **COP** | Pesos Colombianos (moneda base) |
| **USD** | Dólares americanos |
| **BS** | Bolívares venezolanos |

### ¿Cómo funciona?

Solo haz clic en el botón de la moneda que deseas. Los precios cambian instantáneamente en toda la pantalla.

> La selección se guarda automáticamente. La próxima vez que entres al panel, verás los precios en la última moneda que elegiste.

---

## 17. Roles del Personal y Accesos

Cada usuario tiene un **rol** que define a qué secciones puede acceder.

| Rol | Acceso |
|---|---|
| **Administrador** | Acceso completo a todas las secciones del panel |
| **Cajero** | Panel principal, Mesas, Comandas, Domicilios, Caja, Facturas |
| **Mesero** | Panel principal, Mesas, Comandas, Domicilios, Cocina |
| **Cocina** | Solo la pantalla de Cocina |
| **Productor** | Solo Inventario |

> - Un **mesero** no puede acceder a la caja ni a los reportes.
> - Un **cocinero** solo ve la pantalla de cocina.
> - Solo el **administrador** puede crear usuarios, configurar tasas y ver los reportes de ventas.

---

## Preguntas Frecuentes

**¿Qué pasa si el sistema no carga?**
Intenta recargar la página (F5 o el botón de recargar del navegador). Si el problema persiste, avisa al administrador.

**¿Puedo usar el sistema en el celular?**
Sí, el panel funciona en dispositivos móviles. La pantalla de cocina está especialmente optimizada para tablets y celulares.

**¿Cómo imprimo un ticket?**
Dentro de la comanda o al momento del pago, haz clic en el botón con ícono de impresora 🖨️. Se abrirá la ventana de impresión del navegador.

**¿Puedo agregar un producto después de enviarlo a cocina?**
No. Una vez que el pedido se envía a cocina, el contenido queda bloqueado. Si necesitas agregar algo, consulta con el administrador para cancelar y rehacer la comanda.

**¿Qué pasa si me equivoco al cobrar?**
Comunícate con el administrador. Las facturas ya emitidas quedan registradas y se pueden consultar en el historial de Facturas.

**¿Cómo sé si hay poco inventario?**
En la sección de Inventario, los insumos con stock bajo aparecen resaltados. El administrador y el productor pueden ver esto en cualquier momento.

**¿Cómo configuro un combo para que el cliente elija dos sabores mitad y mitad?**
En **Productos → Catálogo**, edita el combo. En la sección **Sabores y Combos**, agrega un grupo (ej: "Sabor de Tequeños"), ingresa el total de piezas (ej: 24) y activa la casilla **"Permitir Mitad y Mitad"**. Al tomar la comanda, aparecerán las opciones para elegir Todo Completo o 1ª Mitad y 2ª Mitad con la cantidad exacta de piezas.

**¿Cómo se descuenta el inventario si el cliente pide mitad y mitad?**
El sistema divide proporcionalmente las unidades. Por ejemplo, en un combo de 24 tequeños con mitad Queso y mitad Jamón y Queso, descuenta 12 unidades del insumo crudo de Queso y 12 unidades del insumo crudo de Jamón y Queso.

**¿Cómo asocio cajas, salsas o bolsas para que se descuenten solas con cada venta?**
En la edición del producto en el Catálogo, usa la sección **Insumos fijos a descontar (opcional)**. Haz clic en **+ Agregar Insumo**, elige el insumo (ej: "Caja Combo 24" o "Salsa Tártara") y especifica cuántas unidades se descuentan por cada venta.

---

*Manual elaborado para el equipo de TKEÑOS.SC — Versión 1.1*
