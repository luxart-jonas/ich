// sw.js – muss im selben Ordner wie index.html liegen (nicht in einem Unterordner)

self.addEventListener('push', (event) => {
  let daten = { titel: 'Ich', text: 'Noch was zu erledigen.' };
  try{ daten = event.data.json(); }catch(e){}

  event.waitUntil(
    self.registration.showNotification(daten.titel || 'Ich', {
      body: daten.text || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: daten.tag || 'halt-erinnerung',
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
