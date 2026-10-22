// Thin client for netlify/functions/services.mjs.

async function call(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api/services${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  directory: () => call(''),
  slots: (p, month) => call(`/slots?p=${encodeURIComponent(p)}${month ? `&month=${month}` : ''}`),
  book: (body) => call('/book', { method: 'POST', body }),
  request: (body) => call('/request', { method: 'POST', body }),
  cancelInfo: (t) => call(`/cancel?t=${encodeURIComponent(t)}`),
  cancel: (t) => call('/cancel', { method: 'POST', body: { t } }),
  admin: {
    login: (password) => call('/admin/login', { method: 'POST', body: { password } }),
    logout: () => call('/admin/logout', { method: 'POST' }),
    overview: (p, month) => call(`/admin${p ? `?p=${encodeURIComponent(p)}${month ? `&month=${month}` : ''}` : ''}`),
    saveOffer: (body) => call('/admin/offer', { method: 'POST', body }),
    open: (body) => call('/admin/open', { method: 'POST', body }),
    deleteSlot: (p, id) => call('/admin/delete-slot', { method: 'POST', body: { p, id } }),
    cancelBooking: (p, id) => call('/admin/cancel-booking', { method: 'POST', body: { p, id } }),
    deleteRequest: (p, id) => call('/admin/delete-request', { method: 'POST', body: { p, id } }),
  },
};

export const avatarUrl = (id) => `https://dashboard.holons.io/api/avatar?user_id=${encodeURIComponent(id)}`;
