self.addEventListener('push', event => {
  if (!event.data) return;
  let payload = {};
  try { payload = event.data.json(); } catch { payload = { title: 'Notification', body: event.data.text() }; }
  const options = {
    body: payload.body || '',
    icon: '/images/icons/icon-192.png',
    badge: '/images/icons/icon-72.png',
    data: payload.data || {},
  };
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Update', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
