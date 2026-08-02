// sw.js – muss im selben Ordner wie index.html liegen (nicht in einem Unterordner)

self.addEventListener('push', (event) => {
  let daten = { titel: 'Ich', text: 'Noch was zu erledigen.' };
  try{ daten = event.data.json(); }catch(e){}

  // Langes, kräftig wirkendes Vibrationsmuster: mehrere lange Stöße mit kurzen Pausen.
  // Android/Chrome deckeln die Gesamtlänge serverseitig, aber das hier ist praktisch das Maximum,
  // das die Notification API hergibt. Die eigentliche Vibrationsstärke (Amplitude) steuert das
  // Handy selbst, nicht die Web-API.
  const vibrationsmuster = [500,150,500,150,500,150,500,150,500,150,500,150,800];

  event.waitUntil(
    self.registration.showNotification(daten.titel || 'Ich', {
      body: daten.text || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: daten.tag || 'halt-erinnerung',
      requireInteraction: true,
      vibrate: vibrationsmuster,
      silent: false
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({ type: 'zeige-splash' });
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow('./index.html?splash=1');
    })
  );
});
