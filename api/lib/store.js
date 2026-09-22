export const orders = new Map();
export const webhooks = new Map();

export function createOrderRecord(record) {
  const normalized = {
    ...record,
    created_at: record.created_at || new Date().toISOString(),
    updated_at: record.updated_at || new Date().toISOString(),
  };
  orders.set(record.paypal_order_id || record.id, normalized);
  return normalized;
}

export function getOrderRecord(orderId) {
  if (!orderId) return null;
  return orders.get(orderId) || null;
}

export function getOrderByEmail(email) {
  return [...orders.values()].find((order) => order.customer_email === email) || null;
}

export function markOrder(orderId, updates) {
  const order = getOrderRecord(orderId);
  if (!order) return null;
  const next = { ...order, ...updates, updated_at: new Date().toISOString() };
  orders.set(orderId, next);
  return next;
}

export function registerWebhookEvent(eventId, payload) {
  if (!eventId) return false;
  if (webhooks.has(eventId)) return false;
  webhooks.set(eventId, payload || true);
  return true;
}
