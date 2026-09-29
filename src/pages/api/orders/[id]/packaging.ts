import type { APIRoute } from 'astro';
import { updateOrderPackagingPreference } from '@/lib/db/orders';
import { requireRoles } from '@/lib/auth/require-roles';

export const PATCH: APIRoute = async (context) => {
  const auth = requireRoles(context, ['admin', 'cajero', 'mesero']);
  if (auth instanceof Response) return auth;

  const orderId = context.params.id;
  if (!orderId) {
    return Response.json({ error: 'ID de pedido requerido' }, { status: 400 });
  }

  let body: { preference: 'juntos' | 'separados'; fee: number };
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (body.preference !== 'juntos' && body.preference !== 'separados') {
    return Response.json({ error: 'Preferencia inválida' }, { status: 400 });
  }

  try {
    const updated = await updateOrderPackagingPreference(orderId, body.preference, body.fee);
    return Response.json({ order: updated });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
};
